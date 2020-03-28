import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {UserSchema} from '../users/users.schema';
import {CabildoSchema} from '../cabildos/cabildo.schema';
import {ActivitySchema} from './activity.schema';
import {ActivityController} from './activity.controller';
import {ActivityService} from './activity.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Activity', schema: ActivitySchema},
            {name: 'Users', schema: UserSchema},
            {name: 'Cabildo', schema: CabildoSchema},
        ]),
    ],
    controllers: [ActivityController],
    providers: [ActivityService],
})
export class ActivityModule {}
