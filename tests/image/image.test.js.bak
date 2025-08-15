import path from 'path';
import fs from 'fs';
import request from 'supertest';
import { fileURLToPath } from 'url';
import { API_BASE_URL } from '../config.js';
import { getToken } from '../../helpers/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let authToken = "global.authToken";


describe('External Image Server API', () => {
  const TEST_FILE_CONTENT = 'Test file content'
  const FAKE_UUID = 'aaaaaaaa-aaaa-bbbb-cccc-aaaabbbbcccc'
  const FILENAME = 'testfile.txt'
  const testFilePath = path.join(__dirname, FILENAME);
  let uploadedFile;

  beforeAll(async () => {
    // Создаем тестовый файл
    fs.writeFileSync(testFilePath, TEST_FILE_CONTENT);
    authToken = await getToken()
  });

  afterAll(() => {
    // Удаляем тестовый файл
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('POST /image', () => {
    it('should upload a file and return file metadata', async () => {
      const CATEGORY = 'card'
      const DESCRIPTION = 'description 123123'
      const response = await request(API_BASE_URL)
        .post('/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFilePath) // 'file' - имя поля для загрузки
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

      uploadedFile = response.body; // Сохраняем для других тестов
    });

    it('should return 400 if no file provided', async () => {
      await request(API_BASE_URL)
        .post('/image')
        .expect(401);
    });
  });

  describe('GET /image', () => {
    it('should download a file by ID', async () => {
      const response = await request(API_BASE_URL)
        .get(`/image?uuid=${uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', uploadedFile.content_type);

      expect(response.text).toBe(TEST_FILE_CONTENT);
    });

    it('should download a file by Name', async () => {
      const response = await request(API_BASE_URL)
        .get(`/image?name=${FILENAME}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect('Content-Type', uploadedFile.content_type);

      expect(response.text).toBe(TEST_FILE_CONTENT);
    });

    it('should return 404 if file not found', async () => {
      await request(API_BASE_URL)
        .get(`/image?uuid=${FAKE_UUID}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 if ID is missing', async () => {
      await request(API_BASE_URL)
        .get('/image')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('GET /images', () => {
    it('should return list of uploaded files', async () => {
      const response = await request(API_BASE_URL)
        .get('/images')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(response.body.rows.some(file => file.uuid === uploadedFile.uuid)).toBe(true);
    });

    it.skip('should support pagination if implemented', async () => {
      const response = await request(API_BASE_URL)
        .get('/images?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /image', () => {
    it('should delete a file by ID', async () => {
      await request(API_BASE_URL)
        .delete(`/image?uuid=${uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Проверяем, что файл действительно удален
      await request(API_BASE_URL)
        .get(`/image?uuid=${uploadedFile.uuid}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 if file not found', async () => {
      await request(API_BASE_URL)
        .delete(`/image?uuid=${FAKE_UUID}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

});