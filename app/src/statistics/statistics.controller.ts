import {
    UseGuards,
    Controller,
    Post,
    Get,
} from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { UserService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../users/users.decorator';

@Controller('statistics') // http://localhost:3000/statistics
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService,
        private readonly usersService: UserService
    ) {}

    @Post() // http://localhost:3000/statistics
    async addStatistics(
    ) {
        await this.statisticsService.insertStatistics();
    }

    @UseGuards(JwtAuthGuard)
    @Get() // http://localhost:3000/statistics
    async getCurrentStat(
        @UserId() userId: number,
    ) {
        await this.usersService.exists(userId);
        return await this.statisticsService.getCurrentStat();
    }
}