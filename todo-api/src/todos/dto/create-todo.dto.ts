import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { TodoStatus } from '../dto/todo-status.enum.js';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    title: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @IsEnum(TodoStatus)
    status?: TodoStatus;
}