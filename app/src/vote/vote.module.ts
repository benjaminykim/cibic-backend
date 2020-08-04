import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityVote, CommentVote, ReplyVote } from './vote.entity';
import { ActivityVoteService, CommentVoteService, ReplyVoteService } from './vote.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ActivityVote,
            CommentVote,
            ReplyVote,
        ]),
    ],
    providers: [ActivityVoteService, CommentVoteService, ReplyVoteService],
    exports: [ActivityVoteService, CommentVoteService, ReplyVoteService, TypeOrmModule],
})
export class VoteModule {}
