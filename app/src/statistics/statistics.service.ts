import {
    Injectable
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './statistics.entity';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(Statistics) private readonly repository: Repository<Statistics>) {}

    async insertStatisticsDemo() {
        const statA = {
            statistic: {
                activeUsers: 222,
                activeCabildos: 333,
                activeActivities: 444,
                trendingUsers: [11, 12, 13, 14, 15]
                trendingCabildos: [21, 22, 23, 24, 25]
                trendingActivities: [31, 32, 33, 34, 35]
            },
        };
        
        await this.repository.save(statistics);
    }
}
