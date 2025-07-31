import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { getUser } from '../../helpers/user.js';

describe('Auth flow', () => {
  let User = getUser()
  let authToken;

  describe('POST /api/v1/register', () => {
    it('should register a new user', async () => {
      const response = await request(API_BASE_URL)
        .post('/register')
        .send(User)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('username');
      expect(response.body.email).toBe(User.email);
      expect(response.body.username).toBe(User.username);
    });

    it('should return 400 for duplicate email', async () => {
      const response = await request(API_BASE_URL)
        .post('/register')
        .send(User)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /login', () => {
    it('should login with correct credentials', async () => {
      const payload = {
        username: User.username,
        password: User.password,
      }
      const response = await request(API_BASE_URL)
        .post('/login')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
      global.authToken = authToken; // Сохраняем для других тестов
    });

    it('should return 401 with wrong password', async () => {
      const response = await request(API_BASE_URL)
        .post('/login')
        .send({
          username: User.username,
          password: 'wrongpassword',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(API_BASE_URL)
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('username');
      expect(response.body.email).toBe(User.email);
      expect(response.body.username).toBe(User.username);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(API_BASE_URL)
        .get('/profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /logout', () => {
    it('should logout with valid token', async () => {
      const response = await request(API_BASE_URL)
        .post('/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully logged out');
    });
  });
})