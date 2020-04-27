import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../users/users.module';
import { CabildoModule } from '../cabildos/cabildo.module';
import { ActivityController } from './activity.controller';
import { ActivitySchema } from './activity.schema';
import { ActivityService } from './activity.service';
import { ReactionService } from './reaction/reaction.service';
import { Reaction, ReactionSchema } from './reaction/reaction.schema';
import { CommentService } from './comment/comment.service';
import { Comment, CommentSchema } from './comment/comment.schema';
import { ReplyService } from './reply/reply.service';
import { Reply, ReplySchema } from './reply/reply.schema';
import { VoteModule } from '../vote/vote.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Activity', schema: ActivitySchema},
            {name: 'Reaction', schema: ReactionSchema},
            {name: 'Comment', schema: CommentSchema},
            {name: 'Reply', schema: ReplySchema},
        ]),
        CabildoModule,
        UserModule,
        VoteModule,
    ],
    controllers: [ActivityController],
    providers: [
        ActivityService,
        ReactionService,
        CommentService,
        ReplyService,
    ],
    exports: [
        ActivityService,
        ReactionService,
        CommentService,
        ReplyService,
        MongooseModule,
    ],
})
export class ActivityModule {}
