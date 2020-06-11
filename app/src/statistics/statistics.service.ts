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

    // POST helper method to generate and add a new statistics datapoint.
    async insertStatistics() {
        // Declare a new statistics object.
        const stat = new Statistics();
        // Select all the activities in the database.
        const acts : Activity [] = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .getMany();
        // Generate the timestamp of right now minus 24 hours.
        let nowDate = new Date();
        let nowDateTime = nowDate.getTime();
        let oneDayAgo = nowDateTime - 86400000;
        // Assign the active users, cabildos and activities using the helper methods.
        stat.activeActivities = await this.generateActiveActivities(acts, oneDayAgo);
        stat.activeCabildos = await this.generateActiveCabildos(acts, oneDayAgo);
        stat.activeUsers = await this.generateActiveUsers(acts, oneDayAgo);
        // Save the statistics as a new datapoint in the database.
        await this.repository.save(stat);
        // Retrieve the id of the statistics datapoint we just saved.
        const statId = this.repository.getId(stat);
        // Save the trending users, cabildos and activities using the helper method.
        await this.genTrendingAll(statId, acts, nowDateTime);
    }
    
    // Generate Active Activities Statistic.
    async generateActiveActivities(acts : Activity[], oneDayAgo : number) {
        // Iterate through all the activities, if the publish date is yesterday we increment the count.
        let countActiveActivities = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo)
                countActiveActivities += 1;
        }
        return countActiveActivities;
    }

    // Generate Active Cabildos Statistic.
    async generateActiveCabildos(acts : Activity[], oneDayAgo : number) {
        // Find the maximum cabildo id.
        let maxCabId = 0;
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].cabildo.id > maxCabId)
                maxCabId = acts[i].cabildo.id;
        }    
        // Create a hashtable where key is the cabildo id and value is 0 (cabildo not counted yet) or 1 (cabildo already counted). Initialize with 0.  
        let listActiveCabildos: number[] = [0];
        for (let i = 0; i <= maxCabId; i++)
            listActiveCabildos[i] = 0;
        // Iterate through all the activities, if the publish date is yesterday and his cabildo is not counted yet, we increment the count
        // ... and mark the cabildo as counted.
        let countActiveCabildos = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo) {
                if (listActiveCabildos[acts[i].cabildo.id] == 0) {
                    listActiveCabildos[acts[i].cabildo.id] = 1;
                    countActiveCabildos += 1;
                }
            }
        }
        return countActiveCabildos;
    }
    
    // Generate Active Users Statistic.
    async generateActiveUsers(acts : Activity[], oneDayAgo : number) {
        // Find the maximum user id.
        let maxUserId = 0;
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].userId > maxUserId)
                maxUserId = acts[i].userId;
        }    
        // Create a hashtable where key is the user id and value is 0 (user not counted yet) or 1 (user already counted). Initialize with 0.  
        let listActiveUsers: number[] = [0];
        for (let i = 0; i <= maxUserId; i++)
            listActiveUsers[i] = 0;
        // Iterate through all the activities, if the publish date is yesterday and his user is not counted yet, we increment the count
        // ... and mark the user as counted.
        let countActiveUsers = 0;
        for (let i = 0; i < acts.length; i++) {
            let time = acts[i].publishDate.getTime();
            if (time > oneDayAgo) {
                if (listActiveUsers[acts[i].userId] == 0) {
                    listActiveUsers[acts[i].userId] = 1;
                    countActiveUsers += 1;
                }
            }
        }
        return countActiveUsers;
    }
    
    // Generate Trending Activities, Trending Cabildos and Trending Users.
    async genTrendingAll(statId : number, acts : Activity[], nowDateTime : number) {
        // Finding the maximum activity id, maximum cabildo id, and maximum user id, from the list of activities.
        let maxActId = 0;
        let maxCabId = 0;
        let maxUserId = 0;
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].id > maxActId)
                maxActId = acts[i].id;
            if (acts[i].cabildo.id > maxCabId)
                maxCabId = acts[i].cabildo.id;
            if (acts[i].userId > maxUserId)
                maxUserId = acts[i].userId;
        }
        // Create activity trending score hashtable: key is the activity id, value is -1. 
        // Create cabildo trending score hashtable: key is the cabildo id, value is -1.  Also another hashtable to track the number of activities per cabildo.
        // Create user trending score hashtable: key is the user id, value is -1.  Also another hashtable to track the number of activities per user.
        let listActTs : number[] = [0];
        let listCabTs : number[] = [0];
        let listUserTs : number[] = [0];
        let listActsPerCab : number[] = [0];
        let listActsPerUser : number[] = [0];
        for (let i = 0; i <= maxActId; i++)
            listActTs[i] = -1;
        for (let i = 0; i <= maxCabId; i++) {
            listCabTs[i] = -1;
            listActsPerCab[i] = -1;
        }
        for (let i = 0; i <= maxUserId; i++) {
            listUserTs[i] = -1;
            listActsPerUser[i] = -1;
        }
        // Update activity trending score hashtable: value is the trending score of that activity.
        // Update cabildo trending score hashtable: value is the sum of all his activities trending scores. Also count the number of activities per cabildo.
        // Update user trending score hashtable: value is the sum of all his activities trending scores. Also count the number of activities per user.
        for (let i = 0; i < acts.length; i++) {
            let trendingScore = await this.actTrendingScore(acts[i].ping, acts[i].publishDate, nowDateTime);
            // Activity
            listActTs[acts[i].id] = trendingScore;
            // Cabildo
            if (listCabTs[acts[i].cabildo.id] == -1) {
                listCabTs[acts[i].cabildo.id] = 0; 
                listActsPerCab[acts[i].cabildo.id] = 0;
            } 
            listCabTs[acts[i].cabildo.id] += trendingScore;
            listActsPerCab[acts[i].cabildo.id] += 1;
            // User
            if (listUserTs[acts[i].userId] == -1) {
                listUserTs[acts[i].userId] = 0; 
                listActsPerUser[acts[i].userId] = 0;
            } 
            listUserTs[acts[i].userId] += trendingScore;
            listActsPerUser[acts[i].userId] += 1;
        }
        // Update cabildo trending score hashtable: value the is the current value (sum of all his activities trending scores) divided by his number of activities.
        // Update user trending score hashtable: value the is the current value (sum of all his activities trending scores) divided by his number of activities.
        for (let i = 0; i <= maxCabId; i++) {
            if (listCabTs[i] != -1)
                listCabTs[i] /= listActsPerCab[i];
        }
        for (let i = 0; i <= maxUserId; i++) {
            if (listUserTs[i] != -1)
                listUserTs[i] /= listActsPerUser[i];
        }
        // Select the top 10 values (activities trending scores) and add the keys (activities id) to the trending activities relation.
        // Select the top 5 values (cabildo trending scores) and add the keys (cabildos id) to the trending cabildos relation.
        // Select the top 5 values (user trending scores) and add the keys (users id) to the trending users relation.
        for (let j = 0; j < 10; j++) {
            let maxActTs = 0;
            let maxActTsKey = 0;
            for (let i = 0; i <= maxActId; i++) {
                if (listActTs[i] > maxActTs) {
                    maxActTs = listActTs[i];
                    maxActTsKey = i;
                }
            }
            await this.addTrendingActivity(statId, maxActTsKey);
            listActTs[maxActTsKey] = -2;
        } 
        for (let j = 0; j < 5; j++) {
            let maxCabTs = 0;
            let maxCabTsKey = 0;
            for (let i = 0; i <= maxCabId; i++) {
                if (listCabTs[i] > maxCabTs) {
                    maxCabTs = listCabTs[i];
                    maxCabTsKey = i;
                }
            }
            await this.addTrendingCabildo(statId, maxCabTsKey);
            listCabTs[maxCabTsKey] = -2;
        }
        for (let j = 0; j < 5; j++) {
            let maxUserTs = 0;
            let maxUserTsKey = 0;
            for (let i = 0; i <= maxUserId; i++) {
                if (listUserTs[i] > maxUserTs) {
                    maxUserTs = listUserTs[i];
                    maxUserTsKey = i;
                }
            }
            await this.addTrendingUser(statId, maxUserTsKey);
            listUserTs[maxUserTsKey] = -2;
        }
	}

    // Function to calculate the activity trending score.
    async actTrendingScore(ping : number, publishDate : Date, nowDateTime : number) {
        let hoursPassed = (nowDateTime - publishDate.getTime()) / 3600000;
        return (ping / (hoursPassed + 1));
    }

    // Query to add an activity id to the trending activity relation.
    async addTrendingActivity(statId: number, actId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingActivities')
            .of(statId)
            .add(actId);
    }
    
    // Query to add a cabildo id to the trending cabildo relation.
    async addTrendingCabildo(statId: number, cabId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingCabildos')
            .of(statId)
            .add(cabId);
    }
    
    // Query to add an user id to the trending user relation.
    async addTrendingUser(statId: number, userId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Statistics, 'trendingUsers')
            .of(statId)
            .add(userId);
    }

    // GET helper method to get the last statistics datapoint.
    async getCurrentStat(limit: number = 1, offset: number = 0) {
        let stat = await this.repository
            .createQueryBuilder()
            .select('statistics')
            .from(Statistics, "statistics")
            .orderBy("statistics.id", "DESC")
            .leftJoinAndSelect("statistics.trendingUsers", "user")
            .leftJoinAndSelect("statistics.trendingCabildos", "cabildo")
            .leftJoinAndSelect("statistics.trendingActivities", "activity")
            .leftJoinAndSelect("activity.user", "actuser")
            .leftJoinAndSelect("activity.cabildo", "actcabildo")
            .skip(offset)
            .take(limit)
            .getOne()
        return stat;
    }
}