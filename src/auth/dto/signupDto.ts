import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
    @IsNotEmpty()
    readonly username: string;
    @IsNotEmpty()
    readonly password: string;
}
