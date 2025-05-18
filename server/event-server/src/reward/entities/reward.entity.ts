import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Mongoose Document와 Reward 클래스를 합친 타입 정의
export type RewardDocument = Reward & Document;

// 스키마 정의 데코레이터 (timestamps: true로 생성/수정 시간 자동 기록)
@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true }) // 이름 필드 (필수)
  name: string;

  // 설명 필드 (선택)
  @Prop()
  description?: string;

  // 종류 필드 (필수 - 예: 'point', 'coupon')
  @Prop({ required: true })
  type: string;

  // 보상의 구체적인 내용 (ex: 포인트 수량(number), 쿠폰 코드(string), 아이템 ID(string) 등) - 일단 any 타입으로 유연하게!
  @Prop({ type: Number, required: true }) // 값/수량 필드 (필수 - 종류에 따라 값의 형태가 달라질 수 있음)
  value: number;

  // 재고/수량 제한 필드 (선택)
  @Prop()
  stock?: number; // 지급 가능한 보상의 총 수량

  // 유효 기간 필드 (선택)
  @Prop({ type: Date, default: null, required: false }) // ✅ type: Date 명시, required: false 추가
  expiryDate?: Date | null;
}

// 스키마 팩토리를 사용하여 Reward 클래스로부터 Mongoose 스키마 생성
export const RewardSchema = SchemaFactory.createForClass(Reward);
