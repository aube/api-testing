import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    it('should delete a file by ID', async () => {
      await request(API_BASE_URL)
        .delete(`/upload?uuid=${TestData.uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(204);

      // Проверяем, что файл действительно удален
      await request(API_BASE_URL)
        .get(`/upload?uuid=${TestData.uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(404);
    });

    it('should return 404 if file not found', async () => {
      await request(API_BASE_URL)
        .delete(`/upload?uuid=${TestData.FAKE_UUID}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .expect(404);
    });
  };
}
