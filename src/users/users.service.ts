import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/create-user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = this.users.create(createUserDto);
    await this.users.createQueryBuilder().insert().values(user).execute();
  }

  async findUserByEmail(email: string, password?: boolean) {
    const res = this.users
      .createQueryBuilder('u')
      .where('u.email = :email', { email });

    if (password) res.addSelect('u.password');

    return res.getOne();
  }
}
