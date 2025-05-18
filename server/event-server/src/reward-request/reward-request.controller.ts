import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common'; // HttpCode, HttpStatus 임포트 추가!
import { RewardRequestService } from './reward-request.service'; // 임포트 확인
import { CreateRewardRequestDto } from './dto/create-reward-request.dto'; // 임포트 확인
import { UpdateRewardRequestDto } from './dto/update-reward-request.dto';
import { IsMongoId } from 'class-validator';

export class MongoIdParam {
  @IsMongoId()
  id: string;
}

@Controller('reward-request') // 기본 경로 확인
@UsePipes(ValidationPipe) //  ValidationPipe를 컨트롤러 전체에 적용!
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {} // Service 주입 확인

  @Post()
  @HttpCode(HttpStatus.CREATED) //  201 Created 상태 코드 명시적 설정
  create(@Body() createRewardRequestDto: CreateRewardRequestDto) {
    console.log('보상 요청 생성 Controller 실행', createRewardRequestDto);
    return this.rewardRequestService.create(createRewardRequestDto);
  }

  @Get() // ✅✅✅ GET /reward-request 엔드포인트! ✅✅✅
  findAll() {
    console.log('모든 보상 요청 조회 Controller 실행');
    return this.rewardRequestService.findAll(); // ✅ Service findAll 호출!
  }

  @Get(':id') // ✅✅✅ GET /reward-request/:id 엔드포인트! ✅✅✅
  findOne(@Param() params: MongoIdParam) { // ✅ @Param() DTO 사용!
    console.log(`ID로 보상 요청 조회 Controller 실행: ${params.id}`);
    return this.rewardRequestService.findOne(params.id); // ✅ Service findOne 호출!
  }

  @Patch(':id') // ✅✅✅ PATCH /reward-request/:id 엔드포인트! ✅✅✅
  update(@Param() params: MongoIdParam, @Body() updateRewardRequestDto: UpdateRewardRequestDto) { // ✅ @Param() DTO, @Body() DTO 사용!
    console.log(`ID로 보상 요청 업데이트 Controller 실행: ${params.id}`, updateRewardRequestDto);
    return this.rewardRequestService.update(params.id, updateRewardRequestDto); // ✅ Service update 호출!
  }

  @Delete(':id') //  DELETE /reward-request/:id 엔드포인트! ✅✅✅
  @HttpCode(HttpStatus.OK) //  삭제 성공 시 200 OK 상태 코드 명시적 설정 (필요에 따라 204 No Content 사용하기도 함)
  remove(@Param() params: MongoIdParam) { //  @Param() DTO 사용!
    console.log(`ID로 보상 요청 삭제 Controller 실행: ${params.id}`);
    return this.rewardRequestService.remove(params.id); // ✅ Service remove 호출!
  }
}