import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainsModule } from './domains/domains.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/lider'),
    UsersModule,
    AuthModule,
    DomainsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
