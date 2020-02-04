import { ConnectionOptions } from 'typeorm';

export class DatabaseConfig {

    public static databaseConnectionConfiguration: ConnectionOptions = {
        type: 'mongodb',
        host: 'localhost',
        database: 'koajs',
        port: 27017,
        dropSchema: true,
        synchronize: true,
        logging: true,
        entities: [
            'src/entity/**/*.ts',
        ],
        migrations: [
           'src/migration/**/*.ts',
        ],
        subscribers: [
           'src/subscriber/**/*.ts',
        ],
        cli: {
           entitiesDir: 'src/entity',
           migrationsDir: 'src/migration',
           subscribersDir: 'src/subscriber',
        },
        useUnifiedTopology: true,
    }
}