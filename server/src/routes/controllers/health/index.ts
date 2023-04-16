import { Router } from 'express';
import { ruok } from './controller';

const router = Router({ mergeParams: true });

router.get('/ruok', ruok);

export default router;
