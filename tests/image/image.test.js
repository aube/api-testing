import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
// import request from 'supertest';
import { fileURLToPath } from 'url';
// import { API_BASE_URL } from '../config.js';
// import { getToken } from '../../helpers/user.js';

import imagePOST from './imagePOST.js'
import imageGET from './imageGET.js'
import imagesGET from './imagesGET.js'
// import imagePUT from './imagePUT.js'
import imageDELETE from './imageDELETE.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = 'testfile.txt';
const TEST_FILE_CONTENT = 'Test file content';



const TestData = {
  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",
  uploadedImage: null,
  FAKE_UUID: 'aaaaaaaa-aaaa-bbbb-cccc-aaaabbbbcccc',
  FAKE_NAME: "qa_" + faker.internet.domainWord(),
  testFilePath: path.join(__dirname, FILENAME),
  TEST_FILE_CONTENT,
  FILENAME,
}

describe('External Upload Server API', () => {
  beforeAll(async () => {
    fs.writeFileSync(TestData.testFilePath, TEST_FILE_CONTENT);
  });

  afterAll(() => {
    if (fs.existsSync(TestData.testFilePath)) {
      fs.unlinkSync(TestData.testFilePath);
    }
  });

  describe('POST /image', imagePOST(TestData));

  describe('GET /image', imageGET(TestData))

  describe('GET /images', imagesGET(TestData));

  describe('DELETE /image', imageDELETE(TestData));

});