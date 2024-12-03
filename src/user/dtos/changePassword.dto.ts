import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  readonly userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @Matches(/^(?=.*[a-zA-Z]).*$/, {
    message: 'Password must contain at least one letter',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[0-9]).*$/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/^(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/, {
    message: 'Password must contain at least one special character',
  })
  readonly newPassword: string;
}
