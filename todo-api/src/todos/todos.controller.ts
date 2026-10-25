import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import * as currentUserDecorator from '../auth/decorators/current-user.decorator.js';
import { Role, Roles } from '../common/decorators/roles.decorator.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { TodoStatus } from './dto/todo-status.enum.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { ParseStatusPipe } from './pipes/parse-status.pipe.js';
import { TodosService } from './todos.service.js';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser) {
    return this.todosService.create(createTodoDto, user.id);
  }

  @Get()
  findAll(@Query('status', ParseStatusPipe) s: TodoStatus | undefined, @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser) {
    return this.todosService.findAllFor(user, s);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser) {
    return this.todosService.findOneFor(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser,
  ) {
    return this.todosService.update(id, updateTodoDto, user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @currentUserDecorator.CurrentUser() user: currentUserDecorator.AuthUser) {
    return this.todosService.remove(id, user);
  }
}