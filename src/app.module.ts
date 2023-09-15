import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { envConfiguration } from './config/configuration';
import { envSchema } from './config/validation';
import { getEnvPath } from './helpers/env.helper';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';

const envFilePath: string = getEnvPath(`${__dirname}/config/env/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      // load: [envConfiguration],
      validationSchema: envSchema,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
