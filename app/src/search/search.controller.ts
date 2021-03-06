//TODO: make tsvector column in activities and create it at activity
//      at post time, so that we dont have to convert text to tsvector
//      during query

//TODO: heuristics (ben?)

import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    UseGuards,
    NotFoundException,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';

import { Search } from './search.entity';
import { UserId } from '../users/users.decorator';
import { Response } from 'express';
import { Tag } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';

export enum SearchTypes {
    Activities = 1,
    Cabildos = 2,
    Users = 4,
    Tag = 8,
}

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        private readonly tagService: TagService,
    ) {}

    @Get(':offset')
    async reqSearchHistory(
        @UserId() userId: number,
        @Param('offset') offset: number,
    ) {
        const ret = await this.searchService.searchHistory(userId, offset);
        if (ret.length == 0)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        return (ret);
    }

    @Post('users/:offset')
    async reqSearchUsers(
        @UserId() userId: number,
        @Body('search') search: Search,
        @Param('offset') offset: number,
    ) {
        if (!search.query || search.query == "") {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }
        search.userId = userId;
        search.qtype = SearchTypes.Users;
        await this.searchService.saveQuery(search);
        const ret = await this.searchService.searchUsers(search, offset);
        if (ret.length == 0)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        return ret;
    }

    @Post('activities/:offset')
    async reqSearchActivities(
        @UserId() userId: number,
        @Body('search') search: Search,
        @Param('offset') offset: number,
    ) {
        if (!search.query || search.query == "") {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }
        search.userId = userId;
        search.qtype = SearchTypes.Activities;
        await this.searchService.saveQuery(search);
        const ret = await this.searchService.searchActivities(search, offset);
        if (ret.length == 0)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        console.log(ret);
        return ret;
    }

    @Post('cabildos/:offset')
    async reqSearchCabildos(
        @UserId() userId: number,
        @Body('search') search: Search,
        @Param('offset') offset: number,
    ) {
        if (!search.query || search.query == "") {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }
        search.userId = userId;
        search.qtype = SearchTypes.Cabildos;
        await this.searchService.saveQuery(search);
        const ret = await this.searchService.searchCabildos(search, offset);
        if (ret.length == 0)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        return ret;
    }

    @Post('tag/:offset')
    async reqSearchByTag(
        @UserId() userId: number,
        @Body('search') search: Search,
        @Param('offset') offset: number,
    ) {

        // save query to history
        search.userId = userId;
        search.qtype = SearchTypes.Tag;
        await this.searchService.saveQuery(search);

        // create tag if not exist?

        // match query string to Tag and search
        const target = await this.tagService.matchTag(search.query);
        if (!target)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);

        const ret = await this.searchService.searchByTag(target, userId, offset);
        if (ret.length == 0)
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        return ret;
    }
}
