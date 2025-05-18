import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 거부
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환 (예: string -> number)
    }),
  );

  await app.listen(process.env.PORT || 3000); // 환경 변수 PORT 또는 기본값 3000 사용
}
bootstrap();
