import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    it('should return list of sites', async () => {
      const response = await request(API_BASE_URL)
        .get('/sites')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.rows)).toBe(true);
    });

    it('should return 401 if user unautorized', async () => {
      await request(API_BASE_URL)
        .get('/sites')
        .set('Origin', `${TestData.origin}`)
        .expect(401);
    });
  }
}