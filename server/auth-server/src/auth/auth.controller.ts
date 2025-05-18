import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // 회원가입 성공 시 201 Created 반환
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    // 실제 응답에서는 passwordHash 같은 민감 정보는 제외하는 것이 좋습니다.
    // AuthService에서 이미 처리하고 있지만, 컨트롤러 레벨에서도 한번 더 신경 쓸 수 있습니다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user; // AuthService에서 반환된 객체에 passwordHash가 있다면 여기서도 제외
    return result;
  }

  @Post('login') // POST /auth/login 경로 추가!
  @HttpCode(HttpStatus.OK) // 로그인 성공 시 200 OK 반환
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto); // AuthService의 login 메서드 호출!
  }
}
