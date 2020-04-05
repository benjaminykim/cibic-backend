import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentModule } from '../comments/comment.module';
import { ReplySchema } from './reply.schema';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';



@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Reply', schema: ReplySchema}]),
        CommentModule,
    ],
    controllers: [ReplyController],
    providers: [ReplyService],
    exports: [ReplyService, MongooseModule],
})
export class ReplyModule {}
