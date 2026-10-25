import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) {}

    existsByEmail(email: string) {
        return this.repo.existsBy({ email });
    }

    async create(email: string, passwordHash: string) {
        const user = this.repo.create({ email, passwordHash });
        return this.repo.save(user);
    }

    findByEmailWithPassword(email: string) {
        return this.repo.findOne({
        where: { email },
        select: {
            id: true,
            email: true,
            role: true,
            passwordHash: true,
        },
        });
    }

    findById(id: string) {
        return this.repo.findOneBy({ id });
    }
}