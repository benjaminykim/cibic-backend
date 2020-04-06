import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ActivityService } from '../activities/activity.service';
import { CommentService } from './comment.service';
import { Comment } from './comment.schema';

@Controller('comment') // http://localhost:3000/comment
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly activityService: ActivityService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async addComment(
        @Body('comment') comment: Comment,
        @Body('activity_id') idActivity: string,
    ) {
        const idComment = await this.commentService.insertComment(comment);
        await this.activityService.commentActivity(idComment, idActivity);
        return { id: idComment };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllComments() {
        const comments = await this.commentService.getAllComments();
        return comments;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getCommentById(@Param('id') commentId: string) {
        return await this.commentService.getCommentById(commentId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async updateComment(
        @Body('commentid') commentId: string,
        @Body('comment') comment: Comment
    ) {
        return await this.commentService.updateComment(commentId, comment);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteComment(@Param('id') commentId: string) {
        await this.commentService.deleteComment(commentId);
        return null;
    }
}
