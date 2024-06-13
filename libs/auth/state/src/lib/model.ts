import { User } from '@item-catalogue/dto';

export interface AuthState {
  user: User | null;
  accessToken: string;
}
