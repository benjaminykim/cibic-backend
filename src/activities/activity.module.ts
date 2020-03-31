import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { CabildoModule } from '../cabildos/cabildo.module';
import { ActivitySchema } from './activity.schema';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Activity', schema: ActivitySchema}]),
        CabildoModule,
        UsersModule,
    ],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService,MongooseModule],
})
export class ActivityModule {}
