export type PlayerStatus = 'active' | 'injured' | 'recovery';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  position: string | null;
  status: PlayerStatus;
  squadId: string;
  clubId: string;
  userId?: string | null;
}

export interface CoachAssignment {
  id: string;
  userId: string;
  squadId: string;
  clubId: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string } | null;
}

export interface Squad {
  id: string;
  name: string;
  ageGroup: string;
  clubId: string;
  players: Player[];
  coachAssignments: CoachAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerPayload {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  position?: string;
  status?: PlayerStatus;
}

export interface AvailableCoach {
  id: string;
  firstName: string;
  lastName: string;
}
