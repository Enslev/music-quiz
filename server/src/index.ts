import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { init } from './mongoose';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ message: 'Oh no' });
    next();
};

(async () => {
    await init();
    console.log(`⚡️[server]: Connected to MongoDB`);

    app.use(morgan('tiny'));
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
})();
