import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {
    it('should get page by ID', async () => {
      const response = await request(API_BASE_URL)
        .get(`/page/${TestData.createdPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);


      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        id: TestData.createdPage.id,
      })
    });

    it('should get page by Name', async () => {
      const response = await request(API_BASE_URL)
        .get(`/page?name=${TestData.createdPage.name}&parent_id=${TestData.createdPage.parent_id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_PAGE,
        id: TestData.createdPage.id,
      })
    });

    it('should return 404 if page name not found', async () => {
      await request(API_BASE_URL)
        .get(`/page?name=${TestData.createdPage.name}_fake&parent_id=${TestData.createdPage.parent_id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(404);
    });

  }
}