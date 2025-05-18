import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection, ConnectionStates } from 'mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('MongoDB에 성공적으로 연결되었습니다.');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB 연결 중 오류가 발생했습니다:', error);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB 연결이 끊어졌습니다.');
    });

    // 초기 연결 상태 확인 (선택 사항, 'connected' 이벤트로 충분할 수 있음)
    if (this.connection.readyState === ConnectionStates.connected) {
      this.logger.log('MongoDB 초기 연결 상태: 연결됨');
    } else if (this.connection.readyState === ConnectionStates.disconnected) {
      this.logger.warn('MongoDB 초기 연결 상태: 연결 끊김');
    }
  }
}
