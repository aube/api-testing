import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    describe('GET /telegram/:id', () => {

      beforeAll(async () => {
        const loginPayload = TestData.tgUser;

        return await request(API_BASE_URL)
          .post('/telegram/user/register')
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .set('Origin', `${TestData.origin}`)
          .send(loginPayload)
      });

      it('should return telegram user info by telegram_id', async () => {
        const { telegram_id: telegramID } = TestData.tgUser;

        // Get user by ID
        const response = await request(API_BASE_URL)
          .get(`/telegram/user/${telegramID}/profile`)
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('telegram_id');
        expect(response.body.telegram_id).toBe(telegramID);
      });

      it('should return 404 for non-existent telegram user', async () => {
        const response = await request(API_BASE_URL)
          .get('/telegram/user/1/profile') // Non-existent ID
          .set('x-tg-service-key', `${TestData.TG_SERVICE_API_KEY}`)
          .expect('Content-Type', /json/)
          .expect(404);

        expect(response.body).toHaveProperty('error');
      });

      it('should return 401 without valid authorization token', async () => {
        const { telegram_id: telegramID } = TestData.tgUser;

        const response = await request(API_BASE_URL)
          .get(`/telegram/user/${telegramID}/profile`)
          .expect(401);

        expect(response.body).toHaveProperty('error');
      });
    });
  };
}