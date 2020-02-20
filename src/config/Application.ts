import 'reflect-metadata';
import {createKoaServer, useContainer, useKoaServer} from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection } from 'typeorm';
import { Container } from 'typedi';
import { DatabaseConfig } from './DatabaseConfig';
import * as config from 'config';
import { Logger } from './Logger';
import { LoggerLevel } from '../enum/LoggerLevel';
import { auth } from 'express-openid-connect';
const Koa = require('koa');
const router = require('koa-router')();
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

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

        let app = new Koa();

        const key = fs.readFileSync('./localhost-key.pem');
        const cert = fs.readFileSync('./localhost.pem');

        const port = config.get('app.port');
        const appName = config.get('app.name');

        const configuration = {
          required: false,
          auth0Logout: true,
          baseURL: "https://localhost:3000",
          issuerBaseURL: "https://xenonso.eu.auth0.com",
          clientID: "fR32mjb8Z7i5nb4pVzlEPf78jDmDocyd",
          appSessionSecret: "sometextsometext",
        };

        useKoaServer(app,{
          controllers: [__dirname + '/../controller/*.ts'],
          middlewares: [__dirname + '/../middleware/*.ts'],
          routePrefix: '/api',
          defaultErrorHandler: false,
        });

        app.use(async (ctx: any, next: any) => {await auth(configuration)});

        const server = app.callback();
        /*this.appContext = app.listen(port, () => {
            Logger.log(`${appName} server runs on port ${port}`);
        });*/

          this.appContext = https.createServer(server).listen(port, () => {
              Logger.log(`${appName} server runs on port ${port}`);
              console.log(app)
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
