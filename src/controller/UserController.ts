import { JsonController, Param, Body, Get, Post, Patch, Delete, HttpCode } from 'routing-controllers';
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';

@JsonController('/users')
export class UserController {

   constructor(
      @InjectRepository()
      private readonly userRepository: UserRepository,
   ) {}

   @Get()
   async getAllUsers() {
      return await this.userRepository.find();
   }

   @Get('/:id')
   async getOneUser(@Param('id') id: string) {
      return await this.userRepository
         .findOne(id)
         .catch(() => `User with id=${id} not found`);
   }

   @Post()
   @HttpCode(201)
   async saveUser(@Body({ validate: true }) user: User) {
      return await this.userRepository.save(user);
   }

   @Patch('/:id')
   async updateUser(@Param('id') id: string, @Body() newUser: User) {
      const userToUpdate = <User> await this.userRepository
         .findOne(id)
         .catch(() => `User with id=${id} not found`);

      userToUpdate.name = newUser.name;
      userToUpdate.age = newUser.age;

      return await this.userRepository.save(userToUpdate);
   }

   @Delete('/:id')
   @HttpCode(204)
   async remove(@Param('id') id: string) {
      return await this.userRepository
         .delete(id)
         .catch(() => `User with id=${id} not found`);
   }
}
