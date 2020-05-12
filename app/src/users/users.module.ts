import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';

import { CabildoModule } from '../cabildos/cabildo.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		  CabildoModule,
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService, TypeOrmModule],
})
export class UserModule { }
