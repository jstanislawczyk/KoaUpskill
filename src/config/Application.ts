import 'reflect-metadata';
import {createKoaServer, useContainer, useKoaServer} from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection } from 'typeorm';
import { Container } from 'typedi';
import { DatabaseConfig } from './DatabaseConfig';
import * as config from 'config';
import { Logger } from './Logger';
import { LoggerLevel } from '../enum/LoggerLevel';
import { auth } from 'express-openid-connect';
import * as https from 'https';
import * as fs from 'fs';
import * as Koa from 'koa';

export class Application {
  public databaseConnection: Connection;
  public appContext: any;

  public async start(): Promise<void> {
    const databaseConfig = DatabaseConfig.getDatabaseConnectionConfiguration();

    useContainer(Container);
    useTypeOrmContainer(Container);

    await createConnection(databaseConfig)
      .then(async connection => {
        this.databaseConnection = connection;

        const key: Buffer = fs.readFileSync('./localhost-key.pem');
        const cert: Buffer = fs.readFileSync('./localhost.pem');

        const port: string = config.get('app.port');
        const appName: string = config.get('app.name');

        const auth0Configuration: any = {
          required: false,
          auth0Logout: true,
          baseURL: "https://localhost:3000",
          issuerBaseURL: "https://xenonso.eu.auth0.com",
          clientID: "fR32mjb8Z7i5nb4pVzlEPf78jDmDocyd",
          appSessionSecret: "sometextsometext",
        };

        const app: any = new Koa();

        useKoaServer(app,{
          controllers: [__dirname + '/../controller/*.ts'],
          middlewares: [__dirname + '/../middleware/*.ts'],
          routePrefix: '/api',
          defaultErrorHandler: false,
        });

        app.use(async (ctx: any, next: any) => {
            await auth(auth0Configuration)
        });

        this.appContext = https.createServer({key, cert}, app.callback()).listen(port, () => {
          Logger.log(`${appName} server runs on port ${port}`);
        });
      })
      .catch(error =>
        Logger.log(`TypeORM connection error: ${error}`, LoggerLevel.ERROR)
      );
  }

  public async close(): Promise<void> {
    const appName = config.get('app.name');

    await this.databaseConnection.close();
    await this.appContext.close();

    Logger.log(`${appName} server stopped`);
  }
}
