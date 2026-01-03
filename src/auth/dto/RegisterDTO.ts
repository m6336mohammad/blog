import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDTO {

  @IsNotEmpty({ message: 'شماره موبایل نباید خالی باشد' })
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
  readonly phoneNumber: string;

  @IsNotEmpty({ message: 'رمز عبور نمی تواند خالی باشد' })
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  password: string;

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string
}