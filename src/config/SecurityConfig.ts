import * as config from 'config';
import {verify} from 'jsonwebtoken';
import {Action, UnauthorizedError} from 'routing-controllers';
import {User} from '../entity/User';

export class SecurityConfig {
  public static handleAuthorizationCheck(action: Action, roles: string[]): boolean {
    try {
      const token: string = action.request.header.authorization.replace('Bearer ', '');
      const applicationSecret: string = config.get('security.secret');
      const tokenBody: User = verify(token, applicationSecret) as User;

      return roles.length === 0 || roles.includes(tokenBody.role);
    } catch (error) {
      throw new UnauthorizedError('Unauthorized');
    }
  }
}
