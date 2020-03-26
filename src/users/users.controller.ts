import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
} from '@nestjs/common';

import { UserService } from './users.service';

@Controller('users') // http://localhost:3000/users
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post() // http://localhost:3000/users
    async addUser(
    ) {
        console.log("Weeeeee!");
    }
}