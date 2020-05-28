import {
    Injectable
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './statistics.entity';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(Statistics) private readonly repository: Repository<Statistics>) {}

    // Insert Statistics Temporal
    async insertStatisticsTemp() {
        const stat = new Statistics();
        
        stat.activeUsers = await this.getRandomNumberBetween(20, 400);
        stat.activeCabildos = await this.getRandomNumberBetween(20, 400);
        stat.activeActivities = await this.getRandomNumberBetween(20, 400);
        
        await this.repository.save(stat);
        const statId = this.repository.getId(stat);

        await this.addTrendingUser(statId, 1);
        await this.addTrendingUser(statId, 2);
        await this.addTrendingCabildo(statId, 1);
        await this.addTrendingActivity(statId, 2);
    }
  
    // Random number generator
    async getRandomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Query to add an user id to the trending user list
    async addTrendingUser(statId: number, userId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingUsers')
            .of(statId)
            .add(userId);
    }
    
    // Query to add a cabildo id to the trending cabildo list
    async addTrendingCabildo(statId: number, cabId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingCabildos')
            .of(statId)
            .add(cabId);
    }
    
    // Query to add an activity id to the trending activity list
    async addTrendingActivity(statId: number, actId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingActivities')
            .of(statId)
            .add(actId);
    }
}
