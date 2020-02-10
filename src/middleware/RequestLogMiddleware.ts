import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Logger } from '../config/Logger';
import { LoggerLevel } from '../enum/LoggerLevel';

@Middleware({ type: 'after' })
export class RequestLogMiddleware implements KoaMiddlewareInterface {

    async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            await next();
            Logger.log(`${context.method} ${context.url} | ${context.status} ${context.message}`);
        } catch (error) {
            Logger.log(`Error: ${error}`, LoggerLevel.WARN);
        }
    }
}
