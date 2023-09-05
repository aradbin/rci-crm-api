import { Controller, Post, Request, Get, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorators";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("profile")
  getProfile(@Request() req: any) {
    return "ok";
  }
}
