import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { CabildoModule } from './cabildos/cabildo.module';
import { ActivityModule } from './activities/activity.module';
import { AuthModule } from './auth/auth.module';
import { FcmModule } from './nestjs-fcm/fcm.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(
            configService.getTypeOrmConfig(),
        ),
        FcmModule.forRoot({
            firebaseSpecsPath: './nestjs-fcm/fcm.json',
        }),
        UserModule,
        CabildoModule,
        ActivityModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
