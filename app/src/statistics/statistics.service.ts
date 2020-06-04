import {
    Injectable
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Statistics } from './statistics.entity';
import { Activity } from '../activities/activity.entity';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(Statistics) private readonly repository: Repository<Statistics>) {}
    
    async insertStatistics() {
        const stat = new Statistics();
        const acts : Activity [] = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .getMany();
        let nowDate = new Date();
        let nowDateTime = nowDate.getTime();
        let oneDayAgo = nowDateTime - 86400000;
        
        stat.activeUsers = await this.generateActiveUsers(acts, oneDayAgo);
        stat.activeCabildos = await this.generateActiveCabildos(acts, oneDayAgo);
        stat.activeActivities = await this.generateActiveActivities(acts, oneDayAgo);
        await this.repository.save(stat);
        const statId = this.repository.getId(stat);
        await this.genTrendingTemp(statId);
    }
    
    async generateActiveUsers(acts : Activity[], oneDayAgo : number) {
        let max = 0;
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].userId > max)
                max = acts[i].userId;
        }    
        let list: number[] = [0];
        for (let i = 0; i <= max; i++)
            list[i] = 0;
        let count = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo) {
                if (list[acts[i].userId] == 0) {
                    list[acts[i].userId] = 1;
                    count += 1;
                }
            }
        }
        return count;
    }
    
    async generateActiveCabildos(acts : Activity[], oneDayAgo : number) {
        let max = 0;
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].cabildo.id > max)
                max = acts[i].cabildo.id;
        }    
        let list: number[] = [0];
        for (let i = 0; i <= max; i++)
            list[i] = 0;
        let count = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo) {
                if (list[acts[i].cabildo.id] == 0) {
                    list[acts[i].cabildo.id] = 1;
                    count += 1;
                }
            }
        }
        return count;
    }
    
    async generateActiveActivities(acts : Activity[], oneDayAgo : number) {
        let count = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo)
                count += 1;
        }
        return count;
    }

    // Generate Trending Temporal
    async genTrendingTemp(statId : number) {
        let top1 = 2;
        for (let i = 0; i < 10; i++) {
            top1 += top1 == 21 ? -17 : 1;
            await this.addTrendingUser(statId, top1);
        }
        let top2 = 5;
        for (let i = 0; i < 5; i++) {
            top2 += top2 == 8 ? -5 : 1;
            await this.addTrendingCabildo(statId, top2);
        }
        let top3 = 8;
        for (let i = 0; i < 10; i++) {
            top3 += top3 == 19 ? -15 : 1;
            await this.addTrendingActivity(statId, top3);
        }
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

    async getCurrentStat(limit: number = 1, offset: number = 0) {
        return await this.repository
            .createQueryBuilder()
            .select('statistics')
            .from(Statistics, "statistics")
            .orderBy("statistics.id", "DESC")
            .skip(offset)
            .take(limit)
            .getOne()
    }
    
    // Random number generator
    async getRandomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    // stat.activeUsers = await this.getRandomNumberBetween(20, 400);
}
