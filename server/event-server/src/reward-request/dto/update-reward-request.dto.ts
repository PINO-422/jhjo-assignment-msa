import { PartialType } from '@nestjs/mapped-types'; // PartialType 임포트!
import { CreateRewardRequestDto } from './create-reward-request.dto'; // CreateRewardRequestDto 임포트!
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator'; // 필요한 데코레이터 임포트
import { RewardRequestStatus } from '../entities/reward-request.entity';

export class UpdateRewardRequestDto extends PartialType(CreateRewardRequestDto) {
  @IsOptional() // ✅ 필수가 아님
  @IsEnum(RewardRequestStatus) // ✅ RewardRequestStatus Enum 값 중 하나인지 검사!
  status?: RewardRequestStatus; // 보상 요청 상태 업데이트

  @IsOptional() // ✅ 필수가 아님
  @IsString() // ✅ 문자열인지 검사!
  resultMessage?: string; // 보상 처리 결과 메시지 업데이트
}
