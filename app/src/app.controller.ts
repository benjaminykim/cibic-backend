import {Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import {AuthGuard} from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller() // Route root your-domain.com/
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


}
