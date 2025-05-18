/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserDocument } from './entities/user.entity'; // UserDocument import 추가!

// req.user의 타입을 명시하기 위한 인터페이스 (여기에 그대로 두거나 파일 상단에 정의)
interface AuthenticatedRequest extends Request {
  user: { // JwtStrategy.validate에서 반환하는 객체 구조와 일치해야 합니다.
    sub: string; // JWT 표준 subject 클레임 (사용자 ID)
    email: string;
    role: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 사용자 생성 (회원가입 시 UserService에서 사용)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 모든 사용자 조회 (보호되지 않은 API)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // '/user/profile' 경로를 '/user/:id'보다 먼저 정의합니다.
  // 이렇게 하면 'profile'이 ID로 해석되는 것을 방지할 수 있습니다.
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드 사용 -> 요청 시 유효한 JWT 필요!
  @Get('profile') // GET /user/profile 경로!
  async getMyProfile(@Req() req: AuthenticatedRequest): Promise<Omit<UserDocument, 'passwordHash'>> { // 반환 타입 명시
    console.log('로그인된 사용자 정보 (req.user):', req.user); // 서버 로그로 확인!

    if (!req.user || !req.user.sub) {
      throw new NotFoundException(
        'User information not found in token payload',
      );
    }

    // JWT의 sub (사용자 ID)를 사용하여 데이터베이스에서 사용자 정보를 다시 조회
    const user = await this.userService.findOne(req.user.sub);

    if (!user) {
      // JWT는 유효했지만, 해당 ID의 사용자가 DB에 없는 경우 (삭제되었거나 등)
      throw new NotFoundException(
        `User with ID "${req.user.sub}" not found in database`,
      );
    }

    // 민감 정보 (passwordHash) 제외하고 응답으로 반환
    const userObject: UserDocument = user.toObject() as UserDocument; // 타입 단언 추가
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = userObject;
    return result as Omit<UserDocument, 'passwordHash'>; // 반환 타입에 맞게 단언
  }

  // 특정 사용자 ID로 조회 (보호되지 않은 API - ObjectId 형태의 ID를 받음)
  // 이 라우트는 '/user/profile' 보다 뒤에 정의되어야 합니다.
  @Get(':id')
  findOne(@Param('id') id: string) {
    // 네 UserService의 findOne 메서드는 string ID를 받아서 findById를 호출하므로 괜찮습니다.
    return this.userService.findOne(id);
  }

  // 특정 사용자 ID로 업데이트 (보호되지 않은 API)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // 특정 사용자 ID 삭제 (보호되지 않은 API)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.remove(id);
  }
}