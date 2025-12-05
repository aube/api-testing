import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function cssPUT(TestData) {
  return function () {
    it('should accept and return CSS content via PUT', async () => {
      const response = await request(API_BASE_URL)
        .put('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .send(TestData.DEFAULT_CSS_MOD)
        .expect(200);

      expect(response.text).toBe(TestData.DEFAULT_CSS_MOD);
    });

    it('should get new CSS content', async () => {
      const response = await request(API_BASE_URL)
        .get('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(response.text).toBe(TestData.DEFAULT_CSS_MOD);
    });

    it('should fail to put CSS content without authentication', async () => {
      await request(API_BASE_URL)
        .put('/css')
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .send(TestData.DEFAULT_CSS_MOD)
        .expect(401);
    });

    it('should fail to put CSS content without site ID', async () => {
      await request(API_BASE_URL)
        .put('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .send(TestData.DEFAULT_CSS_MOD)
        .expect(403);
    });

    it('should fail to put CSS content with incorrect Origin', async () => {
      await request(API_BASE_URL)
        .put('/css')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', 'incorrectOrigin')
        .set('x-site-uuid', TestData.createdSite.uuid)
        .send(TestData.DEFAULT_CSS_MOD)
        .expect(403);
    });
  };
}