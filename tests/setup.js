import { API_BASE_URL } from './config.js';
import request from 'supertest';

// Очистка тестовых данных перед началом тестов
const cleanTestData = async () => {
  try {
    // await request(API_BASE_URL)
    //   .delete('/test-cleanup') // Эндпоинт для очистки тестовых данных
    //   .send({ email: User.testUser.email });
  } catch (error) {
    console.log('Cleanup before tests failed, maybe endpoint not implemented');
  }
};

beforeAll(async () => {
  await cleanTestData();
});