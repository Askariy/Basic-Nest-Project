import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
     AuthModule, TasksModule, PrismaModule],
  controllers: [AppController, AuthController,TasksController, UserController],
  providers: [AppService, AuthService, TasksService],
})
export class AppModule {}
