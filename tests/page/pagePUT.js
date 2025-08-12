import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {

    let updatedPage
    let existingName

    beforeAll(async () => {
      existingName = TestData.FAKE_NAME;

      updatedPage = {
        ...TestData.DEFAULT_PAGE,
        name: existingName,
      }

      const response = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .send({ ...updatedPage });

      updatedPage = response.body

    });

    it('should update page and return updated page data', async () => {
      const pageData = {
        ...updatedPage,
        name: TestData.FAKE_NAME + '_2',
        meta: "meta_2",
        title: "title_2",
        category: "category_2",
        template: "template_2",
        h1: "h1_2",
        content: "content_2",
        content_short: "content_short_2",
      }

      const response = await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .send(pageData)
        .expect(200);

      toEqualSentData(expect, response.body, pageData)
    });

    it('should return 400 when page ID is not exists', async () => {
      await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .send({
          ...updatedPage,
          id: updatedPage.id + 1000,
        })
        .expect(400);
    });

    it('should return 400 when page ID is NULL', async () => {
      await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .send({
          ...updatedPage,
          id: null,
        })
        .expect(400);
    });

    it('should return 400 when page same name used in other page', async () => {
      await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .send({
          ...updatedPage,
          name: TestData.DEFAULT_PAGE.name,
        })
        .expect(400);
    });
  }
}