import request from 'supertest';
import { API_BASE_URL } from '../config.js';
// import { getToken } from '../../helpers/user.js';
import { faker } from '@faker-js/faker';
import pagePOST from './pagePOST.js'
import pageGET from './pageGET.js'
import pagesGET from './pagesGET.js'
import pagePUT from './pagePUT.js'
import pageDELETE from './pageDELETE.js'
import pageAncestorsGET from './pageAncestorsGET.js'
import pageChildrenGET from './pageChildrenGET.js'


const TestData = {

  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",
  createdPage: null,

  DEFAULT_PAGE: {
    id: 0,
    parent_id: 0,
    name: "name",
    meta: "meta",
    title: "title",
    category: "category",
    template: "template",
    template_anons: "template_anons",
    h1: "h1",
    icon: "icon",
    menu: "menu",
    image_id: 6,
    content: "content",
    anons: "anons",
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

  describe('GET /page/ancestors', pageAncestorsGET(TestData));

  describe('GET /page/children', pageChildrenGET(TestData));

  describe('DELETE /page', pageDELETE(TestData));
});
