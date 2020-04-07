import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../users/users.module';
import { CabildoModule } from '../cabildos/cabildo.module';
import { ActivitySchema } from './activity.schema';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ReactionService } from './reaction/reaction.service';
import { Reaction, ReactionSchema } from './reaction/reaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Activity', schema: ActivitySchema},
            {name: 'Reaction', schema: ReactionSchema},
        ]),
        CabildoModule,
        UserModule,
    ],
    controllers: [ActivityController],
    providers: [
        ActivityService,
        ReactionService
    ],
    exports: [
        ActivityService,
        ReactionService,
        MongooseModule
    ],
})
export class ActivityModule {}
