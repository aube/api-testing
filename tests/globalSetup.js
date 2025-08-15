import request from 'supertest';
import { API_BASE_URL } from './config.js';
import { generateGlobalUsers } from '../helpers/user.js';
import { generateGlobalSites } from '../helpers/site.js';



// Проверка существования API
export default async () => {
  const maxAttempts = 2;
  const delay = 1000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Проверка доступности API (попытка ${attempt}/${maxAttempts})...`);
      const response = await request(API_BASE_URL)
        .get('/state')
        .timeout(3000);

      if (response.status === 200) {
        console.log('API доступно, начинаем тесты');
        await generateGlobalUsers();
        await generateGlobalSites();
        return;
      }
    } catch (error) {
      console.log(`Ошибка подключения: ${error.message}`);
    }

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error(`API недоступно по адресу ${API_BASE_URL} после ${maxAttempts} попыток`);
  process.exit(1);
};





