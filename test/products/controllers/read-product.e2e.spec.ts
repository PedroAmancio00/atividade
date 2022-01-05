import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { createApp } from '../../test-utils/create-app';

describe('@GET /products/read-product', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return UnauthorizedException if user does not authenticate', async () => {
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .send()
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

    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          page: ['must be a number conforming to the specified constraints', 'must be a positive number'],
          limit: ['must be a number conforming to the specified constraints', 'must be a positive number'],
        });
      });
  });

  it('should return the products if everything is okay', async () => {
    const paramsLogin = { email: 'teste@sof.to', password: 'desafio1234' };
    let accessToken: string;
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(paramsLogin)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
    const params = { page: 2, limit: 5 };
    let products = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .limit(params.limit)
      .offset((params.page - 1) * params.limit)
      .execute();
    products = products.map((product: ProductEntity) => {
      return { productId: product.productId, name: product.name };
    });
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .query(params)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body.rows).toStrictEqual(products);
      });
  });
});
