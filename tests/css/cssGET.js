import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function cssGET(TestData) {
  return function () {
    it('should get CSS content', async () => {
      const response = await request(API_BASE_URL)
        .get('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(response.text).toBe(TestData.DEFAULT_CSS);
    });

    it('should fail to get CSS content without authentication', async () => {
      await request(API_BASE_URL)
        .get('/css')
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(401);
    });

    it('should fail to get CSS content without site ID', async () => {
      await request(API_BASE_URL)
        .get('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .expect(403);
    });

    it('should fail to get CSS content with incorrect Origin', async () => {
      await request(API_BASE_URL)
        .get('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', 'incorrectOrigin')
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(403);
    });
  };
}