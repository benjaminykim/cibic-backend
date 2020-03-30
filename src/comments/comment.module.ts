import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentSchema } from './comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Comment', schema: CommentSchema}]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
	exports: [CommentService,MongooseModule],
})
export class CommentModule {}
