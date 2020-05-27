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
        // place to paste the Statistics DTO
        await this.repository.save(statistics);
    }
}
