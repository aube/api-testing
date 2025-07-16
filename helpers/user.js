import crypto from 'crypto';
import { faker } from '@faker-js/faker';

const testId = crypto.randomBytes(2).toString('hex');

export const getUser = () =>({
  email: `test_${testId}_${faker.number.int(1000)}@domain.com`,
  password: `${faker.internet.password({ length: 10 })}A1!`,
  username: `QA_${faker.person.firstName()}_${testId}`
});
