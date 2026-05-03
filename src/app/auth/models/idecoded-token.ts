import { JwtPayload } from "jwt-decode";

export interface IDecodedToken extends JwtPayload {
  exp: number;
  iat: number;
  userId: number;
  userName: string;
  userEmail: string;
  userGroup: string;
  roles: string[];
}
