import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a file by ID', async () => {
      await request(API_BASE_URL)
        .delete('/page?id=' + TestData.createdPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(200);

      // Проверяем, что файл действительно удален
      await request(API_BASE_URL)
        .get('/page?id=' + TestData.createdPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(404);
    });

    it('should return 404 if file not found', async () => {
      await request(API_BASE_URL)
        .get('/page?id=' + TestData.createdPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(404);
    });
  }
}

