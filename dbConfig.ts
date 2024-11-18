// import { Property } from 'src/entities/property.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://nestDB_owner:dcEteCW08Hnk@ep-plain-math-a516afrj.us-east-2.aws.neon.tech/nestDB?sslmode=require',
  type: 'postgres',
  port: 3306,
  // --- can import entities end add them into entities config
  // entities: [Property],

  // --- to automatically add entities, use this way:
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
