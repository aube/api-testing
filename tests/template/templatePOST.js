import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function templatePOST(TestData) {
  return function () {
    it('should create a new template', async () => {

      const response = await request(API_BASE_URL)
        .post('/template')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .send({ ...TestData.DEFAULT_TEMPLATE })
        .expect(201);

      TestData.createdTemplate = response.body;

      toEqualSentData(expect, response.body, {
        ...TestData.DEFAULT_TEMPLATE,
        id: TestData.createdTemplate.id,
      })

    });

    it('should fail to create a template without authentication', async () => {
      await request(API_BASE_URL)
        .post('/template')
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .send({
          ...TestData.DEFAULT_TEMPLATE,
          name: TestData.DEFAULT_TEMPLATE.name + '_2',
        })
        .expect(401);
    });

    it('should fail to create a template without required fields', async () => {
      await request(API_BASE_URL)
        .post('/template')
        .set('Origin', `${TestData.origin}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(400);
    });

    it('should fail to create a template without sideID', async () => {
      await request(API_BASE_URL)
        .post('/template')
        .set('Origin', `${TestData.origin}`)
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .expect(403);
    });

    it('should fail to create a template with incorrect Origin', async () => {
      await request(API_BASE_URL)
        .post('/template')
        .set('Origin', 'incorrectOrigin')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('x-site-uuid', TestData.createdSite.uuid)
        .expect(403);
    });
  };
}