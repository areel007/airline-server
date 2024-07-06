import { Router } from "express";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/user";

const router = Router();

router.route("/auth/register").post(registerUser);

router.route("/auth/login").post(loginUser);

router
  .route("/auth/reset-password")
  .post(requestPasswordReset)
  .patch(resetPassword);

export default router;
