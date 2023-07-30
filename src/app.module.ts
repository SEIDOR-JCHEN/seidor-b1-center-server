import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/validation';
import { envConfiguration } from './config/configuration';
import { getEnvPath } from './helpers/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/config/envs/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      load: [envConfiguration],
      validationSchema: envSchema,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
