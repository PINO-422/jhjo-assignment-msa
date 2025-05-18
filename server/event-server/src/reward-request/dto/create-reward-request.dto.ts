import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateRewardRequestDto {
  @IsNotEmpty() //  비어있으면 안 됨
  @IsMongoId() //  MongoDB ObjectId 형식인지 검사
  userId: string; // 요청한 사용자 ID (필수)

  @IsNotEmpty() // 비어있으면 안 됨
  @IsMongoId() // MongoDB ObjectId 형식인지 검사
  eventId: string; // 요청한 이벤트 ID (필수)

  @IsNotEmpty() // 비어있으면 안 됨
  @IsMongoId() // MongoDB ObjectId 형식인지 검사
  rewardId: string; // 요청한 보상 ID (필수)
}
