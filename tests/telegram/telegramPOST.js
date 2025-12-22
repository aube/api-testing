import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    describe('POST /telegram/user/register', () => {
      it('should register a new telegram user', async () => {
        const registerPayload = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(registerPayload)
          .expect('Content-Type', /json/)
          .expect(201);

        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('auth_token');
        expect(response.body).toHaveProperty('user_exists');

        expect(response.body.success).toBe(true);
        expect(response.body.user_exists).toBe(false);
        expect(typeof response.body.user_id).toBe('string');
        expect(typeof response.body.auth_token).toBe('string');
      });

      it('should register a telegram user with minimal data', async () => {
        const registerPayload = TestData.tgUser;
        registerPayload.telegram_id = registerPayload.telegram_id + 1;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(registerPayload)
          .expect('Content-Type', /json/)
          .expect(201);

        expect(response.body).toHaveProperty('success');
        expect(response.body.success).toBe(true);
      });

      it('should return error for invalid API key during registration', async () => {
        const registerPayload = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `wrong key`)
          .set('Origin', `${TestData.origin}`)
          .send(registerPayload)
          .expect('Content-Type', /json/)
          .expect(401);

        expect(response.body).toHaveProperty('error');
      });

      it('should indicate user exists when registering with existing telegram_id', async () => {
        const registerPayload = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(registerPayload)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('success');
        expect(response.body.success).toBe(true);
        expect(response.body.user_exists).toBe(true);
      });
    });

    describe('POST /telegram/user/login', () => {

      beforeAll(async () => {
        const loginPayload = TestData.tgUser;

        return await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(loginPayload)
      });

      it('should login an existing telegram user', async () => {
        const loginPayload = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/login')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(loginPayload)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('auth_token');

        expect(response.body.success).toBe(true);
        expect(typeof response.body.user_id).toBe('string');
        expect(typeof response.body.auth_token).toBe('string');
      });

      it('should fail login with invalid API key', async () => {
        const loginPayload = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .post('/telegram/user/login')
          .set('x-tg-service-key', `wrong key`)
          .set('Origin', `${TestData.origin}`)
          .send(loginPayload)
          .expect('Content-Type', /json/)
          .expect(401);

        expect(response.body).toHaveProperty('error');
      });

      it('should fail login for non-existent user', async () => {
        const loginPayload = {
          ...TestData.tgUser,
          telegram_id: 1,
        };

        await request(API_BASE_URL)
          .post('/telegram/user/login')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(loginPayload)
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });
  };
}