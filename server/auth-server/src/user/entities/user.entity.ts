import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose'; // ObjectId와 SchemaTypes를 mongoose에서 가져옵니다.

export type UserDocument = User & Document; // UserDocument 타입을 정의합니다.

// 사용자 권한을 나타내는 Enum 정의
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  OPERATOR = 'operator', // 필요시 추가
  AUDITOR = 'auditor', // 필요시 추가
}

@Schema({
  timestamps: true, // createdAt, updatedAt 필드를 자동으로 관리합니다.
  collection: 'users', // MongoDB 컬렉션 이름을 'users'로 명시합니다.
})
export class User {
  _id: ObjectId;

  // 사용자 로그인 ID (이메일)
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  // 사용자 ID 닉네임 (로그인 ID 아님)
  @Prop({ required: true, unique: true, trim: true })
  userId: string;

  // 사용자 이름
  @Prop({ required: true, trim: true })
  name: string;

  // 사용자 비밀번호 (해시된 형태로 저장)
  @Prop({ required: true })
  passwordHash: string;

  // 주소
  @Prop({ trim: true })
  address?: string;

  // 생년월일
  @Prop()
  birthDate?: Date;

  // 성별 ('male', 'female', 'other' 등)
  @Prop()
  gender?: string;

  // 특정 그룹 ID
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Group' })
  groupId?: ObjectId;

  // 보유 적립금
  @Prop({ default: 0 })
  points: number;

  // 사용자 보유 쿠폰 목록
  @Prop({
    type: [
      {
        couponId: { type: SchemaTypes.ObjectId, required: true, ref: 'Coupon' }, // Coupon 컬렉션 참조
        issuedAt: { type: Date, required: true, default: Date.now },
        usedAt: { type: Date },
      },
    ],
    default: [], // 기본값으로 빈 배열 설정
  })
  coupons: {
    couponId: ObjectId;
    issuedAt: Date;
    usedAt?: Date;
  }[];

  // 사용자 역할
  @Prop({
    required: true,
    default: 'USER',
    enum: ['USER', 'ADMIN', 'OPERATOR'],
  })
  role: string;

  // 사용자의 이벤트 선호 카테고리/태그 등
  @Prop({ type: [String], default: [] })
  eventPreferences?: string[];

  // 사용자 알림 설정
  @Prop({
    type: {
      emailForNewEvents: { type: Boolean, default: true },
      emailForEventUpdates: { type: Boolean, default: true },
      emailForEventReminders: { type: Boolean, default: true },
    },
    _id: false, // 이 중첩 객체에 대해 _id를 생성하지 않도록 설정
    default: () => ({}), // 기본값으로 빈 객체를 제공하여 하위 기본값이 적용되도록 함
  })
  notificationSettings?: {
    emailForNewEvents: boolean;
    emailForEventUpdates: boolean;
    emailForEventReminders: boolean;
  };

  // 사용자 프로필 이미지 URL
  @Prop({ trim: true })
  profileImageUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
