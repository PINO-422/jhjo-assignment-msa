import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common'; // UsePipes, ValidationPipe import 추가
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { IsMongoId } from 'class-validator';

export class MongoIdParam {
  @IsMongoId()
  id: string;
}

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  findOne(@Param() params: MongoIdParam) {
    console.log(`ID로 보상 조회 Controller 실행: ${params.id}`); // 받은 id 로그 찍어보기
    return this.rewardService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param() params: MongoIdParam, @Body() updateRewardDto: UpdateRewardDto) {
    console.log(`ID로 보상 업데이트 Controller 실행: ${params.id}`, updateRewardDto);
    return this.rewardService.update(params.id, updateRewardDto);
  }

  @Delete(':id') 
  @UsePipes(ValidationPipe)
  remove(@Param() params: MongoIdParam) {
    console.log(`ID로 보상 삭제 Controller 실행: ${params.id}`); // 받은 ID 로그 찍어보기
    // Service 메서드 호출 시 params.id 사용!
    return this.rewardService.remove(params.id); // RewardService의 remove 메서드 호출!
  }
}
