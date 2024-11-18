import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://nestDB_owner:dcEteCW08Hnk@ep-plain-math-a516afrj.us-east-2.aws.neon.tech/nestDB?sslmode=require',
  type: 'postgres',
  port: 3306,
  entities: [],
  synchronize: true,
};
