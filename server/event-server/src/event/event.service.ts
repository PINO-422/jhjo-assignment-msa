import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}
  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    console.log('이벤트 생성 Service 실행', createEventDto);
    const createdEvent = new this.eventModel({
      name: createEventDto.name,
      description: createEventDto.description,
      content: createEventDto.content, 
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
      location: createEventDto.location,
      capacity: createEventDto.capacity,
      creator: createEventDto.creator,
      status: createEventDto.status || 'scheduled',
      imageUrl: createEventDto.imageUrl,
      applicationFormUrl: createEventDto.applicationFormUrl,
      brochureUrl: createEventDto.brochureUrl,
      attachmentUrls: createEventDto.attachmentUrls,
      rewardIds: createEventDto.rewardIds,
    });

    return createdEvent.save();
  }

  async findAll(): Promise<EventDocument[]> {
    console.log('모든 이벤트 조회 Service 실행');
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<EventDocument> {
    console.log(`ID로 이벤트 조회 Service 실행: ${id}`);
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  // update 메서드
  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventDocument> {
    console.log(`ID로 이벤트 업데이트 Service 실행: ${id}`, updateEventDto);
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return updatedEvent;
  }

  // remove 메서드 수정 - NotFoundException 사용
  async remove(id: string): Promise<EventDocument> { // ✅ 반환 타입을 EventDocument로 변경
    console.log(`ID로 이벤트 삭제 Service 실행: ${id}`);
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return deletedEvent;
  }
}
