import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createApp } from './test-utils/create-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { app: application } = await createApp();
    app = application;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(HttpStatus.NOT_FOUND);
  });
});
