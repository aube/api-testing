import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {
    it('should upload a file and return file metadata', async () => {
      const CATEGORY = 'card'
      const DESCRIPTION = 'description 123123'
      const response = await request(API_BASE_URL)
        .post('/upload')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
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

      TestData.uploadedFile = response.body; // Сохраняем для других тестов
    });

    it('should return 400 if no file provided', async () => {
      await request(API_BASE_URL)
        .post('/upload')
        .expect(401);
    });
  };
}