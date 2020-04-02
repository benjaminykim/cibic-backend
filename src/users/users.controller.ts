import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UsersService } from './users.service';
import { Users, Following } from './users.schema';

@Controller('users') // http://localhost:3000/users
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cabildoService: CabildoService,
    ) {}

    @Post() // http://localhost:3000/users
    async addUser(@Body('user') user: Users)
    {
        const generatedId = await this.usersService.insertUser(user);
        return {id: generatedId};
    }

    @Get() // http://localhost:3000/users
    async getAllUsers()
    {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Post('followcabildo') // http://localhost:3000/users/followcabildo
    async followCabildo(@Body('data') user: Following)
    {
        if (!user || !user.follower || !user.followed) {
            return 'bad cabildo following data\n'
        }
        const userExists = await this.usersService.exists(user.follower);
        const cabildoExists = await this.cabildoService.exists(user.followed);
        if (!userExists || !cabildoExists) {
            return false;
        }

        const follower = await this.usersService.followCabildo(user.follower, user.followed);
        const followed = await this.cabildoService.addUser(user.followed, user.follower);
        if (follower && followed) {
            // populate feed
            //this.usersService.pushToFeed(,);
            return `user ${user.follower} now follows cabildo ${user.followed}`;
        }
        return "that user cannot follow that cabildo"
    }

    @Post('followuser') // http://localhost:3000/users/followuser
    async followUser(@Body('data') user: Following) {
        if (!user || !user.follower || !user.followed) {
            return 'bad user following data\n'
        }
        const success = await this.usersService.followUser(user.follower, user.followed);
        if (success) {
            return `user ${user.follower} now follows user ${user.followed}: ${success}`;
        }
        return "that user cannot follow that user"
    }

    @Get('feed/:idUser') // http://localhost:3000/activity/feed/:idUser
    async getActivityFeed(@Param('idUser') idUser: string) {
        return await this.usersService.getFeed(idUser);
    }
}
