import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Header,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FcmService } from '../nestjs-fcm';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private firebase: FcmService,
    ) {}

    @Post('login')
    @ApiBody({})
    async login(@Body() user: {email: string, password: string}) {
        return await this.authService.login(user.email, user.password);
    }

    @Get('notify')
    async notify(@Headers() head: any) {
        console.log(head);
        this.firebase.sendNotification(head.device_id, payload);
    }
}
