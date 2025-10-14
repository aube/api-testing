import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a page by ID', async () => {
      await request(API_BASE_URL)
        .delete('/page?id=' + TestData.createdPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);
    });

    it('should return 404 if page not found', async () => {
      await request(API_BASE_URL)
        .get('/page/' + TestData.createdPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(404);
    });
  }
}

