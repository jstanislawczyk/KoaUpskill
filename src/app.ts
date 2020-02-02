import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer } from 'typeorm';
import { Container } from 'typedi';
import * as koaLogger from 'koa-logger';

useContainer(Container);
useTypeOrmContainer(Container);

createConnection()
    .then(async connection => {
        const appName = require('./../package').name;
        const port = 3000;

        const app = createKoaServer({
            controllers: [__dirname + '/controller/*.ts'],
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