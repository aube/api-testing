import request from 'supertest';
import { API_BASE_URL } from '../config.js';


export default function (TestData) {
  return () => {
    it('should download a image by ID', async () => {
      const response = await request(API_BASE_URL)
        .get(`/image?uuid=${TestData.uploadedImage.uuid}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(200)
        .expect('Content-Type', TestData.uploadedImage.content_type);

      expect(response.text).toBe(TestData.TEST_FILE_CONTENT);
    });

    it('should download a image by Name', async () => {
      const response = await request(API_BASE_URL)
        .get(`/image?name=${TestData.FILENAME}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(200)
        .expect('Content-Type', TestData.uploadedImage.content_type);

      expect(response.text).toBe(TestData.TEST_FILE_CONTENT);
    });

    it('should return 404 if image not found', async () => {
      await request(API_BASE_URL)
        .get(`/image?uuid=${TestData.FAKE_UUID}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(404);
    });

    it('should return 400 if ID is missing', async () => {
      await request(API_BASE_URL)
        .get('/image')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .expect(400);
    });
  }
}
