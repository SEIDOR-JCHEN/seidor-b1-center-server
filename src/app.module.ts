import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { envConfiguration } from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { getEnvPath } from './config/env.helper';
import { envSchema } from './config/env.validation';
import { PrismaModule } from './modules/common/prisma/prisma.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { WorkOrdersModule } from './modules/apps/prodassist/work-orders/work-orders.module';
import { ResourcesModule } from './modules/apps/prodassist/resources/resources.module';
import { InvoicesModule } from './modules/apps/suppnet/invoices/invoices.module';

const envFilePath: string = getEnvPath(`${__dirname}/config/env/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      validationSchema: envSchema,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    WorkOrdersModule,
    ResourcesModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
