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

import { CommentService } from './comment.service';
import { Comment } from './comment.schema';

@Controller('comment') // http://localhost:3000/comment
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async addComment(@Body('comment') comment: Comment) {
        const generatedId = await this.commentService.insertComment(comment);
        return { id: generatedId };
    }

    @Get()
    async getAllComments() {
        const comments = await this.commentService.getComments();
        return comments;
    }

    @Get(':id')
    async getCommentById(@Param('id') commentId: string) {
        return await this.commentService.getCommentById(commentId);
    }

    @Post()
    async updateComment(
        @Body('commentid') commentId: string,
        @Body('comment') comment: Comment) {
        return await this.commentService.updateComment(commentId, comment);
    }

    @Delete(':id')
    async deleteComment(@Param('id') commentId: string) {
        await this.commentService.deleteComment(commentId);
        return null;
    }
}
