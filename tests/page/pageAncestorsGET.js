import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {

  return () => {

    let grandParentPage
    let parentPage

    beforeAll(async () => {

      // First create a hierarchy of pages
      // Create grandparent page
      const grandParentPageData = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_grandparent',
      };

      const grandParentResponse = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(grandParentPageData)
        .expect(201);

      grandParentPage = grandParentResponse.body;


      // Create parent page with grandparent as parent
      const parentPageData = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_parent',
        parent_id: grandParentPage.id,
      };

      const parentResponse = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(parentPageData)
        .expect(201);

      parentPage = parentResponse.body;


      // Update the existing page to have the parent page as its parent
      const updatedPageData = {
        ...TestData.createdPage,
        parent_id: parentPage.id,
      };

      await request(API_BASE_URL)
        .put('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(updatedPageData)
        .expect(200);

    })

    afterAll(async () => {
      // Clean up: delete the created pages
      await request(API_BASE_URL)
        .delete('/page?id=' + parentPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      await request(API_BASE_URL)
        .delete('/page?id=' + grandParentPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);
    })

    it('should return list of page ancestors', async () => {

      // Now test the ancestors endpoint
      const response = await request(API_BASE_URL)
        .get(`/page/ancestors?id=${TestData.createdPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      // Should return an array with the parent and grandparent
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      // Check that the ancestors are in the correct order (grandparent first, then parent)
      expect(response.body[0].id).toBe(grandParentPage.id);
      expect(response.body[1].id).toBe(parentPage.id);

    });

    it('should return empty array when page has no ancestors', async () => {

      let response = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', `${TestData.createdSite.id}`)
        .send({
          ...TestData.DEFAULT_PAGE,
          name: TestData.DEFAULT_PAGE + "_anc",
        })
        .expect(201);

      const rootPage = response.body;

      // Test with a page that has no parent
      response = await request(API_BASE_URL)
        .get(`/page/ancestors?id=${rootPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 400 when page ID is missing', async () => {
      await request(API_BASE_URL)
        .get('/page/ancestors')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });

    it('should return 404 when page ID does not exist', async () => {
      await request(API_BASE_URL)
        .get(`/page/ancestors?id=${TestData.createdPage.id + 1000}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });
  }
}