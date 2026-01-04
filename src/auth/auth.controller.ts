import { BadRequestException, Body, Controller, Get, Post, UseGuards,Request  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/RegisterDTO';
import { LoginDTO } from './dto/LoginDTO';
import VerifyCodeDTO from './dto/VerifyCodeDTO';
import { ChangePasswordDTO } from './dto/ChangePasswordDTO';
import ForgotPasswordDTO from './dto/ForgotPasswordDTO';

@Controller('auth')
export class AuthController {
constructor(
 private readonly authService: AuthService
){}

  /////register/////
  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  /////login/////
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }


    /////requestResetPassword/////
  @Post('requestResetPassword')
  async requestResetPasswordWithToken(@Body() dto: ForgotPasswordDTO) {
    const code = await this.authService.requestResetPasswordWithToken(dto);
 
    return { message: 'کد تأیید ارسال شد' };
  }


  /////verifyCode/////
  @Post('verifyCode')
  async verifyCodeWithToken(@Body() data: VerifyCodeDTO,) {
    const access_token = this.authService.verifyCodeWithToken(data);

    if (!access_token) {
      throw new BadRequestException('کد نامعتبر یا منقضی شده است');
    }

    return { access_token };
  }

  /////changePassword/////
//   @UseGuards(ResetPasswordGuard)
  @Post('changePassword')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO, @Request() req: Request) {
    const payload = req['resetPayload'];
    changePasswordDTO.phoneNumber = payload.phoneNumber;

    if (changePasswordDTO.newPassword !== changePasswordDTO.confirmPassword) {
      throw new BadRequestException('رمز عبور و تکرار آن برابر نیستند');
    }

    // const result = await this.authService.changePassword(changePasswordDTO);
    return { message: 'تغییر رمز عبور با موفقیت انجام شد' };
  }

}
