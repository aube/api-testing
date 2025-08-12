import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a site by ID', async () => {
      await request(API_BASE_URL)
        .delete('/site?id=' + TestData.createdSite.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      // Проверяем, что site deleted=true
      const response = await request(API_BASE_URL)
        .get('/site/' + TestData.createdSite.name)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('deleted');
      expect(response.body.deleted).toBe(true);
    });

    it('should undelete a site by ID', async () => {
      await request(API_BASE_URL)
        .delete('/site/undo?id=' + TestData.createdSite.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      // Проверяем, что site deleted=false
      const response = await request(API_BASE_URL)
        .get('/site/' + TestData.createdSite.name)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('deleted');
      expect(response.body.deleted).toBe(false);
    });
  }
}




