import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';
import { createApp } from '../../test-utils/create-app';

describe('@DELETE /products/delete-product', () => {
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
    const params = { name: 'teste' };
    await request(app.getHttpServer())
      .delete(`/products/delete-product/1627f86d-01c4-4d5d-a6b7-8fea7ba3deb9`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return ProductNotFoundException if uuid is wrong', async () => {
    const paramsLogin = { email: 'teste@sof.to', password: 'desafio1234' };
    let accessToken: string;
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(paramsLogin)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });

    const params = '6e981fad-4cb0-4153-acfc-8d1c1a6bc136';
    await request(app.getHttpServer())
      .delete(`/products/delete-product/${params}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(body.errors).toStrictEqual(new ProductNotFoundException().message);
      });
  });

  it('should return Product deleted if everything is okay', async () => {
    const paramsLogin = { email: 'teste@sof.to', password: 'desafio1234' };
    let accessToken: string;
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(paramsLogin)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });

    const params = 'dcf6db63-4a3d-4202-bb35-f20fa82ea67b';
    await request(app.getHttpServer())
      .delete(`/products/delete-product/${params}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body).toStrictEqual({ message: 'Product deleted' });
      });
    const validateProduct = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .where('products.productId =:productId', { productId: params })
      .execute();
    expect(validateProduct).toStrictEqual([]);
  });
});
