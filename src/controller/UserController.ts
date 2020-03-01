import {
   JsonController,
   Param,
   Body,
   Get,
   Post,
   Patch,
   Delete,
   HttpCode,
   NotFoundError,
   Authorized,
   CurrentUser
} from 'routing-controllers';
import { User } from '../entity/User';
import { UserDto } from '../dto/UserDto';
import { UserService } from '../service/UserService';
import { UserDtoConverter } from '../dto-converter/UserDtoConverter';
import { DeleteResult } from 'typeorm';

@JsonController('/users')
export class UserController {

   constructor(private readonly userService: UserService) {
   }

   @Get()
   @Authorized()
   async getAllUsers(): Promise<UserDto[]> {
      return await this.userService
         .getAllUsers()
         .then((users: User[]) => 
            UserDtoConverter.toListOfDtos(users)
         );
   }

   @Get('/:id')
   @Authorized()
   async findOneUser(@Param('id') id: string): Promise<UserDto> {
      return await this.userService
         .findOneUser(id)
         .then((user: User) => 
            UserDtoConverter.toDto(user)
         )
         .catch(() => {
            throw new NotFoundError(`User with id=${id} not found`);
         });
   }

   @Post()
   @HttpCode(201)
   async saveUser(@Body({ validate: true }) userDto: UserDto): Promise<UserDto> {
      const user: User = UserDtoConverter.toEntity(userDto);

      return await this.userService
        .saveUser(user)
        .then((user: User) =>
            UserDtoConverter.toDto(user)
        );
   }

   @Patch('/:id')
   @Authorized()
   async updateUser(
       @CurrentUser({ required: true}) currentRequestUser: User,
       @Param('id') newUserId: string,
       @Body({ validate: true }) userDto: UserDto
   ): Promise<UserDto> {
      const newUser: User = UserDtoConverter.toEntity(userDto);
      const currentRequestUserId: string = currentRequestUser.id.toHexString();

      return await this.userService
         .updateUser(currentRequestUserId, newUserId, newUser)
         .then((user: User) => 
            UserDtoConverter.toDto(user)
         );
   }

   @Delete('/:id')
   @Authorized()
   @HttpCode(204)
   async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
      return await this.userService
         .deleteUser(id)
         .catch(() => {
            throw new NotFoundError(`User with id=${id} not found`)
         });
   }
}
