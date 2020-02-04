import { ConnectionOptions } from 'typeorm';
import * as config from 'config';

export class DatabaseConfig {

    public static getDatabaseConnectionConfiguration(): ConnectionOptions {
        const host = config.get('db.host');
        const port = config.get('db.port');
        const name = config.get('db.name');
        const dropSchema = config.get('db.dropSchema');

        return <ConnectionOptions> {
            type: 'mongodb',
            host: host,
            port: port,
            database: name,
            dropSchema: dropSchema,
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
}