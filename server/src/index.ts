import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { initMongo } from './mongoose';
import { routes } from './routes';
import { initRedis } from './services/redis';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const init = () => {
    const initMongoPromise = initMongo();
    const initRedisPromise = initRedis();

    return Promise.all([
        initMongoPromise,
        initRedisPromise,
    ]);
};

(async () => {
    await init();
    app.use(morgan('tiny'));
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
    app.use('*', (_, res: Response) => {
        res.status(404).json({
            message: 'Not Found',
        });
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
        next();
    });

    app.listen(port, () => {
        console.log(`⚡️ Server is running at http://localhost:${port}`);
    });
})();
