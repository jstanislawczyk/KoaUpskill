import * as config from 'config';
import {verify} from 'jsonwebtoken';
import {Action, UnauthorizedError} from 'routing-controllers';
import {JsonWebToken} from './helper/JsonWebToken';
import {Connection} from 'typeorm';
import {User} from '../entity/User';

export class SecurityConfig {
  public static async handleAuthorizationCheck(action: Action, roles: string[], connection: Connection): Promise<boolean> {
    try {
      const applicationSecret: string = config.get('security.secret');
      const token: string = action.request.header.authorization.replace('Bearer ', '');
      const tokenBody: JsonWebToken = verify(token, applicationSecret) as JsonWebToken;
      const isTokenNotExpired: boolean = (Date.now() / 1000) < tokenBody.exp;

      return isTokenNotExpired && await this.userHasRequiredRole(tokenBody.sub, roles, connection);
    } catch (error) {
      throw new UnauthorizedError('Unauthorized');
    }
  }

  private static async userHasRequiredRole(userId: string, roles: string[], connection: Connection): Promise<boolean> {
    const user: User = await connection.getRepository(User).findOneOrFail(userId);

    return roles.length === 0 || roles.includes(user.role);
  }
}
