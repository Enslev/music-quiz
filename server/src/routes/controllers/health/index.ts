import { Router } from 'express';
import { ruok } from './controller';

const healthRoutes = Router();

healthRoutes.get('/ruok', ruok);

export { healthRoutes };
