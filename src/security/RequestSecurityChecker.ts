import {verify} from 'jsonwebtoken';
import {Action} from 'routing-controllers';
import {JsonWebToken} from '../config/helper/JsonWebToken';
import {Connection} from 'typeorm';
import {User} from '../entity/User';
import * as config from 'config';

export class RequestSecurityChecker {

  public static async handleAuthorizationCheckForGivenUser(user: User, roles: string[]): Promise<boolean> {
    const userHasRequiredRole = roles.length === 0 || roles.includes(user.role);

    return user !== undefined && userHasRequiredRole
  }

  public static async findUserFromAction(action: Action, connection: Connection): Promise<User> {
    const applicationSecret: string = config.get('security.secret');
    const token: string = action.request.header.authorization.replace('Bearer ', '');

    try {
      const tokenBody: JsonWebToken = verify(token, applicationSecret) as JsonWebToken;
      const isTokenNotExpired: boolean = (Date.now() / 1000) < tokenBody.exp;

      if (isTokenNotExpired) {
        return await connection.getRepository(User).findOne(tokenBody.sub);
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }
}
