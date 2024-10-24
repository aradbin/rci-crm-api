import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto, avatar: Express.Multer.File) {
    const createUserDto: CreateUserDto = { ...registerDto };

    return await this.userService.create(createUserDto, avatar);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User is not registered. Please Register');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is Inactive. Please contact your admin');
    }
    const passwordValid = await bcrypt.compare(loginDto.password, user.password);
    if (passwordValid) {
      const payload = {
        email: user.email,
        id: user.id,
        username: user.username,
      };
      return {
        accessToken: this.jwtService.sign(payload),
        user: user,
      };
    }
    throw new UnauthorizedException(`Credentials didn't match. Please try again or reset your password`);
  }

  async profile(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user && user.is_active) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
