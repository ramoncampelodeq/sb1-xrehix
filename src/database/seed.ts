import db from './db';
import { hash } from '../utils/crypto';

// Seed initial admin user
const adminPassword = await hash('admin123');

db.prepare(`
  INSERT OR IGNORE INTO users (username, password, role)
  VALUES (?, ?, ?)
`).run('admin', adminPassword, 'admin');

// Seed sample members
const members = [
  {
    name: 'João Silva',
    cpf: '123.456.789-00',
    profession: 'Engenheiro',
    degree: 'master',
    birthday: '1980-05-15',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    join_date: '2010-03-20'
  },
  {
    name: 'Pedro Santos',
    cpf: '987.654.321-00',
    profession: 'Advogado',
    degree: 'fellowcraft',
    birthday: '1985-08-25',
    email: 'pedro@example.com',
    phone: '(11) 91234-5678',
    join_date: '2015-06-10'
  }
];

const insertMember = db.prepare(`
  INSERT OR IGNORE INTO members (
    name, cpf, profession, degree, birthday, email, phone, join_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const member of members) {
  insertMember.run(
    member.name,
    member.cpf,
    member.profession,
    member.degree,
    member.birthday,
    member.email,
    member.phone,
    member.join_date
  );
}

// Seed sample sessions
const sessions = [
  {
    date: '2024-03-15',
    time: '20:00',
    degree: 'master',
    agenda: 'Reunião administrativa'
  },
  {
    date: '2024-03-22',
    time: '20:00',
    degree: 'apprentice',
    agenda: 'Instrução para Aprendizes'
  }
];

const insertSession = db.prepare(`
  INSERT OR IGNORE INTO sessions (date, time, degree, agenda)
  VALUES (?, ?, ?, ?)
`);

for (const session of sessions) {
  insertSession.run(
    session.date,
    session.time,
    session.degree,
    session.agenda
  );
}

console.log('Database seeded successfully!');