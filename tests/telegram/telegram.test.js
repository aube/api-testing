import { faker } from '@faker-js/faker';
import telegramPOST from './telegramPOST.js'
import telegramGET from './telegramGET.js'


const TestData = {
  origin: "localhost",
  TG_SERVICE_API_KEY: "ost_88882dij20dpmedLMKDW12e_123e9kk",
  // authToken: globalThis.user1.getToken(),
  tgUser: {
    telegram_id: faker.number.int({ min: 10000, max: 99999 }),
    username: 'test_telegram_user_' + faker.string.alphanumeric(8),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    language_code: 'en',
  },

}

describe('Telegram Bot API', () => {

  describe('POST /telegram', telegramPOST(TestData));
  describe('GET /telegram', telegramGET(TestData));

});
