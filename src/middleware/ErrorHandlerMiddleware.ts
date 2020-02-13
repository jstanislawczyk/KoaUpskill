import { Middleware, KoaMiddlewareInterface, Ctx } from 'routing-controllers';
import { Context } from 'vm';
import { ErrorDataGenerator } from '../util/data-generator/ErrorDataGenerator';
import { Logger } from '../config/Logger';
import * as config from 'config';

@Middleware({ type: 'before' })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {

  public async use(@Ctx() context: Context, next: (err?: any) => Promise<any>): Promise<any> {

    return await next().catch(error => {
      const isLoggerActive = config.get('logger.loggerActive');
      const errorBody = ErrorDataGenerator.createError(error.httpCode || 500, error.message);

      if (isLoggerActive) {
        Logger.log(`${context.method} ${context.url} | ${context.status} ${context.message}`);
      }

      return context.throw(errorBody.code, errorBody.toJson()); 
    });
  }
}