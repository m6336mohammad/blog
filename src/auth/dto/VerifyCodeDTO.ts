
import { IsNotEmpty, IsOptional, Matches } from "class-validator";

export default class VerifyCodeDTOWithToken {
  @IsNotEmpty({ message: 'شماره موبایل نباید خالی باشد' })
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
  readonly phoneNumber: string;


  @IsNotEmpty({ message: 'کد نباید خالی باشد' })
  verifyCode: string;
}

