import {
    UseGuards,
    Controller,
    Post,
    Get,
    UnprocessableEntityException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

//@UseGuards(JwtAuthGuard)
@Controller('statistics') // http://localhost:3000/statistics
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ) {}

    @Post() // http;//localhost:3000/statistics
    async addStatistics(
    ) {
        await this.statisticsService.insertStatisticsTemp();
    }

    @Get() // http://localhost:3000/statistics
    async getCurrentStat(
        // @UserId() userId: number,
    ) {
        // await this.userService.exists(userId);
        return await this.statisticsService.getCurrentStat();
    }
}