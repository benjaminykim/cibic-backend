import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const bcrypt = require('bcrypt');
        const user = await this.usersService.getUserByEmail(email);

        bcrypt.compare(pass, user.password).then(result => {
            if (result) {
                const { password, ...response } = user;
                return response;
            }
            return null;
        });
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.password };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
