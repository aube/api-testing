import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function templatePUT(TestData) {
  return function () {
    it('should update an existing template', async () => {
      // First ensure we have a template created
      expect(TestData.createdTemplate).toBeDefined();

      const updatedTpl = {
        id: TestData.createdTemplate.id,
        name: `${TestData.createdTemplate.name}_updated`,
        html:`${TestData.createdTemplate.html}_updated`,
        css:`${TestData.createdTemplate.css}_updated`,
        json:`${TestData.createdTemplate.json}_updated`,
        js:`${TestData.createdTemplate.js}_updated`,
      }

      const response = await request(API_BASE_URL)
        .put('/template')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          ...updatedTpl,
        })
        .expect(200);

      TestData.updatedTemplate = response.body;

      toEqualSentData(expect, response.body, {
        ...updatedTpl,
      })
    });


    it('should update only name field', async () => {
      await request(API_BASE_URL)
        .put('/template')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          id: TestData.createdTemplate.id ,
          name: `${TestData.FAKE_NAME}_updated_again`,
        })
        .expect(200);
    });

    it('should fail to update a template without authentication', async () => {
      await request(API_BASE_URL)
        .put('/template')
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          id: TestData.createdTemplate.id,
          name: `${TestData.FAKE_NAME}_updated_again`,
        })
        .expect(401);
    });

    it('should fail to update a template without ID', async () => {
      await request(API_BASE_URL)
        .put('/template')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          name: `${TestData.FAKE_NAME}_updated_again`,
        })
        .expect(400);
    });

    it('should fail to update a non-existent template', async () => {
      await request(API_BASE_URL)
        .put('/template')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-id', TestData.createdSite.id)
        .send({
          ...TestData.createdTemplate,
          id: TestData.createdTemplate.id + 1000,
        })
        .expect(400);
    });

  };
}