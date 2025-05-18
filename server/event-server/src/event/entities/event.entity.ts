import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  content?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  location?: string;

  @Prop({ default: 0 })
  currentParticipants: number;

  @Prop({ type: Number, default: null, required: false })
  capacity?: number | null;

  @Prop()
  creator?: string;

  @Prop({ default: 'scheduled' })
  status: string;

  @Prop()
  imageUrl?: string;

  //첨부파일
  @Prop()
  applicationFormUrl?: string;

  //자료파일
  @Prop()
  brochureUrl?: string;

  //여러 첨부 파일
  @Prop([String])
  attachmentUrls?: string[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Reward' }], default: [] })
  rewardIds: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
