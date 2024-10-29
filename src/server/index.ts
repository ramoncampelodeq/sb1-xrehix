import express from 'express';
import cors from 'cors';
import { MemberRepository } from '../database/repositories/MemberRepository';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { TransactionRepository } from '../database/repositories/TransactionRepository';
import { UserRepository } from '../database/repositories/UserRepository';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserRepository.authenticate(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Members routes
app.get('/api/members', (req, res) => {
  try {
    const members = MemberRepository.getAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const id = MemberRepository.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sessions routes
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = SessionRepository.getAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/sessions', (req, res) => {
  try {
    const id = SessionRepository.create(req.body);
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Transactions routes
app.get('/api/transactions', (req, res) => {
  try {
    const transactions = TransactionRepository.getAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const id = TransactionRepository.create(req.body);
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});