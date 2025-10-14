import { faker } from '@faker-js/faker';
import sitePOST from './sitePOST.js'
import siteGET from './siteGET.js'
import sitesGET from './sitesGET.js'
import sitePUT from './sitePUT.js'
import siteDELETE from './siteDELETE.js'


const TestData = {
  origin: "localhost",
  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),

  authToken2: globalThis.user2.getToken(),
  createdSite2: globalThis.site2.getData(),

  DEFAULT_SITE: {
    uuid: '',
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
  // beforeAll(async () => {});
  // afterAll(async () => {});

  describe('POST /site', sitePOST(TestData));

  describe('PUT /site', sitePUT(TestData));

  describe('GET /site', siteGET(TestData));

  describe('GET /sites', sitesGET(TestData));

  describe('DELETE /site', siteDELETE(TestData));

});