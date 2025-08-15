import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {
    it('should create new site', async () => {
      const response = await request(API_BASE_URL)
        .post('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .send({ ...TestData.DEFAULT_SITE })
        .expect(201);

      TestData.createdSite = response.body; // Сохраняем для других тестов

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_SITE,
        id: TestData.createdSite.id,
      })
    });

    it('should return 400 when domain already exists', async () => {
      await request(API_BASE_URL)
        .post('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .send({ ...TestData.DEFAULT_PAGE })
        .expect(400);
    });

    it('should return 401 when user is unauthorized', async () => {
      await request(API_BASE_URL)
        .post('/site')
        .set('Origin', `${TestData.origin}`)
        .send({ ...TestData.DEFAULT_PAGE })
        .expect(401);
    });
  }
}