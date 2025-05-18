import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello auth-server!아저ㅋㅋ안바뀌네ㅇㅇㅌㅌㅌㄷㅁ바뀐건가?ㅋㅋ';
  }
}
