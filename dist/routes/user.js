"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const role_1 = require("../middlewares/role");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.route("/register").post(user_1.registerUser);
router.route("/login").post(user_1.loginUser);
router.route("/reset-password").post(user_1.requestPasswordReset).patch(user_1.resetPassword);
router
    .route("/update-role/:id")
    .patch(auth_1.authenticateToken, (0, role_1.checkRole)("super-admin"), user_1.updateRole);
router
    .route("/users")
    .get(auth_1.authenticateToken, (0, role_1.checkRole)("super-admin"), user_1.getUsers);
exports.default = router;
