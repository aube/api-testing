import request from "supertest"
import crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { API_BASE_URL } from '../tests/config.js';

const testId = crypto.randomBytes(2).toString('hex');

export const getUser = () => ({
  email: `test_${testId}_${faker.number.int(1000)}@domain.com`,
  password: `${faker.internet.password({ length: 10 })}A1!`,
  username: `QA_${faker.person.firstName()}_${testId}`,
});


export const getToken = async () => {
  let User = getUser()

  await request(API_BASE_URL)
    .post('/register')
    .send(User);

  const payload = {
    username: User.username,
    password: User.password,
  }

  const response = await request(API_BASE_URL)
    .post('/login')
    .send(payload);

  return response.body.token;
};
