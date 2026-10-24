import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity.js';
import { TodosService } from './todos.service.js';
import { TodosController } from './todos.controller.js';
import { ConfigService } from '@nestjs/config';
import { API_KEY } from './tokens.js';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [
  TodosService,
    {
      provide: API_KEY,
      useFactory: (c: ConfigService) => c.get('API_KEY'),
      inject: [ConfigService],
    },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
  ],
  })
export class TodosModule {}
