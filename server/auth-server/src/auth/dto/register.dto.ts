import { IsString, IsNotEmpty, MinLength, Matches, IsEmail, IsOptional, IsDateString, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// 알림 설정 DTO
class NotificationSettingsDto {
  // 새 이벤트 알림 수신 여부
  @IsOptional() @IsBoolean() emailForNewEvents?: boolean;
  // 이벤트 정보 변경 알림 수신 여부
  @IsOptional() @IsBoolean() emailForEventUpdates?: boolean;
  // 이벤트 시작 전 알림 수신 여부
  @IsOptional() @IsBoolean() emailForEventReminders?: boolean;
}

export class RegisterDto {
  // 사용자 로그인 이메일
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  // 사용자 닉네임 
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' }) // 닉네임 최소 길이 (예시)
  userId: string;

  // 사용자 성명
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  name: string;

  // 사용자 비밀번호
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;

  // 사용자 비밀번호 확인
  @IsString({ message: '비밀번호 확인은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호 확인은 필수 입력 항목입니다.' })
  @MinLength(8, { message: '비밀번호 확인은 최소 8자 이상이어야 합니다.' })
  passwordConfirm: string;

  // 사용자 주소 (선택 사항)
  @IsOptional() @IsString() address?: string;
  // 사용자 생년월일 (선택 사항, YYYY-MM-DD 형식)
  @IsOptional() @IsDateString() birthDate?: Date;
  // 사용자 성별 (선택 사항)
  @IsOptional() @IsString() gender?: string;
  // 사용자 이벤트 선호도 (선택 사항, 문자열 배열)
  @IsOptional() @IsArray() @IsString({ each: true }) eventPreferences?: string[];
  // 사용자 알림 설정 (선택 사항)
  @IsOptional() @ValidateNested() @Type(() => NotificationSettingsDto) notificationSettings?: NotificationSettingsDto;
  // 사용자 프로필 이미지 URL (선택 사항)
  @IsOptional() @IsString() profileImageUrl?: string;
}
