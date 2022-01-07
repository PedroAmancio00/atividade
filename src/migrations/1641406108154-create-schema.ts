import { MigrationInterface, QueryRunner } from 'typeorm';
import { FileHelper } from './helpers/handle-file.helper';

import { CREATE_SCHEMA, DELETE_SCHEMA } from './constants';

export class CreateSchema1641406108154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const createRolePostgreSql = `
        DROP ROLE IF EXISTS admin_atividade;
        CREATE ROLE admin_atividade WITH;
      `;
    await queryRunner.query(createRolePostgreSql);

    const createSchemaSql = FileHelper.read(CREATE_SCHEMA);
    await queryRunner.query(createSchemaSql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const deleteSchemaSql = FileHelper.read(DELETE_SCHEMA);
    await queryRunner.query(deleteSchemaSql);
  }
}
