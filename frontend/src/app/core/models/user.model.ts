export type Role = 'superadmin' | 'admin' | 'coach' | 'player';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  clubId: string | null;
  clubName: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
