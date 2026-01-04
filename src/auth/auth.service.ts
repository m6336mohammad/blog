import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/LoginDTO';
import { RegisterDTO } from './dto/RegisterDTO';
import * as bcrypt from 'bcrypt';
import VerifyCodeDTO from './dto/VerifyCodeDTO';
import { ChangePasswordDTO } from './dto/ChangePasswordDTO';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import ForgotPasswordDTO from './dto/ForgotPasswordDTO';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

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


  /////forget password request/////
  async requestResetPasswordWithToken(forgotPasswordDTO: ForgotPasswordDTO) {
    const user =
      await this.userService.requestResetPasswordWithTokenOtp(
        forgotPasswordDTO,
      );
    return user;
  }

  /////verifyCode/////
  async verifyCodeWithToken(verifyCodeDTO: VerifyCodeDTO) {
    const resalt = await this.userService.verifyCodeWithToken(verifyCodeDTO);

    if (resalt === null) {
      throw new BadRequestException(' کد یک بار استفاده شده یا منقضی شده');
    }

    const access_token = this.jwtService.sign(
      { phoneNumber: verifyCodeDTO.phoneNumber },
      {
        expiresIn: '3m', // فقط برای تغییر رمز اعتبار دارد
        secret: process.env.JWT_RESET_SECRET, //افزایش امنیت
      },
    );
    return access_token;
  }


  /////changePassword/////
  async changePassword(changePasswordDTO: ChangePasswordDTO): Promise<boolean> {
    const resalt = await this.userService.changePassword(changePasswordDTO);

    if (resalt === null) {
      throw new BadRequestException('عملیات تغییر رمز ناموفق بود');
    }

    return resalt;
  }


}
