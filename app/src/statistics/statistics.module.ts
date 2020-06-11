import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Statistics } from './statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { UserModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Statistics]),
        UserModule,
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService,TypeOrmModule],
})
export class StatisticsModule {}
