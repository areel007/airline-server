"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.route("/auth/register").post(user_1.registerUser);
router.route("/auth/login").post(user_1.loginUser);
router
    .route("/auth/reset-password")
    .post(user_1.requestPasswordReset)
    .patch(user_1.resetPassword);
exports.default = router;
