import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CommentService } from '../comments/comment.service';
import { ReplyService } from './reply.service';
import { Reply } from './reply.schema';

@Controller('reply') // http://localhost:3000/reply
export class ReplyController {
    constructor(
        private readonly replyService: ReplyService,
        private readonly commentService: CommentService,
    ) {}

    @Post()
    async addReply(
        @Body('reply') reply: Reply,
        @Body('comment') idComment: string,
    ) {
        if (!reply || !idComment)
            throw new UnprocessableEntityException();
        const idReply = await this.replyService.insertReply(reply);
        const comment = await this.commentService.reply(idComment, idReply);
        return { id: idReply };
    }

    @Get()
    async getAllReplies() {
        const replies = await this.replyService.getReply();
        return replies;
    }

    @Get(':id')
    async getReplyById(@Param('id') replyId: string) {
        return await this.replyService.getReplyById(replyId);
    }

    @Post()
    async updateReply(
        @Body('replyid') replyId: string,
        @Body('reply') reply: Reply) {
        return await this.replyService.updateReply(replyId, reply);
    }

    @Delete(':id')
    async deleteReply(@Param('id') replyId: string) {
        await this.replyService.deleteReply(replyId);
        return null;
    }
}
