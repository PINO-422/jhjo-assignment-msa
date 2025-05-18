import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './entities/reward.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]), // MongooseModule 설정 추가!
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
