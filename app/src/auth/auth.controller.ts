import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiBody({})
    async login(@Body() user: {email: string, password: string}) {
        return await this.authService.login(user.email, user.password);
    }
}
