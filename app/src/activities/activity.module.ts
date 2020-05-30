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
import { Tag } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Activity,
            Reaction,
            Comment,
            Reply,
            Tag,
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
        TagService,
    ],
    exports: [
        ActivityService,
        ReactionService,
        CommentService,
        ReplyService,
        TagService,
        TypeOrmModule,
    ],
})
export class ActivityModule {}
