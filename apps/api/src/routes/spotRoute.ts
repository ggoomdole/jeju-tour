import { Router } from 'express';

import spotController from '../controllers/spotController';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.get("/dataSpot", spotController.getNearbySpots);

router.post("/add/req", authenticate, spotController.reqSpot);
router.get("/add/check/:roadId", authenticate, spotController.reqCheck);
router.patch("/add/accept/:roadId", authenticate, spotController.reqProcessing);

export default router;