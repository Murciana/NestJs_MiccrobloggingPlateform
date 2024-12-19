import {
    Get,
    Controller,
    Render,
    Post,
    Body,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/signinDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Get('register')
    @Render('registerForm')
    getRegisterForm() {
        return { message: 'Créer un nouveau compte' };
    }
    @Get('login')
    @Render('loginForm')
    getLoginForm() {
        return { message: 'Se connecter à un compte' };
    }
    @Get('success')
    @Render('success')
    getSuccessPage() {
        return { message: 'Success' };
    }
    @Get('error')
    @Render('error')
    getErrorPage() {
        return { message: 'Erreur' };
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto, @Res() res) {
        try {
            await this.authService.signup(signupDto);
            res.status(HttpStatus.FOUND).redirect('success');
        } catch (error) {
            res.status(HttpStatus.FOUND).redirect('error');
        }
    }

    @Post('signin')
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }
}
