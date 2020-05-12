import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/users.module';
import { CabildoModule } from '../cabildos/cabildo.module';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
import { ReactionService } from './reaction/reaction.service';
import { Reaction } from './reaction/reaction.entity';
import { CommentService } from './comment/comment.service';
import { Comment } from './comment/comment.entity';
import { ReplyService } from './reply/reply.service';
import { Reply } from './reply/reply.entity';
import { VoteModule } from '../vote/vote.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Activity,
            Reaction,
            Comment,
            Reply,
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
        TypeOrmModule,
    ],
})
export class ActivityModule {}
