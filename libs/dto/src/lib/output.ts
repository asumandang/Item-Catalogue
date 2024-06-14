import { User } from "./user";

export interface AuthOutput {
  user: User;
  accessToken: string;
  expiresIn: number;
}
