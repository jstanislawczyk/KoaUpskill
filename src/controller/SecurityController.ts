import {sign} from 'jsonwebtoken';
import {
  Body,
  Get,
  JsonController,
  UnauthorizedError
} from 'routing-controllers';
import {UserAuthenticationDto} from '../dto/UserAuthenticationDto';
import {User} from '../entity/User';
import {UserService} from '../service/UserService';
import * as config from 'config';

@JsonController('/security')
export class SecurityController {

  constructor(private readonly userService: UserService) {
  }

  @Get('/login')
  async signIn(@Body({validate: true}) userAuthenticationDto: UserAuthenticationDto): Promise<string> {
    return await this.userService
      .findUserByEmailAndPassword(userAuthenticationDto.email, userAuthenticationDto.password)
      .then((user: User) => {
        const applicationSecret: string = config.get('security.secret');

        return sign(Object.assign({}, user), applicationSecret);
      })
      .catch(() => {
        throw new UnauthorizedError('Login failed');
      });
  }
}
