import * as config from 'config';
import {verify} from 'jsonwebtoken';
import {Action, UnauthorizedError} from 'routing-controllers';
import {JsonWebToken} from "./helper/JsonWebToken";

export class SecurityConfig {
  public static handleAuthorizationCheck(action: Action, roles: string[]): boolean {
    try {
      const token: string = action.request.header.authorization.replace('Bearer ', '');
      const applicationSecret: string = config.get('security.secret');
      const tokenBody: JsonWebToken = verify(token, applicationSecret) as JsonWebToken;
      const isTokenNotExpired: boolean = (Date.now() / 1000) < tokenBody.exp;

      //return roles.length === 0 || roles.includes(tokenBody.role);
      return isTokenNotExpired;
    } catch (error) {
      throw new UnauthorizedError('Unauthorized');
    }
  }

}
