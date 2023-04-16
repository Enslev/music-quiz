import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as mongoose from './services/mongoose.js';

import routes from './routes.js';

(async () => {
    console.log('Starter server...');

    dotenv.config();

    const app = express();

    app.use(morgan('tiny'));
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);

    await mongoose.init();
    app.listen(parseInt(process.env.PORT), () => {
        console.log(`Music quiz backend listening on port ${process.env.PORT}`);
    });
})();
