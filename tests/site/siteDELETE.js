import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a site', async () => {
      await request(API_BASE_URL)
        .delete('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(200);

      // Проверяем, что site deleted=true
      const response = await request(API_BASE_URL)
        .get('/site/' + TestData.createdSite.domain)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(200);

      expect(response.body).toHaveProperty('deleted');
      expect(response.body.deleted).toBe(true);
    });

    it('should undelete a site', async () => {
      await request(API_BASE_URL)
        .delete('/site/undo')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(200);

      // Проверяем, что site deleted=false
      const response = await request(API_BASE_URL)
        .get('/site/' + TestData.createdSite.domain)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(200);

      expect(response.body).toHaveProperty('deleted');
      expect(response.body.deleted).toBe(false);
    });
  }
}




