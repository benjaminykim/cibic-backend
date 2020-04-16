import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const fs = require('fs');

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('./src/api.cibic.io.key'),
        cert: fs.readFileSync('./src/api.cibic.io.crt'),
    };
    const app = await NestFactory.create(AppModule, { httpsOptions });
    await app.listen(3000);
}
bootstrap();
