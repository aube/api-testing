import request from 'supertest';
import { API_BASE_URL } from '../config.js';
import { getToken } from '../../helpers/user.js';
import { faker } from '@faker-js/faker';
import sitePOST from './sitePOST.js'
import siteGET from './siteGET.js'
import sitesGET from './sitesGET.js'
import sitePUT from './sitePUT.js'
import siteDELETE from './siteDELETE.js'


const TestData = {
  authToken: "",
  createdSite: null,

  authToken2: "",
  createdSite2: null,

  DEFAULT_SITE: {
    id: 0,
    name: "qa-" + faker.internet.domainWord(),
    domain: "qa-" + faker.internet.domainName(),
    meta: "meta",
    title: "title",
    category: "category",
    template: "template",
    settings: "{'settings': 123}",
  },

  FAKE_NAME: "qa-" + faker.internet.domainWord(),
}


describe('External Page Server API', () => {
  beforeAll(async () => {
    TestData.authToken = await getToken()
    TestData.authToken2 = await getToken()

    const response = await request(API_BASE_URL)
      .post('/site')
      .set('Authorization', `Bearer ${TestData.authToken2}`)
      .send({
        ...TestData.DEFAULT_SITE,
        name: "qa-" + faker.internet.domainWord(),
        domain: "qa-" + faker.internet.domainName(),
      });

    TestData.createdSite2 = response.body;
  });

  afterAll(async () => {
    // await request(API_BASE_URL)
    //   .delete('/site?force=1&id=' + TestData.createdSite.id)
    //   .set('Authorization', `Bearer ${TestData.authToken}`);
  });

  describe('POST /site', sitePOST(TestData));

  describe('PUT /site', sitePUT(TestData));

  describe('GET /site', siteGET(TestData));

  describe('GET /sites', sitesGET(TestData));

  describe('DELETE /site', siteDELETE(TestData));

});