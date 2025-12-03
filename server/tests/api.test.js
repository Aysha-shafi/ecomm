import request from 'supertest';
import app from '../server.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('API smoke tests', () => {
  beforeAll(async () => {
    try {
      execSync('node src/seed.js', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (e) {
      console.error('Seed failed:', e);
    }
  });

  it('auth login returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'password'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('public products should return 200', async () => {
    const res = await request(app).get('/api/public/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});
