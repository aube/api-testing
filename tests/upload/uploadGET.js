import request from 'supertest';
import { API_BASE_URL } from '../config.js';


export default function (TestData) {
  return () => {
    it('should download a file by ID', async () => {
      const response = await request(API_BASE_URL)
        .get(`/upload?uuid=${TestData.uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(200)
        .expect('Content-Type', TestData.uploadedFile.content_type);

      expect(response.text).toBe(TestData.TEST_FILE_CONTENT);
    });

    it('should download a file by Name', async () => {
      const response = await request(API_BASE_URL)
        .get(`/upload?name=${TestData.FILENAME}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(200)
        .expect('Content-Type', TestData.uploadedFile.content_type);

      expect(response.text).toBe(TestData.TEST_FILE_CONTENT);
    });

    it('should return 404 if file not found', async () => {
      await request(API_BASE_URL)
        .get(`/upload?uuid=${TestData.FAKE_UUID}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(404);
    });

    it('should return 400 if ID is missing', async () => {
      await request(API_BASE_URL)
        .get('/upload')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(400);
    });
  }
}
