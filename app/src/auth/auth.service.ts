import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const bcrypt = require('bcrypt');
        const user = await this.usersService.getUserByEmail(email);
        if (!user)
            return null;

        bcrypt.compare(pass, user.password).then(result => {
            if (result) {
                const { password, ...response } = user;
                return response;
            }
            return null;
        });
    }

    async login(user: any) {
        const bcrypt = require('bcrypt');
        const userByEmail = await this.usersService.getUserByEmail(user.email);
        if (!userByEmail)
            throw new UnauthorizedException('invalid email or password');
        const match = await bcrypt.compare(user.password, userByEmail.password);

        if (match) {
            const { password, ...response } = userByEmail;
            const payload = { username: response.username, sub: response._id, id: userByEmail._id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        throw new UnauthorizedException('invalid email or password');
    }
}
