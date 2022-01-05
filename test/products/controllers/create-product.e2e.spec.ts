import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as faker from 'faker';
import * as request from 'supertest';

import { createApp } from '../../test-utils/create-app';

describe('@POST /products/create-product', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { app: application } = await createApp();
    app = application;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return UnauthorizedException if user does not authenticate', async () => {
    const params = { name: 'teste' };
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return BadRequestException if data do not pass the validation pipe and user is authenticated', async () => {
    const paramsLogin = { email: 'teste@sof.to', password: 'desafio1234' };
    let accessToken: string;
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(paramsLogin)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
    console.log(accessToken);

    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          name: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
        });
      });
  });

  it('should return Product created if everything is okay', async () => {
    const paramsLogin = { email: 'teste@sof.to', password: 'desafio1234' };
    let accessToken: string;
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(paramsLogin)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });

    const params = { name: `${faker.commerce.productName()}ab` };
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(params)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toStrictEqual({ message: 'Product created' });
      });
  });
});
