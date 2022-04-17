import { ConnectionOptions } from 'typeorm';

export const dbConnectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        'src/entity/**/*.entity.ts'
    ],
    subscribers: [
        'src/subscriber/**/*.ts',
    ],
    migrations: [
        'src/migration/**/*.ts',
    ],
    synchronize: false,
    logging: false,
    dropSchema: (process.env.NODE_ENV === 'test') ? true : false,
    migrationsRun: true,
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    }
};