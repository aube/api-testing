import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a image by ID', async () => {
      await request(API_BASE_URL)
        .delete(`/image?uuid=${TestData.uploadedImage.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(204);

      // Проверяем, что файл действительно удален
      await request(API_BASE_URL)
        .get(`/image?uuid=${TestData.uploadedImage.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(404);
    });

    it('should return 404 if image not found', async () => {
      await request(API_BASE_URL)
        .delete(`/image?uuid=${TestData.FAKE_UUID}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(404);
    });
  };
}
