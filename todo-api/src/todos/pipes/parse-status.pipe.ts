import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TodoStatus } from '../dto/todo-status.enum.js';

@Injectable()
export class ParseStatusPipe implements PipeTransform {
    transform(value: string | undefined, _meta: ArgumentMetadata) {
        if (!value) return undefined;

        const status = value.toUpperCase();
        const valid: string[] = Object.values(TodoStatus);
        if (!valid.includes(status)) {
        throw new BadRequestException(`Bad status: ${value}`);
        }
        return status as TodoStatus;
    }
}