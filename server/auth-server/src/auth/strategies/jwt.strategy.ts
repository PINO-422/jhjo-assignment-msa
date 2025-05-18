import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// JWT 페이로드 타입을 정의 (JWT 토큰 안에 담길 사용자 정보 형식)
interface JwtPayload {
  sub: string; // MongoDB ObjectId 문자열 (사용자 고유 ID)
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET'); // .env에서 JWT_SECRET 가져오기
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // JWT 검증 성공 시 호출되는 메서드
  // validate 메서드는 현재 DB 조회가 없으므로 async일 필요가 없습니다.
  validate(payload: JwtPayload): Omit<JwtPayload, 'iat' | 'exp'> {
    // 반환 타입 명시 (iat, exp 제외)
    // 필요하다면 여기서 payload.sub (사용자 ID)를 사용해서 DB에서 실제 사용자를 조회하고,
    // 사용자가 존재하지 않거나 비활성화된 경우 UnauthorizedException을 던질 수 있습니다.
    // 예: const user = await this.userService.findById(payload.sub); if (!user) throw new UnauthorizedException();
    return { sub: payload.sub, email: payload.email, role: payload.role }; // req.user에 담길 객체
  }
}
