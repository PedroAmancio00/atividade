import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';
import { v4 as uuid } from 'uuid';

describe('@DELETE /products/delete-product', () => {
  let app: INestApplication;
  let connection: Connection;
  let accessToken: string;
  let product: any;
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    const { item: createProductDto } = CreateProductDtoGenerator.generate();
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
    const params = { email: createUserDto.email, password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(createProductDto)
      .auth(accessToken, { type: 'bearer' })
      .then((body) => {
        product = JSON.parse(body.text);
      });
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return UnauthorizedException if user does not authenticate', async () => {
    await request(app.getHttpServer())
      .delete(`/products/delete-product/${product.id}`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return ProductNotFoundException if uuid is wrong', async () => {
    const id = uuid();
    await request(app.getHttpServer())
      .delete(`/products/delete-product/${id}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(body.errors).toStrictEqual(new ProductNotFoundException().message);
      });
  });

  it('should return Product deleted if everything is okay', async () => {
    await request(app.getHttpServer())
      .delete(`/products/delete-product/${product.id}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body).toStrictEqual({});
      });
    const validateProduct = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .where('products.id =:id', { id: product.id })
      .execute();
    expect(validateProduct).toStrictEqual([]);
  });
});
