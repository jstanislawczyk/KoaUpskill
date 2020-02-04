import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection, ConnectionOptions } from 'typeorm';
import { Container } from 'typedi';
import * as koaLogger from 'koa-logger';
import { DatabaseConfig } from '../config/DatabaseConfig';

export class Application {
    public databaseConnection: Connection;
    public app: any;

    public async start(): Promise<void> {
        const databaseConfig = DatabaseConfig.databaseConnectionConfiguration;

        useContainer(Container);
        useTypeOrmContainer(Container);

        await createConnection(databaseConfig)
            .then(async connection => {
                this.databaseConnection = connection;
                const appName = require('./../../package').name;
                const port = 3000;

                this.app = createKoaServer({
                    controllers: [__dirname + '/../controller/*.ts'],
                    routePrefix: '/api',
                });

                this.app.use(koaLogger());
                this.app.address = () => 'http://localhost:3000';
                this.app.listen(port, () => {
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