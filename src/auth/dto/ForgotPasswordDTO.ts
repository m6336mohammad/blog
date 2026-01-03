import {  IsEmail, IsNotEmpty, Matches, } from "class-validator";

export default class ForgotPasswordDTO {
  @IsNotEmpty({ message: 'شماره موبایل نباید خالی باشد' })
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
  phoneNumber: string;

  // @IsNotEmpty({ message: ' ایمیل نباید خالی باشد' })
  // @IsEmail({ message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
  // email: string;
  
}
