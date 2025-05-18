import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // DTO�� ���ǵ��� ���� �Ӽ��� ����
      forbidNonWhitelisted: true, // DTO�� ���ǵ��� ���� �Ӽ��� ������ ��û �ź�
      transform: true, // ��û �����͸� DTO Ÿ������ �ڵ� ��ȯ (��: string -> number)
    }),
  );

  await app.listen(process.env.PORT || 3000); // ȯ�� ���� PORT �Ǵ� �⺻�� 3000 ���
}
bootstrap();
