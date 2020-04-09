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
import { User } from './users.schema';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../constants';

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
    @Get()
    async getUserProfile(
        @Body('idUser') idUser: string,
    ) {
        return await this.userService.getProfile(idUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed') // http://localhost:3000/user/feed/:idUser
    async getUserFeed(
        @Body('idUser') idUser: string,
    ) {
        return await this.userService.getFeed(idUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('home') // http://localhost:3000/
    async getUserHome(
        @Headers() headers: any,
    ) {
        const idUser = idFromToken(headers.authorization);
        return await this.userService.getFollow(idUser);
    }

    @UseGuards(JwtAuthGuard)
    @Post('followcabildo') // http://localhost:3000/user/followcabildo
    async followCabildo(
        @Headers() h: any,
        @Body('idCabildo') idCabildo: string,
    ) {
        const idUser = idFromToken(h.authorization);
        if (!idUser || !idCabildo) {
            // Throw http exception here TODO
            throw new UnprocessableEntityException();
        }
        await this.userService.exists(idUser);
        await this.cabildoService.exists(idCabildo);

        const follower = await this.userService.followCabildo(idUser, idCabildo);
        const followed = await this.cabildoService.addUser(idCabildo, idUser);
        if (follower && followed) {
            return `user ${idUser} now follows cabildo ${idCabildo}`;
        }
        throw new UnprocessableEntityException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('followuser') // http://localhost:3000/user/followuser
    async followUser(
        @Headers() h: any,
        @Body('idUser') idOther: string,
    ) {
        const idUser = idFromToken(h.authorization);
        if (!idUser || !idOther) {
            throw new UnprocessableEntityException();
        }
        const success = await this.userService.followUser(idUser, idOther);
        if (success) {
            return `user ${idUser} now follows user ${idOther}: ${success}`;
        }
        throw new UnprocessableEntityException();
    }
}
