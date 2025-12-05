import { faker } from '@faker-js/faker';

import cssPOST from './cssPOST.js'
import cssGET from './cssGET.js'
import cssPUT from './cssPUT.js'


const TestData = {
  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",

  // FAKE_UUID: 'aaaaaaaa-aaaa-bbbb-cccc-aaaabbbbcccc',
  FAKE_CSS: "qa_" + faker.internet.domainWord() + " { color: red; }",

  DEFAULT_CSS: "body { margin: 0; padding: 0; }",
  DEFAULT_CSS_MOD: "body { margin: 0; padding: 0; color: red; }",

}


describe('CSS API', () => {

  describe('POST /css', cssPOST(TestData));

  describe('GET /css', cssGET(TestData))

  // describe('PUT /css', cssPUT(TestData));

});