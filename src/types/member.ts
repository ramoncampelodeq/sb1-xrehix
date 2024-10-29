export interface Member {
  id: number;
  name: string;
  cpf: string;
  profession: string;
  degree: 'apprentice' | 'fellowcraft' | 'master';
  birthday: string;
  email: string;
  phone: string;
  password?: string;
  highDegrees?: number[];
  relatives?: {
    name: string;
    birthday: string;
    relationship: string;
  }[];
  joinDate: string;
}

export interface MemberFormData extends Omit<Member, 'id'> {}