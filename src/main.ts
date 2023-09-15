import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import fs from 'fs';
import { AppModule } from './app.module';

const httpsOptions = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3000;

  console.log(`\n==============================================`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`==============================================`);

  await app.listen(PORT);

  console.log(`Server is running on: https://localhost:${PORT}`);
}

bootstrap();
