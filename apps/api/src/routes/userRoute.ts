import { Router } from "express";
import multer from "multer";

import userController from "../controllers/userController";
import authenticate from "../middlewares/authenticate";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/nickname/check", userController.checkNickname);
router.post("/nickname", authenticate, userController.createNickname);
router.patch("/nickname", authenticate, userController.changeNickname);
router.post(
  "/image",
  authenticate,
  upload.single("profile-image"),
  userController.uploadProfileImage
);

router.post("/", authenticate, userController.createUserInfo);
router.get("/", authenticate, upload.single("profile-image"), userController.getUserInfo);

router.patch("/term", authenticate, userController.changeTerm);

export default router;
