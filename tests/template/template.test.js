import { faker } from '@faker-js/faker';

import templatePOST from './templatePOST.js'
import templateGET from './templateGET.js'
import templatePUT from './templatePUT.js'


const TestData = {
  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",
  createdTemplate: null,
  updatedTemplate: null,
  // FAKE_UUID: 'aaaaaaaa-aaaa-bbbb-cccc-aaaabbbbcccc',
  FAKE_NAME: "qa_" + faker.internet.domainWord(),

  DEFAULT_TEMPLATE: {
    id: 0,
    name: "name",
    title: "title",
    description: "description",
    html: "html",
    css: "css",
    json: "json",
    js: "js",
  },

}


describe('External Upload Server API', () => {

  describe('POST /template', templatePOST(TestData));

  describe('GET /template', templateGET(TestData))

  describe('PUT /template', templatePUT(TestData));

});

