import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
// User 엔티티/스키마 import!
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'; // bcrypt import 방식 변경
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const {
      email, // email 추가
      userId,
      name,
      password, // 평문 비밀번호
      address,
      birthDate,
      gender,
      eventPreferences,
      notificationSettings,
      profileImageUrl,
      points,
    } = createUserDto;

    // 비밀번호 해싱
    const saltRounds = 10; // 해싱 강도, 숫자가 클수록 보안은 강해지나 속도는 느려짐
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userToCreate = new this.userModel({
      email,
      userId,
      name,
      passwordHash: hashedPassword, // 해시된 비밀번호를 저장
      address,
      birthDate,
      gender,
      eventPreferences,
      notificationSettings,
      profileImageUrl,
      points,
      // role, coupons 등은 User 엔티티의 기본값 또는 다른 로직으로 처리
    });
    return userToCreate.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return deletedUser;
  }

  // 이메일로 사용자 찾기 메서드 추가
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec(); // email 필드로 찾기!
  }
  // 사용자 ID (닉네임)로 사용자 찾기 메서드 추가
  async findOneByUserId(userId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userId }).exec(); // userId 필드로 찾기!
  }
}
