import { JwtPayload } from "jsonwebtoken";

interface IJwtPayload {
  user?: JwtPayload;
  role?: string;
  email?: string;
}

export default IJwtPayload;
