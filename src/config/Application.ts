import 'reflect-metadata';
import {
  Action,
  createKoaServer,
  useContainer
} from 'routing-controllers';
import { createConnection, useContainer as useTypeOrmContainer, Connection } from 'typeorm';
import { Container } from 'typedi';
import { DatabaseConfig } from './DatabaseConfig';
import { Logger } from './Logger';
import { LoggerLevel } from '../enum/LoggerLevel';
import {SecurityConfig} from './SecurityConfig';
import * as config from 'config';

export class Application {
  public databaseConnection: Connection;
  public appContext: any;

  public async start(): Promise<void> {
    const databaseConfig = DatabaseConfig.getDatabaseConnectionConfiguration();

    useContainer(Container);
    useTypeOrmContainer(Container);

    await createConnection(databaseConfig)
      .then(async (connection: Connection) => {
        this.databaseConnection = connection;

        const port = config.get('app.port');
        const appName = config.get('app.name');
        const app = createKoaServer({
          controllers: [__dirname + '/../controller/*.ts'],
          middlewares: [__dirname + '/../middleware/*.ts'],
          routePrefix: '/api',
          defaultErrorHandler: false,
          authorizationChecker: async (action: Action, roles: string[]) => {
            return await SecurityConfig.handleAuthorizationCheck(action, roles, connection);
          }
        });

        this.appContext = app.listen(port, () => {
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
