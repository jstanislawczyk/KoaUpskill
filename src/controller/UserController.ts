import { JsonController, Param, Body, Get, Post, Patch, Delete, HttpCode, NotFoundError } from 'routing-controllers';
import { User } from '../entity/User';
import { UserService } from '../service/UserService';

@JsonController('/users')
export class UserController {

   constructor(private readonly userService: UserService) {
   }

   @Get()
   async getAllUsers() {
      return await this.userService.getAllUsers();
   }

   @Get('/:id')
   async findOneUser(@Param('id') id: string) {
      return await this.userService
         .findOneUser(id)
         .catch(() => {
            throw new NotFoundError(`User with id=${id} not found`)
         });
   }

   @Post()
   @HttpCode(201)
   async saveUser(@Body({ validate: true }) user: User) {
      return await this.userService.saveUser(user);
   }

   @Patch('/:id')
   async updateUser(@Param('id') id: string, @Body() newUser: User) {
      return await this.userService.updateUser(id, newUser);
   }

   @Delete('/:id')
   @HttpCode(204)
   async deleteUser(@Param('id') id: string) {
      return await this.userService
         .deleteUser(id)
         .catch(() => {
            throw new NotFoundError(`User with id=${id} not found`)
         });
   }
}
