import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput, LoginDto } from './dtos/create-account-dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<User> {
    return await this.userRepository.save(
      this.userRepository.create({ email, password, role }),
    );
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    let user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('email id not found');
    }
    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) {
      throw new NotFoundException('Password is wrong');
    }
    let authenticUser = await _.pick(user, ['email', 'id']);
    return authenticUser;
  }
}
