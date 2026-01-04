import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/users.entity';
import { UserDTO } from './dto/userDTO';
import VerifyCodeDTO from 'src/auth/dto/VerifyCodeDTO';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from 'src/auth/dto/ChangePasswordDTO';
import ForgotPasswordDTO from 'src/auth/dto/ForgotPasswordDTO';
import Users from './entity/users.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    ) { }

    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // مثل 847392
    }

    //////////
    async findAllUsrs() {
        return this.userRepository.find();
    }


    //////////
    async findUserByPhoneNumberForRegister(phoneNumber: string) {
        return await this.userRepository.findOne({
            where: { phoneNumber },
        });
    }

  //////////
  async findUserByPhoneNumberForLogin(phoneNumber: string) {
    return await this.userRepository.findOne({
      where: { phoneNumber },
      select: [
        'id',
        'phoneNumber',
        'firstName',
        'lastName',
        'password',
        'role',
      ], // صراحتاً انتخاب password
    });
  }

  //////////
  async createUser(data: UserDTO) {
    const newUser = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

    //////////
  async verifyCodeWithToken(data: VerifyCodeDTO): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: data.phoneNumber },
    });

    if (!user) {
      return null; // کاربر وجود ندارد
    }

    const now = new Date();

    const isValid =
      user.resetCode === data.verifyCode &&
      user.resetTokenExpiration &&
      user.resetTokenExpiration > now;

    if (isValid) {
      // پاک‌سازی کد پس از استفاده
      user.resetCode = null;
      user.resetTokenExpiration = null;
      user.isPasswordChanged = false;

      await this.userRepository.save(user);
      return user;
    }

    return null; // کد نادرست یا منقضی‌شده
  }

    //////////
  async changePassword(
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<boolean | null> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: changePasswordDTO.phoneNumber },
    });
    if (!user) throw new NotFoundException('کاربر مورد نظر پیدا نشد');

    // بررسی اینکه آیا قبلاً رمز تغییر کرده است
    if (user.isPasswordChanged) {
      throw new BadRequestException(
        'رمز عبور قبلاً تغییر کرده است و امکان تغییر مجدد وجود ندارد',
      );
    }

    user.password = await bcrypt.hash(changePasswordDTO.newPassword, 10);
    user.isPasswordChanged = true;
    await this.userRepository.save(user);
    return true;
  }

  //////////
  async requestResetPasswordWithTokenOtp(data: ForgotPasswordDTO) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: data.phoneNumber },
    });
    if (!user) throw new NotFoundException('کاربر پیدا نشد');
    const code = this.generateCode();

    user.resetCode = code;
    user.resetTokenExpiration = new Date(Date.now() + 1 * 60 * 1000); // 1 دقیقه

    await this.userRepository.save(user);
    return code;
  }


}
