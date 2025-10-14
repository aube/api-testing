import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    it('should return list of pages where Parent_id=0', async () => {
      const response = await request(API_BASE_URL)
        .get('/pages/1')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.rows)).toBe(true);
    });

    it('should return list of pages where Parent_id=1', async () => {
      const response = await request(API_BASE_URL)
        .get('/pages/1')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.rows)).toBe(true);
    });

    it('should return 404 when Parent_id is null', async () => {
      await request(API_BASE_URL)
        .get('/pages')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(404);
    });

    it.skip('should support pagination if implemented', async () => {
      const response = await request(API_BASE_URL)
        .get('/uploads?limit=10&offset=0')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  }
}