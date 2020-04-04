import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from './users.service';
import { User, Following } from './users.schema';

@Controller('user') // http://localhost:3000/user
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cabildoService: CabildoService,
    ) {}

    @Post() // http://localhost:3000/user
    async addUser(@Body('user') user: User)
    {
        const generatedId = await this.userService.insertUser(user);
        return {id: generatedId};
    }

    @Get() // http://localhost:3000/user
    async getAllUsers()
    {
        return this.userService.getUsers();
    }

    @Get(':id')
    async getUserProfile(@Param('id') id: string) {
        return this.userService.getProfile(id);
    }

    @Get('feed/:id') // http://localhost:3000/user/feed/:idUser
    async getUserFeed(@Param('id') id: string) {
        return await this.userService.getFeed(id);
    }

    @Get('home/:id') // http://localhost:3000/
    async getUserHome(@Param('id') id: string) {
        return await this.userService.getFollow(id);
    }

    @Post('followcabildo') // http://localhost:3000/user/followcabildo
    async followCabildo(@Body('data') user: Following)
    {
        if (!user || !user.follower || !user.followed) {
            return 'bad cabildo following data\n'
        }
        await this.userService.exists(user.follower);
        await this.cabildoService.exists(user.followed);

        const follower = await this.userService.followCabildo(user.follower, user.followed);
        const followed = await this.cabildoService.addUser(user.followed, user.follower);
        if (follower && followed) {
            // populate feed
            //this.userService.pushToFeed(,);
            return `user ${user.follower} now follows cabildo ${user.followed}`;
        }
        return "that user cannot follow that cabildo"
    }

    @Post('followuser') // http://localhost:3000/user/followuser
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
