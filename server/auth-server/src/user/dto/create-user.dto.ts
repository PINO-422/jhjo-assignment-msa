import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEmail,
  IsDateString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// 알림 설정을 위한 DTO (CreateUserDto 내부에서 사용)
class CreateUserNotificationSettingsDto {
  @IsOptional() @IsBoolean() emailForNewEvents?: boolean;
  @IsOptional() @IsBoolean() emailForEventUpdates?: boolean;
  @IsOptional() @IsBoolean() emailForEventReminders?: boolean;
}

export class CreateUserDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'userId는 필수 입력 항목입니다.' })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'name은 필수 입력 항목입니다.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'password는 필수 입력 항목입니다.' })
  @MinLength(8, { message: 'password는 최소 8자 이상이어야 합니다.' })
  password: string;

  @IsOptional() // 선택적 필드
  @IsString()
  address?: string;

  @IsOptional() // 선택적 필드
  @IsNumber({}, { message: 'points는 숫자여야 합니다.' })
  @Min(0, { message: 'points는 0 이상이어야 합니다.' }) // 포인트는 음수가 될 수 없다고 가정
  points?: number;

    // RegisterDto에 있는 추가적인 선택적 필드들
  @IsOptional() @IsDateString() birthDate?: Date; // 또는 string
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) eventPreferences?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserNotificationSettingsDto)
  notificationSettings?: CreateUserNotificationSettingsDto;

  @IsOptional() @IsString() profileImageUrl?: string;
}
