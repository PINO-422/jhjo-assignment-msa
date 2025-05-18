// event-server/src/event/dto/create-event.dto.ts
import { IsString, IsOptional, IsDate, IsNumber, IsEnum, IsNotEmpty, IsUrl, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number | null;

  @IsOptional()
  @IsString()
  creator?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  // 이벤트 대표 이미지 URL
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  // 파일 관련
  @IsOptional()
  @IsUrl() 
  applicationFormUrl?: string;

  // 안내 자료 파일 URL
  @IsOptional()
  @IsUrl()
  brochureUrl?: string;

  // 기타 첨부 파일 URL 목록 (문자열 배열)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsMongoId({ each: true }) 
  attachmentUrls?: string[];

  // rewardIds
@IsOptional()
  @IsArray() // 배열인지 검사!
  @IsMongoId({ each: true }) // 배열 안의 각 요소가 MongoDB ObjectId 형식인지 검사!
  rewardIds?: string[]; // 보상 ID 목록 (문자열 배열, ObjectId 형식)
}
