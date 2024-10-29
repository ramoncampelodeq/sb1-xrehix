import { create } from 'zustand';
import { Member, MemberFormData } from '../types/member';

interface MemberState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  addMember: (member: MemberFormData) => void;
  updateMember: (id: number, member: MemberFormData) => void;
  deleteMember: (id: number) => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  addMember: (memberData) => {
    const members = get().members;
    const newMember = {
      ...memberData,
      id: Math.max(0, ...members.map(m => m.id)) + 1
    };
    set({ members: [...members, newMember] });
  },

  updateMember: (id, memberData) => {
    const members = get().members;
    set({
      members: members.map(member =>
        member.id === id ? { ...memberData, id } : member
      )
    });
  },

  deleteMember: (id) => {
    const members = get().members;
    set({ members: members.filter(member => member.id !== id) });
  }
}));