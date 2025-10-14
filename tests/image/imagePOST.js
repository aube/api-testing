import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    it('should upload a image and return metadata', async () => {
      const CATEGORY = 'card'
      const DESCRIPTION = 'description 123123'
      const response = await request(API_BASE_URL)
        .post('/image')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${TestData.createdSite.uuid}`)
        .attach('file', TestData.testFilePath) // 'file' - имя поля для загрузки
        .field('description', DESCRIPTION)
        .field('category', CATEGORY)
        .expect(201);

      expect(response.body).toHaveProperty('uuid');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('size');
      expect(response.body).toHaveProperty('content_type');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('category');
      expect(response.body.description).toBe(DESCRIPTION);
      expect(response.body.category).toBe(CATEGORY);

      TestData.uploadedImage = response.body; // Сохраняем для других тестов
    });

    it('should return 400 if no image provided', async () => {
      await request(API_BASE_URL)
        .post('/image')
        .expect(401);
    });
  };
}