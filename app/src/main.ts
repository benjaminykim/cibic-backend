import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    if (!configService.isProduction()) {
        const docs = SwaggerModule.createDocument(app, new DocumentBuilder()
                                                  .setTitle('Cibic API')
                                                  .setDescription('Cibic Api')
                                                  .build());
        SwaggerModule.setup('docs', app, docs);
    }
    await app.listen(3000);
}
bootstrap();
