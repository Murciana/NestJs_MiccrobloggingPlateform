import { PrismaService } from './../prisma/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signinDto';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup(signupDto: SignupDto) {
        const { email, username, password } = signupDto;
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (user) throw new ConflictException('User already exists');
        // hasher le password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Enregister user dans la BDD
        await this.prismaService.user.create({
            data: { email, username, password: hashedPassword },
        });
        return { data: 'User succesfully created' };
    }

    async signin(signinDto: SigninDto) {
        const { email, password } = signinDto;
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (!user) throw new NotFoundException('User not found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('unauthorized');
        return { data: 'User succesfully connected' };
    }
}
