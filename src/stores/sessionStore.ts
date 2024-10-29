import { create } from 'zustand';
import { Session, SessionFormData } from '../types/session';

interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  addSession: (session: SessionFormData) => void;
  updateSession: (id: number, session: SessionFormData) => void;
  deleteSession: (id: number) => void;
  addAttendee: (sessionId: number, memberId: number) => void;
  removeAttendee: (sessionId: number, memberId: number) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  addSession: (sessionData) => {
    const sessions = get().sessions;
    const newSession = {
      ...sessionData,
      id: Math.max(0, ...sessions.map(s => s.id)) + 1,
      attendees: []
    };
    set({ sessions: [...sessions, newSession] });
  },

  updateSession: (id, sessionData) => {
    const sessions = get().sessions;
    set({
      sessions: sessions.map(session =>
        session.id === id
          ? { ...session, ...sessionData }
          : session
      )
    });
  },

  deleteSession: (id) => {
    const sessions = get().sessions;
    set({ sessions: sessions.filter(session => session.id !== id) });
  },

  addAttendee: (sessionId, memberId) => {
    const sessions = get().sessions;
    set({
      sessions: sessions.map(session =>
        session.id === sessionId && !session.attendees.includes(memberId)
          ? { ...session, attendees: [...session.attendees, memberId] }
          : session
      )
    });
  },

  removeAttendee: (sessionId, memberId) => {
    const sessions = get().sessions;
    set({
      sessions: sessions.map(session =>
        session.id === sessionId
          ? { ...session, attendees: session.attendees.filter(id => id !== memberId) }
          : session
      )
    });
  }
}));