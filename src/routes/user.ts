import { Router } from "express";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  getUsers,
} from "../controllers/user";
import { checkRole } from "../middlewares/role";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.route("/auth/register").post(registerUser);

router.route("/auth/login").post(loginUser);

router
  .route("/auth/reset-password")
  .post(requestPasswordReset)
  .patch(resetPassword);

router
  .route("/users")
  .get(authenticateToken, checkRole("super-admin"), getUsers);

export default router;
