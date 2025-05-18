import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'; // BadRequestException, ConflictException 임포트 추가!
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { UpdateRewardRequestDto } from './dto/update-reward-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument, RewardRequestStatus } from './entities/reward-request.entity';
import { SchemaTypes } from 'mongoose';

import { EventService } from '../event/event.service'; // EventService 임포트 경로 확인!
import { RewardService } from '../reward/reward.service';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequestDocument>, // 모델 주입 확인
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
  ) {}

  async create(createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequestDocument> {
    console.log('보상 요청 생성 Service 실행', createRewardRequestDto);

    const { userId, eventId, rewardId } = createRewardRequestDto;

    // 1. Event 및 Reward 유효성 확인 및 데이터 조회
    // EventService와 RewardService를 사용하여 해당 ID의 문서가 존재하는지 확인합니다.
    // findOne 메서드에서 NotFoundException을 던지므로, 여기서 따로 null 체크는 하지 않아도 됩니다.
    const event = await this.eventService.findOne(eventId); // ✅ EventService 사용하여 이벤트 조회
    const reward = await this.rewardService.findOne(rewardId); // ✅ RewardService 사용하여 보상 조회

    // TODO: 2. 이벤트 조건 검증 로직 추가 (이 사용자가 이벤트를 완료했는지 등)
    // 지금은 간단히 이벤트가 존재하고 보상이 이벤트에 연결되어 있는지 확인합니다.
    const isRewardLinkedToEvent = event.rewardIds.includes(rewardId);
    if (!isRewardLinkedToEvent) {
        // 이벤트에 해당 보상이 연결되어 있지 않다면 오류 발생
        throw new BadRequestException(`Reward with ID "${rewardId}" is not associated with Event with ID "${eventId}"`);
    }
    // 3. 중복 보상 요청 방지 로직
    // 이미 해당 유저가 이 이벤트/보상 조합으로 보상 요청을 했는지 확인합니다.
    const existingRequest = await this.rewardRequestModel.findOne({
        userId: userId,
        eventId: eventId,
        rewardId: rewardId,
        // 상태가 PENDING, APPROVED, PAID 중 하나라면 중복으로 간주 (REJECTED는 재요청 가능하게 할 수도 있음)
        status: { $in: [RewardRequestStatus.PENDING, RewardRequestStatus.APPROVED, RewardRequestStatus.PAID] }
    }).exec();

    if (existingRequest) {
      // 이미 보상 요청이 존재한다면 오류 발생
      throw new ConflictException(`User "${userId}" has already requested this reward for event "${eventId}".`);
    }

    // 4. 보상 요청 문서 생성 및 상태 설정
    const createdRewardRequest = new this.rewardRequestModel({
      userId: userId,
      eventId: eventId,
      rewardId: rewardId,
      status: RewardRequestStatus.PENDING, // 초기 상태는 PENDING
    });

    // 5. 보상 지급 로직 (간소화 - 여기서는 상태만 업데이트)
    // 여기서는 일단 요청을 승인(APPROVED) 상태로 변경하고 저장합니다.
    // 일단 요청은 접수되었고, 조건 검사 (이벤트/보상 존재, 연결 여부)까지 통과했으므로 상태를 APPROVED로 변경
    createdRewardRequest.status = RewardRequestStatus.APPROVED;
    createdRewardRequest.processDate = new Date(); // 처리 시간 기록

    return createdRewardRequest.save(); // ✅ MongoDB에 저장! (상태가 PENDING -> APPROVED로 변경된 상태로 저장)
  }

  async findAll(): Promise<RewardRequestDocument[]> {
    console.log('모든 보상 요청 조회 Service 실행');
    return this.rewardRequestModel.find().exec();
  }

  async findOne(id: string): Promise<RewardRequestDocument> {
    console.log(`ID로 보상 요청 조회 Service 실행: ${id}`);
    // ID로 RewardRequest 문서를 찾습니다.
    const rewardRequest = await this.rewardRequestModel.findById(id).exec();
    if (!rewardRequest) {
      throw new NotFoundException(`RewardRequest with ID "${id}" not found`);
    }
    return rewardRequest;
  }

  async update(id: string, updateRewardRequestDto: UpdateRewardRequestDto): Promise<RewardRequestDocument> {
    console.log(`ID로 보상 요청 업데이트 Service 실행: ${id}`, updateRewardRequestDto);

    // findByIdAndUpdate 메서드를 사용하여 ID로 찾고 업데이트를 수행합니다.
    const updatedRewardRequest = await this.rewardRequestModel
      .findByIdAndUpdate(id, updateRewardRequestDto, { new: true, useFindAndModify: false })
      .exec(); // 쿼리 실행!

    if (!updatedRewardRequest) {
      throw new NotFoundException(`RewardRequest with ID "${id}" not found`);
    }

    // TODO: 상태 변경 시 추가 로직 (예: PAID 상태가 되면 실제 보상 지급) 필요
    return updatedRewardRequest;
  }

  async remove(id: string): Promise<RewardRequestDocument> {
    console.log(`ID로 보상 요청 삭제 Service 실행: ${id}`);

    // findByIdAndDelete 메서드를 사용하여 ID로 찾고 삭제를 수행합니다.
    const deletedRewardRequest = await this.rewardRequestModel.findByIdAndDelete(id).exec();

    if (!deletedRewardRequest) {
      throw new NotFoundException(`RewardRequest with ID "${id}" not found`);
    }

    return deletedRewardRequest;
  }
}
