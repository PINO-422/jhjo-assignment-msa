import { Module, forwardRef } from '@nestjs/common'; // forwardRef import 추가
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // AuthModule 가져오기

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // AuthModule을 forwardRef로 감싸줍니다.
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있도록 export 합니다.
})
export class UserModule {}
