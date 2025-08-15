import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {
    it('should create page and return new page data', async () => {

      const response = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .send({ ...TestData.DEFAULT_PAGE })
        .expect(201);

      TestData.createdPage = response.body; // Сохраняем для других тестов

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        id: TestData.createdPage.id,
      })
    });

    it('should return 400 when page name already exists', async () => {
      await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .send({ ...TestData.DEFAULT_PAGE })
        .expect(400);
    });
  }
}