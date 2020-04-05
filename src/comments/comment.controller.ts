import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
} from '@nestjs/common';

import { ActivityService } from '../activities/activity.service';
import { CommentService } from './comment.service';
import { Comment } from './comment.schema';

@Controller('comment') // http://localhost:3000/comment
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly activityService: ActivityService,
    ) {}

    @Post()
    async addComment(
        @Body('comment') comment: Comment,
        @Body('activity_id') idActivity: string,
    ) {
        const idComment = await this.commentService.insertComment(comment);
        await this.activityService.commentActivity(idComment, idActivity);
        return { id: idComment };
    }

    @Get()
    async getAllComments() {
        const comments = await this.commentService.getAllComments();
        return comments;
    }

    @Get(':id')
    async getCommentById(@Param('id') commentId: string) {
        return await this.commentService.getCommentById(commentId);
    }

    @Post()
    async updateComment(
        @Body('commentid') commentId: string,
        @Body('comment') comment: Comment
    ) {
        return await this.commentService.updateComment(commentId, comment);
    }

    @Delete(':id')
    async deleteComment(@Param('id') commentId: string) {
        await this.commentService.deleteComment(commentId);
        return null;
    }
}
