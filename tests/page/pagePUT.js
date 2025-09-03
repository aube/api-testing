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
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
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
        template_anons: "template_anons_2",
        icon: "icon_2",
        menu: "menu_2",
        image_id: 8,
        anons: "anons_2",
      }

      const response = await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(pageData)
        .expect(200);

      updatedPage = { ...pageData }

      toEqualSentData(expect, response.body, pageData)
    });

    it('should return 400 when page ID is not exists', async () => {
      await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
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
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
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
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          ...updatedPage,
          name: TestData.DEFAULT_PAGE.name,
        })
        .expect(400);
    });

    it('should change page parent and return updated page data', async () => {
      // Create another page to use as parent
      const parentPageData = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_parent',
      };

      const parentResponse = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(parentPageData)
        .expect(201);

      const parentPage = parentResponse.body;

      // Change the page's parent
      const expectedPageData = {
        ...updatedPage,
        parent_id: parentPage.id,
      };

      const response = await request(API_BASE_URL)
        .put(`/page/${updatedPage.id}/parent/${parentPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      toEqualSentData(expect, response.body, expectedPageData);

      // Clean up: delete the parent page
      await request(API_BASE_URL)
        .delete('/page?id=' + parentPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);
    });

    it('should return 400 when parent page ID does not exist', async () => {
      await request(API_BASE_URL)
        .put(`/page/${updatedPage.id}/parent/${updatedPage.id + 1000}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });

    it('should return 400 when page ID is zero', async () => {
      await request(API_BASE_URL)
        .put(`/page/0/parent/null`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });

    it('should return 400 when parent page ID is NULL', async () => {
      await request(API_BASE_URL)
        .put(`/page/${updatedPage.id}/parent/null`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });

    it('should return 400 when parent page ID is same target page ID', async () => {
      await request(API_BASE_URL)
        .put(`/page/${updatedPage.id}/parent/${updatedPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });
  }
}



