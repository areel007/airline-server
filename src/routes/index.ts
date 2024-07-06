import { Router } from "express";
import user from "./user";

const router = Router();

router.use("/api", user);

export default router;
