"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
exports.checkRole = checkRole;
