import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainsModule } from './domains/domains.module';
import { ProcessorsModule } from './processors/processors.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DomainsProcessorsModule } from './domains_processors/domains_processors.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/lider'),
    UsersModule,
    AuthModule,
    DomainsModule,
    ProcessorsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    DomainsProcessorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
