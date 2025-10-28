import { Router } from "express";
import multer from "multer";

import reviewController from "../controllers/reviewController";
import authenticate from "../middlewares/authenticate";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", authenticate, upload.array("review-images"), reviewController.createReview);

router.get("/spot/:spotId", reviewController.showAllReview);
router.get("/:reviewId", reviewController.showOneReview);

router.delete("/:reviewId", authenticate, reviewController.deleteReview);

export default router;
