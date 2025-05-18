import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    console.log('이벤트 생성 Controller 실행', createEventDto);
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    console.log('모든 이벤트 조회 Controller 실행');
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`ID로 이벤트 조회 Controller 실행: ${id}`);
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    console.log(`ID로 이벤트 업데이트 Controller 실행: ${id}`, updateEventDto);
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`ID로 이벤트 삭제 Controller 실행: ${id}`);
    return this.eventService.remove(id);
  }
}
