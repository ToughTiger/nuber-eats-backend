import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAccountInput,
  LogininputDto,
  LoginOutputDto,
} from './dtos/create-account-dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInputDto } from './dtos/edit-profile.dto';
import { Verification } from './entity/verification.entity';
import { VerifyEmailOutputDto } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    name,
    email,
    password,
    role,
  }: createAccountInput): Promise<LoginOutputDto> {
    try {
      const user = await this.userRepository.save(
        this.userRepository.create({ name, email, password, role }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );
      await this.mailService.sendMail(
        user.email,
        'New User Registration',
        verification.code,
        user.name,
      );

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could Not create account',
      };
    }
  }

  async login({
    email,
    password,
  }: LogininputDto): Promise<{
    success: boolean;
    error?: string;
    token?: string;
  }> {
    let user = await this.userRepository.findOne(
      { email },
      { select: ['id', 'password'] },
    );
    if (!user) {
      throw Error();
    }
    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) {
      throw Error();
    }
    const token = this.jwtService.sign({ id: user.id });
    if (token) {
      return {
        success: true,
        token,
      };
    } else {
      return {
        success: false,
        error: 'Invalid Username or password',
      };
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    return user;
  }

  // Edit Profile

  async editProfile(
    userId: number,
    { email, password }: EditProfileInputDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (email) {
      user.email = email;
      user.isVerified = false;
     const verification = await this.verifications.save(this.verifications.create(user));
      await this.mailService.sendMail(
        user.email,
        'Account Update Verification',
        verification.code,
        user.name,
      );
    }
    if (password) {
      user.password = password;
    }
    return await this.userRepository.save(user);
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutputDto> {
    try {
      const verified = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verified) {
        verified.user.isVerified = true;
        this.userRepository.save(verified.user);
        this.verifications.delete(verified.id);
        return {
          success: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Verification failed',
      };
    }
  }
}
