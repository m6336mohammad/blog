import { IsString, MinLength, ValidateIf, Matches, IsNotEmpty } from 'class-validator';

export class ChangePasswordDTO {

  @IsNotEmpty({ message: 'شماره موبایل نباید خالی باشد' })
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
   phoneNumber: string;


  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  newPassword: string;

  @IsString({ message: 'تکرار رمز عبور الزامی است' })
  confirmPassword: string;
}
