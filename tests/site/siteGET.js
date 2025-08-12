import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {
    it('should get site by Domain', async () => {
      const response = await request(API_BASE_URL)
        .get(`/site?domain=${TestData.createdSite.domain}`)
        .expect(200);

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        id: TestData.createdSite.id,
      })
    });

    it('should get site by Name', async () => {
      const response = await request(API_BASE_URL)
        .get(`/site/${TestData.createdSite.name}`)
        .expect(200);

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        id: TestData.createdSite.id,
      })
    });

    it('should return 404 if Domain not found', async () => {
      await request(API_BASE_URL)
        .get(`/site?domain=${TestData.createdSite.domain}_fake`)
        .expect(404);
    });

    it('should return 404 if Domain not found', async () => {
      await request(API_BASE_URL)
        .get(`/site?domain=${TestData.createdSite.domain}_fake`)
        .expect(404);
    });

    it('should return 400 if Domain and Name is missing', async () => {
      await request(API_BASE_URL)
        .get('/site')
        .expect(400);
    });
  }
}