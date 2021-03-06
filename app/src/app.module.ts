import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { CabildoModule } from './cabildos/cabildo.module';
import { ActivityModule } from './activities/activity.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { TagModule } from './tag/tag.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(
            configService.getTypeOrmConfig(),
        ),
        UserModule,
        CabildoModule,
        ActivityModule,
        AuthModule,
        SearchModule,
        TagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
