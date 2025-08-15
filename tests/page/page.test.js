import request from 'supertest';
import { API_BASE_URL } from '../config.js';
// import { getToken } from '../../helpers/user.js';
import { faker } from '@faker-js/faker';
import pagePOST from './pagePOST.js'
import pageGET from './pageGET.js'
import pagesGET from './pagesGET.js'
import pagePUT from './pagePUT.js'
import pageDELETE from './pageDELETE.js'


const TestData = {

  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",
  createdPage: null,

  DEFAULT_PAGE: {
    id: 0,
    name: "name",
    meta: "meta",
    title: "title",
    category: "category",
    template: "template",
    h1: "h1",
    content: "content",
    content_short: "content_short",
  },

  FAKE_NAME: "qa_" + faker.internet.domainWord(),
}


describe('External Page Server API', () => {
  // beforeAll(async () => { });

  afterAll(async () => {
    await request(API_BASE_URL)
      .delete('/page?force=1&id=' + TestData.createdPage.id)
      .set('Authorization', `Bearer ${TestData.authToken}`);
  });

  describe('POST /page', pagePOST(TestData));

  describe('PUT /page', pagePUT(TestData))

  describe('GET /page', pageGET(TestData))

  describe('GET /pages',pagesGET(TestData));

  describe('DELETE /page', pageDELETE(TestData));

});