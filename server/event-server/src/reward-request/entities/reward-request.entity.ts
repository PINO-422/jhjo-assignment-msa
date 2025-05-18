import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

// Reward Request 문서 타입을 정의합니다.
export type RewardRequestDocument = RewardRequest & Document;

// 보상 요청 상태를 위한 Enum 정의
export enum RewardRequestStatus {
  PENDING = 'pending', // 대기 중
  APPROVED = 'approved', // 승인됨 (지급 예정 또는 지급 완료)
  REJECTED = 'rejected', // 거절됨
  PAID = 'paid', // 실제로 보상이 지급 완료됨 (optional 상태)
}

// 스키마 정의 데코레이터 (timestamps: true로 생성/수정 시간 자동 기록)
@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' }) // ✅ 요청한 사용자 ID (User 모델 참조)
  userId: string; // 타입스크립트에서는 ObjectId를 문자열로 처리

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Event' }) // ✅ 요청한 이벤트 ID (Event 모델 참조)
  eventId: string; // 타입스크립트에서는 ObjectId를 문자열로 처리

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Reward' }) // ✅ 요청한 보상 ID (Reward 모델 참조)
  rewardId: string; // 타입스크립트에서는 ObjectId를 문자열로 처리

  @Prop({
    required: true,
    enum: RewardRequestStatus, // ✅ 정의한 Enum 값들만 허용
    default: RewardRequestStatus.PENDING, // ✅ 기본 상태는 'pending'
  })
  status: RewardRequestStatus; // 요청 상태

  @Prop() // 보상 요청 시간 (timestamps: true로 자동 생성되므로 필수는 아님, 생성 시간으로 대체 가능)
  requestDate?: Date;

  @Prop() // 보상 처리 시간 (승인/거절/지급 완료 시 기록)
  processDate?: Date;

  @Prop() // 보상 처리 결과 메시지 (예: 거절 사유 등)
  resultMessage?: string;

  // ✅✅✅ 지급된 보상 정보 (optional, 종류에 따라 달라질 수 있으므로 Mixed 타입 사용) ✅✅✅
  // 예: { type: 'point', amount: 100 }, { type: 'coupon', code: 'ABCDEF' }
  @Prop({ type: SchemaTypes.Mixed })
  paidRewardDetails?: any;
}

// 스키마 팩토리를 사용하여 RewardRequest 클래스로부터 Mongoose 스키마 생성
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
