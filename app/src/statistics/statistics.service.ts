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
        stat.activeUsers = await this.generateActiveUsers();
        stat.activeCabildos = 0;
        stat.activeActivities = await this.generateActiveActivities();
        await this.repository.save(stat);
    }
    
    async generateActiveUsers() {
        const dates : Activity [] = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .getMany();
        let nowDate = new Date();
        let nowDateTime = nowDate.getTime();
        let oneDayAgo = nowDateTime - 86400000;
        let max = 0;
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].userId > max)
                max = dates[i].userId;
        }    
        let list: number[] = [0];
        for (let i = 0; i <= max; i++)
            list[i] = 0;
        let count = 0;
        for (let i = 0; i < dates.length; i++) {
            let time = dates[i].publishDate.getTime();
            if (time > oneDayAgo) {
                if (list[dates[i].userId] == 0) {
                    list[dates[i].userId] = 1;
                    count += 1;
                }
            }
        }
        return count;
    }
    
    async generateActiveActivities() {
        const dates : Activity [] = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .getMany();
        let nowDate = new Date();
        let nowDateTime = nowDate.getTime();
        let oneDayAgo = nowDateTime - 86400000;
        let count = 0;
        for (let i = 0; i < dates.length; i++) {
            let time = dates[i].publishDate.getTime();
            if (time > oneDayAgo)
                count += 1;
        }
        return count;
    }

    // Insert Statistics Temporal
    async insertStatisticsTemp() {
        const stat = new Statistics();
        stat.activeUsers = 0;
        stat.activeCabildos = 0;
        stat.activeActivities = 0;
        await this.repository.save(stat);
        const statId = this.repository.getId(stat);
        stat.activeUsers = (statId * statId) * 111;
        stat.activeCabildos = ((statId + 1) * statId) * 111;
        stat.activeActivities = ((statId + 2) * statId) * 111;
        await this.repository.save(stat);
        await this.genTrendingTemp(statId);
    }
    
    // Generate Trending Temporal
    async genTrendingTemp(statId : number) {
        let top = statId - 1;
        for (let i = 0; i < 10; i++) {
            top += top == 20 ? -17 : 1;
            await this.addTrendingUser(statId, top);
        }
        for (let i = 0; i < 10; i++) {
            top += top == 20 ? -17 : 1;
            await this.addTrendingCabildo(statId, top);
        }
        for (let i = 0; i < 10; i++) {
            top += top == 20 ? -17 : 1;
            await this.addTrendingActivity(statId, top);
        }
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
    
    // stat.activeUsers = await this.getRandomNumberBetween(20, 400);
    // stat.activeCabildos = await this.getRandomNumberBetween(20, 400);
    // stat.activeActivities = await this.getRandomNumberBetween(20, 400);
    
    // async generateActiveActivities() {
    //     let mydate = new Date();
    //     //let mydate : Date = new Date("2020-06-02");
    //     let [allAct, actCount] = await getRepository(Activity).findAndCount({ where: { publishDate : mydate } });
    //     console.log("Activities count: ", actCount);
    //     return actCount;
        
    //     // return await getRepository(Activity)
    //     // .createQueryBuilder(/*"activity"*/)
    //     // .from(Activity, "activity")
    //     // .select("COUNT(activity.id)", "result")
    //     // .where("activity.id = :id", { id: 5 })
    //     // .getRawOne();
    // }

    // async generateActiveActivities() {
    //     const dates : Activity [] = await getRepository(Activity)
    //     .createQueryBuilder()
    //     .select("activity")
    //     .from(Activity, "activity")
    //     //.where("activity.id = :id", { id: 5 })
    //     .getMany();
    //     //console.log(dates);
    //     //console.log(dates.length);
    //     //console.log(dates[0]);
    //     //console.log(dates[0].publishDate);
    //     //console.log(dates[0].publishDate.getTime());

    //     let nowDate = new Date();
    //     let nowDateTime = nowDate.getTime();
    //     let oneDayAgo = nowDateTime - 86400000;
    //     //console.log(nowDateTime);
    //     //console.log(oneDayAgo);
    //     let count = 0;
    //     for (let i = 0; i < dates.length; i++) {
    //         let time = dates[i].publishDate.getTime();
    //         if (time > oneDayAgo)
    //             count += 1;
    //     }
    //     console.log(count);
    //     return count;
    // }
}
