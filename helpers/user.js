import request from "supertest"
import crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { API_BASE_URL } from '../tests/config.js';


export class User {
  #data
  #token
  #created

  constructor(data) {
    if (!data) {
      const testId = crypto.randomBytes(2).toString('hex');
      data = {
        email: `test_${testId}_${faker.number.int(1000)}@domain.com`,
        password: `${faker.internet.password({ length: 10 })}A1!`,
        username: `QA_${faker.person.firstName()}_${testId}`,
      }
    }

    this.#data = data;
  }

  async create() {
    if (this.#created) return

    await this.#register()
    await this.#login()
    this.#created = true
  }

  getData() {
    return { ...this.#data };
  }

  getToken() {
    return this.#token
  }

  async #register() {
    await request(API_BASE_URL)
      .post('/register')
      .send(this.#data)
  }

  async #login() {
    const payload = {
      username: this.#data.username,
      password: this.#data.password,
    }

    const response = await request(API_BASE_URL)
      .post('/login')
      .send(payload);

    this.#token = response.body.token;
  }
}

export const generateGlobalUsers = async () => {
  globalThis.user1 = new User()
  globalThis.user2 = new User()

  await globalThis.user1.create()
  await globalThis.user2.create()
};
