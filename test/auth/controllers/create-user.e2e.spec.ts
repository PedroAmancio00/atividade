import { HttpStatus, INestApplication } from '@nestjs/common';
import * as faker from 'faker';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { InvalidCredentialsException } from '../../../src/auth/exceptions/invalid-credentials-exception';
import { createApp } from '../../test-utils/create-app';

describe('@POST /auth/sign-in', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connection = conn;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return BadRequestException if data do not pass the validation pipe', async () => {
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          email: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
          password: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
        });
      });
  });

  it('should return InvalidCredentialsException if the password is wrong', async () => {
    const params = { email: 'teste@sof.to', password: 'teste' };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new InvalidCredentialsException().message);
      });
  });

  it('should return InvalidCredentialsException if the user does not exist', async () => {
    const params = { email: faker.internet.email().toLowerCase(), password: 'teste' };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new InvalidCredentialsException().message);
      });
  });

  it('should return an access token if everything is okay', async () => {
    const params = { email: 'teste@sof.to', password: 'desafio1234' };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CREATED);
        expect(body.accessToken).toBeDefined();
      });
  });
});
