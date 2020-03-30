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

import { ReplyService } from './reply.service';
import { Reply } from './reply.schema';

@Controller('reply') // http://localhost:3000/reply
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @Post()
    async addReply(@Body('reply') reply: Reply) {
        const generatedId = await this.replyService.insertReply(reply);
        return { id: generatedId };
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
