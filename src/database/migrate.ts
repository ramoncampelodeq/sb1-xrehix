import db from './db';

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Members table
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    profession TEXT NOT NULL,
    degree TEXT NOT NULL CHECK (degree IN ('apprentice', 'fellowcraft', 'master')),
    birthday DATE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    join_date DATE NOT NULL,
    high_degrees TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Member relatives
  CREATE TABLE IF NOT EXISTS member_relatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    birthday DATE NOT NULL,
    relationship TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    degree TEXT NOT NULL CHECK (degree IN ('apprentice', 'fellowcraft', 'master')),
    agenda TEXT NOT NULL,
    minutes_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Session attendance
  CREATE TABLE IF NOT EXISTS session_attendance (
    session_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    PRIMARY KEY (session_id, member_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
  );

  -- Transactions table
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL CHECK (
      category IN ('dues', 'donation', 'event', 'maintenance', 'utility', 'charity', 'other')
    ),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    member_id INTEGER,
    receipt_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    month INTEGER,
    year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
  );

  -- Activity log
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);