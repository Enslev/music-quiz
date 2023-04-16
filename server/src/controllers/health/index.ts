import { Router } from "express"
import { ruok } from "./controller.js"

const router = Router();

router.get('/ruok', ruok);

export default router;