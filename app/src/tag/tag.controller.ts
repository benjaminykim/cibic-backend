import {
    Controller,
    Body,
    Get,
    Param,
    UseGuards,
    NotFoundException,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../users/users.decorator';
import { Response } from 'express';

import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Get()
    async reqMatchTags(
        @UserId() userId: number,
        @Param('partial') partial: string,
    ) {
        // take partial string, return array of Tag objects
        // based on provided prefix
        return await this.tagService.matchTag(partial);
    }
}
