import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection } from 'typeorm';
import { Container } from 'typedi';
import * as koaLogger from 'koa-logger';

export class Application {
    public databaseConnection: Connection;
    public start(): void {
        useContainer(Container);
        useTypeOrmContainer(Container);

        createConnection()
            .then(async connection => {
                this.databaseConnection = connection;
                const appName = require('./../../package').name;
                const port = 3000;

                const app = createKoaServer({
                    controllers: [__dirname + '/../controller/*.ts'],
                    routePrefix: '/api',
                });

                app.use(koaLogger());

                app.listen(port, () => {
                    console.log(`${appName} server runs on port ${port}`)
                });

                this.close();
            })
            .catch(error => 
                console.log(`TypeORM connection error: ${error}`)
            );
    }

    public close(): void {
        this.databaseConnection.close();
    }
}