import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import db from '../database/db';
import { hash } from '../utils/crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Check if system is already installed
app.get('/api/install/status', async (req, res) => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({ installed: result.count > 0 });
  } catch (error) {
    res.json({ installed: false });
  }
});

// Handle installation
app.post('/api/install', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if system is already installed
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (result.count > 0) {
      return res.status(400).json({ error: 'Sistema já está instalado' });
    }

    // Create database schema
    const migrationSQL = await fs.readFile(
      path.join(__dirname, '../database/migrate.ts'),
      'utf-8'
    );
    db.exec(migrationSQL);

    // Create admin user
    const hashedPassword = await hash(password);
    db.prepare(`
      INSERT INTO users (username, password, role)
      VALUES (?, ?, 'admin')
    `).run(username, hashedPassword);

    res.json({ success: true });
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Erro ao instalar o sistema' });
  }
});

// Serve installation page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Installation server running on port ${port}`);
});