import {Body, JsonController, Post} from 'routing-controllers';
import {UserAuthenticationDto} from '../dto/UserAuthenticationDto';
import {UserService} from '../service/UserService';

@JsonController('/api/security')
export class SecurityController {

  constructor(private readonly userService: UserService) {
  }

  @Post('/login')
  async signIn(@Body({validate: true}) userAuthenticationDto: UserAuthenticationDto): Promise<string> {
    return await this.userService.authenticateUser(userAuthenticationDto.email, userAuthenticationDto.password);
  }
}
