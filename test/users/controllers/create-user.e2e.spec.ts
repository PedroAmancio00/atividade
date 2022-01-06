import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { UserEntity } from '../../../src/users/entities/user.entity';
import { EmailAlreadyExistsException } from '../../../src/users/exceptions/email-already-exists';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../generator/create-user-dto.generator';

describe('@POST /users/create-user', () => {
  let app: INestApplication;
  let connection: Connection;
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return BadRequestException if data do not pass the validation pipe', async () => {
    await request(app.getHttpServer())
      .post(`/users/create-user`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          name: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
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

  it('should return EmailConflictException if email already exists', async () => {
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
    await request(app.getHttpServer())
      .post(`/users/create-user`)
      .send(createUserDto)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CONFLICT);
        expect(body.errors).toStrictEqual(new EmailAlreadyExistsException().message);
      });
  });

  it('should create user if everything is okay', async () => {
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    await request(app.getHttpServer())
      .post(`/users/create-user`)
      .send(createUserDto)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toBeDefined();
      });
    const validateUser = await connection
      .createQueryBuilder()
      .select('*')
      .from(UserEntity, 'users')
      .where('users.email =:email', { email: createUserDto.email })
      .execute();
    expect(validateUser[0].email).toBe(createUserDto.email);
    expect(validateUser[0].name).toBe(createUserDto.name);
  });
});
