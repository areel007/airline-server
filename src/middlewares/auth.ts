import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import IJwtPayload from "../types/jwt";
import IRequestHandlers from "../types/handlers";

export const validateUser = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateEmail = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

export const validatePassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const authenticateToken = (
  req: IRequestHandlers,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  jwt.verify(
    token,
    secret as jwt.Secret,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = decoded as IJwtPayload;
      next();
    }
  );
};
