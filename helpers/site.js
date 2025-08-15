import request from "supertest"
import { faker } from '@faker-js/faker';
import { API_BASE_URL } from '../tests/config.js';

const DEFAULT_SITE = {
  id: 0,
  meta: "meta",
  title: "title",
  category: "category",
  template: "template",
  settings: "{'settings': 123}",
}

export class Site {
  #data
  #token
  #created

  constructor(data, token) {
    if (!data) {
      data = {
        ...Site.default(),
      }
    }

    this.#data = data;
    this.#token = token;
  }

  static default() {
    return {
      ...DEFAULT_SITE,
      name: "qa-" + faker.internet.domainWord(),
      domain: "qa-" + faker.internet.domainName(),
    }
  }

  async create() {
    if (this.#created) return

    await this.#register()
    this.#created = true
  }

  getData() {
    return { ...this.#data };
  }

  async #register() {
    const response = await request(API_BASE_URL)
      .post('/site')
      .set('Authorization', `Bearer ${this.#token}`)
      .send({
        ...this.#data,
      });


    this.#data = response.body;
  }
}

export const generateGlobalSites = async () => {
  globalThis.site1 = new Site(null, globalThis.user1.getToken())
  globalThis.site2 = new Site(null, globalThis.user2.getToken())

  await globalThis.site1.create()
  await globalThis.site2.create()
};
