import { Middleware, KoaMiddlewareInterface, Ctx, UseAfter } from 'routing-controllers';
import { Context } from "vm";
import { RequestLogMiddleware } from './RequestLogMiddleware';
import { Logger } from '../config/Logger';
import { Error } from '../exception/Error';

@UseAfter(RequestLogMiddleware)
@Middleware({ type: 'before' })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {

  public async use(@Ctx() context: Context, next: (err?: any) => Promise<any>): Promise<any> {

    return await next().catch(error => {
      const errorBody = new Error();
      errorBody.code = error.httpCode;
      errorBody.message = error.message;

      Logger.log(`${context.method} ${context.url} | ${context.status} ${context.message}`);

      return context.throw(error.httpCode, errorBody.toJson()); 
    });
  }
}