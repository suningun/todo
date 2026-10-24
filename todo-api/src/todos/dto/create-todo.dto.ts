import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { TodoStatus } from '../dto/todo-status.enum.js';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    title: string;

    @IsOptional()
    @IsEnum(TodoStatus)
    status?: TodoStatus;
}