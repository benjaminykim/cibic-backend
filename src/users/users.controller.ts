import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { Users } from './users.schema';

@Controller('users') // http://localhost:3000/users
export class UsersController {
    constructor(private readonly userService: UsersService,) {}

    @Post() // http://localhost:3000/users
    async addUser(@Body() user: Users)
    {
        const generatedId = await this.userService.insertUser(user);
        return {id: generatedId};
    }

    @Put() // http://localhost:3000/users
    async followCabildo(@Body() userId: string, cabildoId: string)
    {
        const result = await this.userService.followCabildo(userId, cabildoId);
        return `user ${userId} now follows cabildo ${cabildoId}: ${result}`;
    }

    @Put() // http://localhost:3000/users
    async followUser(@Body() userIdOne: string, userIdTwo: string)
    {
        const result = await this.userService.followUser(userIdOne, userIdTwo);
        return `user ${userIdOne} now follows user ${userIdTwo}: ${result}`;
    }

    @Get() // http://localhost:3000/users
    async getAllUsers()
    {
        return this.userService.getUsers();
    }
}