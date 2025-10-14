import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {
    it('should get site by Domain', async () => {
      const response = await request(API_BASE_URL)
        .get(`/site/${TestData.createdSite.domain}`)
        .set('Origin', `${TestData.origin}`)
        .expect(200);

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        uuid: TestData.createdSite.uuid,
      })
    });

    it('should return 404 if Domain not found', async () => {
      await request(API_BASE_URL)
        .get(`/site/${TestData.createdSite.domain}_fake`)
        .set('Origin', `${TestData.origin}`)
        .expect(404);
    });

    it('should return 400 if Domain is missing', async () => {
      await request(API_BASE_URL)
        .get('/site')
        .set('Origin', `${TestData.origin}`)
        .expect(404);
    });
  }
}