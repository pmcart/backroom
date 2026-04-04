export type Role = 'admin' | 'coach' | 'player';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  clubId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
