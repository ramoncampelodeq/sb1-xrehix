export type SessionDegree = 'apprentice' | 'fellowcraft' | 'master';

export interface Session {
  id: number;
  date: string;
  time: string;
  degree: SessionDegree;
  agenda: string;
  minutesUrl?: string;
  attendees: number[];
}

export interface SessionFormData extends Omit<Session, 'id' | 'attendees'> {}