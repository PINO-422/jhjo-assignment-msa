import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './entities/reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<RewardDocument> {
    const createdReward = new this.rewardModel(createRewardDto);
    return createdReward.save();
  }

  async findAll(): Promise<RewardDocument[]> {
    console.log('모든 보상 조회 Service 실행');
    return this.rewardModel.find().exec();
  }

  async findOne(id: string): Promise<RewardDocument> {
    console.log(`ID로 보상 조회 Service 실행: ${id}`);

    // findById를 사용하여 ID로 문서를 찾습니다.
    const reward = await this.rewardModel.findById(id).exec();

    if (!reward) {
      throw new NotFoundException(`Reward with ID "${id}" not found`);
    }

    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<RewardDocument> { // ✅ ID는 string 타입, UpdateRewardDto 인자, RewardDocument 반환 타입
    console.log(`ID로 보상 업데이트 Service 실행: ${id}`, updateRewardDto); // 받은 ID와 데이터 로그 찍어보기

    const updatedReward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true, useFindAndModify: false }) // ✅ findByIdAndUpdate 사용!
      .exec(); // 쿼리 실행!

    if (!updatedReward) {
      // 해당 ID의 보상을 찾지 못했을 경우 NotFoundException 예외 발생!
      throw new NotFoundException(`Reward with ID "${id}" not found`); // NotFoundException 임포트 되어 있어야 합니다!
    }

    return updatedReward;
  }

  async remove(id: string): Promise<RewardDocument> { // ID는 string 타입, 삭제된 문서 객체 반환 (NotFoundException 던짐)
    console.log(`ID로 보상 삭제 Service 실행: ${id}`); // 받은 ID 로그 찍어보기
    const deletedReward = await this.rewardModel.findByIdAndDelete(id).exec();

    if (!deletedReward) {
      throw new NotFoundException(`Reward with ID "${id}" not found`);
    }
    return deletedReward;
  }
}
