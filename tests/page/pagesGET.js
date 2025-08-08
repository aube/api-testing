import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    it('should return list of pages', async () => {
      const response = await request(API_BASE_URL)
        .get('/pages')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.rows)).toBe(true);
    });

    it.skip('should support pagination if implemented', async () => {
      const response = await request(API_BASE_URL)
        .get('/uploads?limit=10&offset=0')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  }
}