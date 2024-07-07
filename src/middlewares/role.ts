import { Response, NextFunction } from "express";
import IRequestHandlers from "../types/handlers";

export const checkRole = (requiredRole: string) => {
  return (req: IRequestHandlers, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
