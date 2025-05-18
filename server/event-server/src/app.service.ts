import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello event-server! 이벤트 서버 접속';
  }
}
