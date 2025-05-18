import { Module } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { RewardRequestController } from './reward-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './entities/reward-request.entity';
import { EventModule } from '../event/event.module'; // EventService를 제공하는 EventModule 임포트
import { RewardModule } from '../reward/reward.module'; // RewardService를 제공하는 RewardModule 임포트


@Module({
  imports: [
    MongooseModule.forFeature([{ name: RewardRequest.name, schema: RewardRequestSchema }]),
    EventModule, // EventService를 사용하기 위해 EventModule을 가져옵니다.
    RewardModule, // RewardService를 사용하기 위해 RewardModule을 가져옵니다.
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
})
export class RewardRequestModule {}
