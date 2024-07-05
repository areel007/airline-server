import { Request, Response } from "express";
import User from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
