import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { Container } from "typedi";
import { UserController } from './controller/UserController';

const appName = require('./../package').name;
const port = 8080;

useContainer(Container);

const app = createKoaServer({
   controllers: [UserController],
   routePrefix: '/api',
});

app.listen(port, () => {
    console.log(`${appName} server runs on port ${port}`)
});

module.exports = app;
