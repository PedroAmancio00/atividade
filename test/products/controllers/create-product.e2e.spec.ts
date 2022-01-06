import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';

describe('@POST /products/create-product', () => {
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
      .post(`/products/create-product`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return BadRequestException if data do not pass the validation pipe and user is authenticated', async () => {
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
          price: [
            'should not be empty',
            'must be a number conforming to the specified constraints',
            'must not be less than 0',
            'must not be greater than 9999999.99',
          ],
        });
      });
  });

  it('should return Product created if everything is okay', async () => {
    const { item: createProductDto } = CreateProductDtoGenerator.generate();
    let id: string;
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(createProductDto)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toBeDefined();
        id = body.id;
      });
    const validateProduct = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .where('products.id =:id', { id })
      .execute();
    expect(validateProduct[0].name).toBe(createProductDto.name);
    expect(validateProduct[0].price).toBe(String(createProductDto.price));
  });
});
