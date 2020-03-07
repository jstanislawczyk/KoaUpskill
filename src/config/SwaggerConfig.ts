import {getMetadataArgsStorage, MetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {DefaultContext, DefaultState, Middleware, ParameterizedContext} from 'koa';

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const koaSwagger = require('koa2-swagger-ui');

export class SwaggerConfig {
    public static getSwaggerConfig(): Middleware<ParameterizedContext<DefaultState, DefaultContext>> {
        const storage: MetadataArgsStorage = getMetadataArgsStorage();
        const openApiSpec = routingControllersToSpec(storage);

        return koaSwagger({
            routePrefix: '/swagger',
            swaggerOptions: {
                spec: openApiSpec,
            },
        });
    }
}
