import { Module } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { RewardRequestController } from './reward-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './entities/reward-request.entity';
import { EventModule } from '../event/event.module'; // EventService�� �����ϴ� EventModule ����Ʈ
import { RewardModule } from '../reward/reward.module'; // RewardService�� �����ϴ� RewardModule ����Ʈ


@Module({
  imports: [
    MongooseModule.forFeature([{ name: RewardRequest.name, schema: RewardRequestSchema }]),
    EventModule, // EventService�� ����ϱ� ���� EventModule�� �����ɴϴ�.
    RewardModule, // RewardService�� ����ϱ� ���� RewardModule�� �����ɴϴ�.
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
})
export class RewardRequestModule {}
