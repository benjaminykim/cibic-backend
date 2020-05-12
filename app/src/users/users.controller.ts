import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Headers,
    UseGuards,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from './users.service';
import { User } from './users.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../utils';

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

    @UseGuards(JwtAuthGuard)
    @Get('feed/:userId') // http://localhost:3000/user/feed/:userId
    async getUserFeed(
        @Param('userId') userId: number,
    ) {
        return await this.userService.getFeed(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('home') // http://localhost:3000/
    async getUserHome(
        @Headers() headers: any,
    ) {
        const userId = idFromToken(headers.authorization);
        return await this.userService.getFollow(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getUserProfile(
        @Param('userId') userId: number,
    ) {
        return await this.userService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('followcabildo') // http://localhost:3000/user/followcabildo
    async followCabildo(
        @Headers() h: any,
        @Body('cabildoId') cabildoId: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !cabildoId) {
            // Throw http exception here TODO
            throw new UnprocessableEntityException();
        }
        await this.userService.exists(userId);
        await this.cabildoService.exists(cabildoId);
        const follower = await this.userService.followCabildo(userId, cabildoId);
        if (follower) {
            return `user ${userId} now follows cabildo ${cabildoId}`;
        }
        throw new UnprocessableEntityException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('followuser') // http://localhost:3000/user/followuser
    async followUser(
        @Headers() h: any,
        @Body('userId') idOther: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !idOther) {
            throw new UnprocessableEntityException();
        }
        const success = await this.userService.followUser(userId, idOther);
        if (success) {
            return `user ${userId} now follows user ${idOther}: ${success}`;
        }
        throw new UnprocessableEntityException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollowcabildo') // http://localhost:3000/user/followcabildo
    async unfollowCabildo(
        @Headers() h: any,
        @Body('cabildoId') cabildoId: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !cabildoId) {
            // Throw http exception here TODO
            throw new UnprocessableEntityException();
        }
        await this.userService.exists(userId);
        await this.cabildoService.exists(cabildoId);

        const follower = await this.userService.unfollowCabildo(userId, cabildoId);
        const followed = await this.cabildoService.removeUser(cabildoId, userId);
        if (follower && followed) {
            return `user no longer follows cabildo`;
        }
        throw new UnprocessableEntityException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollowuser') // http://localhost:3000/user/followuser
    async unfollowUser(
        @Headers() h: any,
        @Body('userId') idOther: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !idOther) {
            throw new UnprocessableEntityException();
        }
        const success = await this.userService.unfollowUser(userId, idOther);
        if (success) {
            return `user no longer follows user`;
        }
        throw new UnprocessableEntityException();
    }
}
