import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode } from 'routing-controllers';

const usersPrefix = '/users';

@Controller()
export class UserController {

    @Get(usersPrefix)
    getAll() {
       return 'This action returns all users';
    }

    @Get(`${usersPrefix}/:id`)
    getOne(@Param('id') id: number) {
       return `This action returns user id=${id}`;
    }

    @Post(usersPrefix)
    @HttpCode(201)
    post(@Body() user: any) {
       return 'Saving user...';
    }

    @Put(`${usersPrefix}/:id`)
    put(@Param('id') id: number, @Body() user: any) {
       return 'Updating a user...';
    }

    @Delete(`${usersPrefix}/:id`)
    @HttpCode(204)
    remove(@Param('id') id: number) {
       return 'Removing user...';
    }
}
