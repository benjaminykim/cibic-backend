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
import { Users, Following } from './users.schema';

@Controller('users') // http://localhost:3000/users
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post() // http://localhost:3000/users
    async addUser(@Body('user') user: Users)
    {
        const generatedId = await this.userService.insertUser(user);
        return {id: generatedId};
    }

    @Get() // http://localhost:3000/users
    async getAllUsers()
    {
        return this.userService.getUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Post('followcabildo') // http://localhost:3000/users/followcabildo
    async followCabildo(@Body('data') user: Following)
    {
        if (!user || !user.follower || !user.followed) {
            return 'bad cabildo following data\n'
        }
        const success = await this.userService.followCabildo(user.follower, user.followed);
        if (success) {
            return `user ${user.follower} now follows cabildo ${user.followed}: ${success}`;
        }
        return "that user cannot follow that cabildo"
    }

    @Post('followuser') // http://localhost:3000/users/followuser
    async followUser(@Body('data') user: Following) {
        if (!user || !user.follower || !user.followed) {
            return 'bad user following data\n'
        }
        const success = await this.userService.followUser(user.follower, user.followed);
        if (success) {
            return `user ${user.follower} now follows user ${user.followed}: ${success}`;
        }
        return "that user cannot follow that user"
    }
}
