import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function (TestData) {
  return () => {

    let parentPage
    let childPage1
    let childPage2

    beforeAll(async () => {
      // First create a parent page
      const parentPageData = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_parent_for_children',
      };

      const parentResponse = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(parentPageData)
        .expect(201);

      parentPage = parentResponse.body;

      // Create child pages
      const childPageData1 = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_child_1',
        parent_id: parentPage.id,
      };

      const childResponse1 = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(childPageData1)
        .expect(201);

      childPage1 = childResponse1.body;

      const childPageData2 = {
        ...TestData.DEFAULT_PAGE,
        name: TestData.FAKE_NAME + '_child_2',
        parent_id: parentPage.id,
      };

      const childResponse2 = await request(API_BASE_URL)
        .post('/page')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send(childPageData2)
        .expect(201);

      childPage2 = childResponse2.body;
    })

    afterAll(async () => {
      // Clean up: delete the created pages
      await request(API_BASE_URL)
        .delete('/page?id=' + childPage1.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      await request(API_BASE_URL)
        .delete('/page?id=' + childPage2.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      await request(API_BASE_URL)
        .delete('/page?id=' + parentPage.id)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);
    })

    it('should return list of page children', async () => {
      // Now test the children endpoint
      const response = await request(API_BASE_URL)
        .get(`/page/children?id=${parentPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      // Should return an array with the children
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      // Check that both children are in the response
      const childIds = response.body.map(child => child.id);
      expect(childIds).toContain(childPage1.id);
      expect(childIds).toContain(childPage2.id);
    });

    it('should return empty array when page has no children', async () => {
      // Test with a page that has no children
      const response = await request(API_BASE_URL)
        .get(`/page/children?id=${TestData.createdPage.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 400 when page ID is missing', async () => {
      await request(API_BASE_URL)
        .get('/page/children')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });

    it('should return 404 when page ID does not exist', async () => {
      await request(API_BASE_URL)
        .get(`/page/children?id=${TestData.createdPage.id + 1000}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .expect(400);
    });
  }
}