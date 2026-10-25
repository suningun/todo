import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo } from './entities/todo.entity.js';
import { TodoStatus } from './dto/todo-status.enum.js';
import { Role } from '../common/decorators/roles.decorator.js';
import { AuthUser } from '../auth/decorators/current-user.decorator.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  create(dto: CreateTodoDto, ownerId: string) {
    const todo = this.repo.create({ ...dto, ownerId });
    return this.repo.save(todo);
  }

  findAllFor(user: AuthUser, status?: TodoStatus) {
    return this.repo.findBy({
      ...(user.role !== Role.ADMIN && { ownerId: user.id }),
      ...(status && { status }),
    });
  }

  async findOneFor(id: number, user: AuthUser): Promise<Todo> {
    const todo = await this.repo.findOneBy({ id });
    const allowed = todo && (todo.ownerId === user.id || user.role === Role.ADMIN);

    if (!allowed) throw new NotFoundException();
    return todo;
  }

  async update(id: number, dto: UpdateTodoDto, user: AuthUser) {
    await this.findOneFor(id, user); // throws 404 if not theirs
    await this.repo.update(id, dto);
    return this.findOneFor(id, user);
  }

  async remove(id: number, user: AuthUser) {
    await this.findOneFor(id, user); // throws 404 if not theirs
    await this.repo.delete(id);
  }
}
