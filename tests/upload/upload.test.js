import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
// import request from 'supertest';
import { fileURLToPath } from 'url';
// import { API_BASE_URL } from '../config.js';
// import { getToken } from '../../helpers/user.js';

import uploadPOST from './uploadPOST.js'
import uploadGET from './uploadGET.js'
import uploadsGET from './uploadsGET.js'
// import uploadPUT from './uploadPUT.js'
import uploadDELETE from './uploadDELETE.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = 'testfile.txt';
const TEST_FILE_CONTENT = 'Test file content';



const TestData = {
  authToken: globalThis.user1.getToken(),
  createdSite: globalThis.site1.getData(),
  origin: "localhost",
  uploadedFile: null,
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

  describe('POST /upload', uploadPOST(TestData));

  describe('GET /upload', uploadGET(TestData))

  describe('GET /uploads', uploadsGET(TestData));

  describe('DELETE /upload', uploadDELETE(TestData));

});