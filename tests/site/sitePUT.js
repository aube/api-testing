import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { toEqualSentData } from '../../helpers/checkBody.js';

export default function (TestData) {
  return () => {

    let updatedSite

    beforeAll(async () => {
      updatedSite = Object.entries(TestData.createdSite).reduce((acc, [k, v]) => {
        acc[k] = v
        if (!['uuid', 'settings', 'deleted'].includes(k)) {
          acc[k] += '_2'
        }
        return acc
      }, {})
    });

    afterAll(async () => {
      TestData.createdSite = updatedSite
    });

    it('should update site and return updated site data', async () => {
      const response = await request(API_BASE_URL)
        .put('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${updatedSite.uuid}`)
        .send(updatedSite)
        .expect(200);

      toEqualSentData(expect, response.body, updatedSite)
    });

    it('should return 400 when site UUID is not exists', async () => {
      await request(API_BASE_URL)
        .put('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${updatedSite.uuid}`)
        .send({
          ...updatedSite,
          uuid: updatedSite.uuid + '1000',
        })
        .expect(400);
    });

    it('should return 400 when site Name is NULL', async () => {
      await request(API_BASE_URL)
        .put('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${updatedSite.uuid}`)
        .send({
          ...updatedSite,
          name: null,
        })
        .expect(400);
    });

    it('should return 400 when site has Name used in other page', async () => {
      await request(API_BASE_URL)
        .put('/site')
        .set('Authorization', `Bearer ${TestData.authToken}`)
        .set('Origin', `${TestData.origin}`)
        .set('x-site-uuid', `${updatedSite.uuid}`)
        .send({
          ...updatedSite,
          name: TestData.createdSite2.name,
        })
        .expect(400);
    });
  }
}