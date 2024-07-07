import { Request } from "express";
import IJwtPayload from "./jwt";

interface IRequestHandlers extends Request {
  user?: IJwtPayload;
}

export default IRequestHandlers;
