import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';

describe('@GET /products/read-product', () => {
  let app: INestApplication;
  let connection: Connection;
  let accessToken: string;
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
    const params = { email: createUserDto.email, password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
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
    const params = { page: 2, limit: 5 };
    let products = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .limit(params.limit)
      .offset((params.page - 1) * params.limit)
      .execute();
    products = products.map((product: ProductEntity) => {
      return { id: product.id, name: product.name };
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
