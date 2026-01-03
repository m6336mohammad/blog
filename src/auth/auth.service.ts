import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/LoginDTO';
import { RegisterDTO } from './dto/RegisterDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /////REGISTER/////
  async register(registerDto: RegisterDTO) {
    const existingUser = await this.userService.findUserByPhoneNumberForRegister(
        registerDto.phoneNumber,
      );
    if (existingUser) {
      throw new BadRequestException('کاربر قبلاً ثبت شده است');
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.createUser(registerDto);

    return {
      message: 'ثبت‌ نام با موفقیت انجام شد',
      userId: user.id,
      phonNumber: user.phoneNumber,
    };
  }

  /////LOGIN/////
  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findUserByPhoneNumberForLogin(
      loginDTO.phoneNumber,
    );

    if (!user) {
      throw new BadRequestException('کاربر مورد نظر پیدا نشد');
    }

    const isMatch = await bcrypt.compare(loginDTO.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('رمز عبور اشتباه است');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      phoneNumber: user.phoneNumber,
    });
    return {
      access_token: accessToken,
      message: 'ورود موفقیت‌آمیز بود',
      role: user.role,
      userId: user.id,
    };
  }



     verifyCodeWithToken() {
    return { message: 'verifyCodeWithToken' };
  }
  
     requestResetPasswordWithToken() {
    return { message: 'requestResetPasswordWithToken' };
  }


}
