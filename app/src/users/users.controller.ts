import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';

import { ApiBody } from '@nestjs/swagger';
import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from './users.service';
import { User } from './users.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from './users.decorator';

@Controller('user') // http://localhost:3000/user
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cabildoService: CabildoService,
    ) {}

    @Post() // http://localhost:3000/user
    @ApiBody({type: User})
    async addUser(@Body('user') user: User) {
        const generatedId = await this.userService.insertUser(user);
        return {id: generatedId};
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed/:userId') // http://localhost:3000/user/feed/:userId
    async getUserFeed(
        @Param('userId') userId: number,
    ) {
        await this.userService.exists(userId);
        return await this.userService.getFeed(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('home') // http://localhost:3000/
    async getUserHome(
        @UserId() userId: number,
    ) {
        await this.userService.exists(userId);
        return await this.userService.getFollow(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getUserProfile(
        @Param('userId') userId: number,
    ) {
        await this.userService.exists(userId);
        return await this.userService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('followcabildo') // http://localhost:3000/user/followcabildo
    @ApiBody({})
    async followCabildo(
        @UserId() userId: number,
        @Body('cabildoId') cabildoId: number,
    ) {
        await this.userService.exists(userId);
        await this.cabildoService.exists(cabildoId);
        await this.userService.followCabildo(userId, cabildoId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('followuser') // http://localhost:3000/user/followuser
    @ApiBody({})
    async followUser(
        @UserId() userId: number,
        @Body('userId') otherId: number,
    ) {
        await this.userService.exists(userId);
        await this.userService.exists(otherId);
        await this.userService.followUser(userId, otherId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollowcabildo') // http://localhost:3000/user/unfollowcabildo
    async unfollowCabildo(
        @UserId() userId: number,
        @Body('cabildoId') cabildoId: number,
    ) {
        await this.userService.exists(userId);
        await this.cabildoService.exists(cabildoId);
        await this.userService.unfollowCabildo(userId, cabildoId);
        await this.cabildoService.removeUser(cabildoId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollowuser') // http://localhost:3000/user/unfollowuser
    async unfollowUser(
        @UserId() userId: number,
        @Body('userId') otherId: number,
    ) {
        await this.userService.exists(userId);
        await this.userService.exists(otherId);
        await this.userService.unfollowUser(userId, otherId);
    }
}
