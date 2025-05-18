/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'; // CreateAuthDto 대신 RegisterDto로 변경
import { UserService } from '../user/user.service'; // UserService import
import { UserDocument } from '../user/entities/user.entity'; // UserDocument import
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // UserService 주입 부분 주석 해제!
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입 로직
  async register(registerDto: RegisterDto): Promise<Partial<UserDocument>> {
    const { email, userId, name, password, passwordConfirm, ...restOfDto } = registerDto;

    // 비밀번호 확인 일치 여부 
    if (password !== passwordConfirm) {
      throw new ConflictException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
    // 이메일 중복 확인 로직
    const existingUserByEmail = await this.userService.findOneByEmail(email); // 
    if (existingUserByEmail) {
      throw new ConflictException('이미 등록된 이메일 주소입니다.'); 
    }

    // userId (닉네임) 중복 확인 
    const existingUserByUserId = await this.userService.findOneByUserId(userId); //
    if (existingUserByUserId) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    try {
      // 3. UserService의 create 메서드를 사용해서 사용자 생성 및 저장!
      const createdUser = await this.userService.create({
        email,
        userId,
        name,
        password, // 평문 비밀번호 전달
        ...restOfDto,
      });

      // 4. 회원가입 성공 응답 반환 (민감한 정보 passwordHash는 빼고 반환!)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = createdUser.toObject() as Record<string, unknown>;
      return result as Partial<UserDocument>; // 타입 단언 추가
    } catch (error) {
      console.error('회원가입 중 실제 오류:', error); // 실제 오류 로깅
      if (error instanceof ConflictException) {
        throw error; // 이미 처리된 ConflictException은 다시 던짐
      }
      throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // 1. 이메일로 사용자 확인
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 2. 비밀번호 확인
    const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 3. JWT 생성 (페이로드에는 민감하지 않은 사용자 정보 포함)
    const payload = {
      sub: user._id.toString(), // ObjectId를 명시적으로 문자열로 변환
      email: user.email, 
      userId: user.userId, // 닉네임
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload); // payload 타입이 JwtService와 호환되는지 확인 필요

    return { accessToken };
  }
}
