import request from 'supertest';
import { API_BASE_URL } from '../config.js';

export default function templateGET(TestData) {
  return function () {
    it('should get a template by ID', async () => {
      // First ensure we have a template created
      expect(TestData.createdTemplate).toBeDefined();

      const response = await request(API_BASE_URL)
        .get(`/template/${TestData.createdTemplate.id}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(TestData.createdTemplate.id);
      expect(response.body.name).toBe(TestData.createdTemplate.name);
    });

    it('should fail to get a template with invalid ID format', async () => {
      await request(API_BASE_URL)
        .get(`/template/unformat`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(400);
    });

    it('should fail to get a template without authentication', async () => {
      await request(API_BASE_URL)
        .get(`/template/${TestData.createdTemplate.id}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(401);
    });

    it('should fail to get a template with invalid ID', async () => {
      await request(API_BASE_URL)
        .get(`/template/${TestData.createdTemplate.id + 1000}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(404);
    });
  };
}