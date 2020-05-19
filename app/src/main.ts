import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    if (!configService.isProduction()) {
        const builder = new DocumentBuilder()
            .setTitle('Cibic API')
            .setDescription('This is what our Frontend talks to.')
            .build()
        const docs = SwaggerModule.createDocument(app, builder);
        SwaggerModule.setup('docs', app, docs);
    }
    await app.listen(configService.getApiPort());
}
bootstrap();
