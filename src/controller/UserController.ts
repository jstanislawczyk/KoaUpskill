import { JsonController, Param, Body, Get, Post, Patch, Delete, HttpCode } from 'routing-controllers';
import { getManager } from 'typeorm';
import { User } from '../entity/User';

const userRepository = getManager().getRepository(User);

@JsonController('/users')
export class UserController {

   @Get()
   async getAllUsers() {
      return await userRepository.find();
   }

   @Get('/:id')
   async getOneUser(@Param('id') id: string) {
      return await userRepository
         .findOne(id)
         .catch(() => `User with id=${id} not found`);
   }

   @Post()
   @HttpCode(201)
   async saveUser(@Body({ validate: true }) user: User) {
      return await userRepository.save(user);
   }

   @Patch('/:id')
   async updateUser(@Param('id') id: string, @Body() newUser: User) {
      const userToUpdate = <User> await userRepository
         .findOne(id)
         .catch(() => `User with id=${id} not found`);

      userToUpdate.name = newUser.name;
      userToUpdate.age = newUser.age;

      return await userRepository.save(userToUpdate);
   }

   @Delete('/:id')
   @HttpCode(204)
   async remove(@Param('id') id: string) {
      return await userRepository
         .delete(id)
         .catch(() => `User with id=${id} not found`);
   }
}
