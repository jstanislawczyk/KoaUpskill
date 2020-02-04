import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection } from 'typeorm';
import { Container } from 'typedi';
import { DatabaseConfig } from '../config/DatabaseConfig';
import * as koaLogger from 'koa-logger';
import * as config from 'config';

export class Application {
    public databaseConnection: Connection;

    public async start(): Promise<void> {
        const databaseConfig = DatabaseConfig.getDatabaseConnectionConfiguration();

        useContainer(Container);
        useTypeOrmContainer(Container);

        await createConnection(databaseConfig)
            .then(async connection => {
                this.databaseConnection = connection;

                const port = config.get('app.port');
                const appName = config.get('app.name');
                const app = createKoaServer({
                    controllers: [__dirname + '/../controller/*.ts'],
                    routePrefix: '/api',
                });

                app.use(koaLogger());

                app.listen(port, () => {
                    console.log(`${appName} server runs on port ${port}`)
                });
            })
            .catch(error => 
                console.log(`TypeORM connection error: ${error}`)
            );
    }

    public close(): void {
        this.databaseConnection.close();
    }
}