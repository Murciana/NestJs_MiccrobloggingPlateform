import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/signinDto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                PrismaService,
                ConfigService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create new user when email is not already used', async () => {
        const signupDto: SignupDto = {
            email: 'test@example.com',
            password: 'StrongPass123!',
            username: 'Test User',
        };
        const hashedPassword = 'hashedPassword456' as never;
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(hashedPassword);

        // Je simule un user inexistant
        prismaMock.user.findUnique.mockResolvedValue(null);
        await service.signup(signupDto);

        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {
                email: 'test@example.com',
                password: hashedPassword,
                username: 'Test User',
            },
        });
    });

    it('should throw Conflict when user already exists', async () => {
        const existingSignupDto: SignupDto = {
            email: 'test@example.com',
            password: 'StrongPass123!',
            username: 'Test User',
        };

        prismaMock.user.findUnique.mockReturnValue(existingSignupDto.email);

        await expect(service.signup(existingSignupDto)).rejects.toThrow(
            ConflictException,
        );
        expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('should successfully log the user with email and password', async () => {
        const signinDto: SigninDto = {
            email: 'test@example.com',
            password: 'StrongPass123!',
        };
        prismaMock.user.findUnique.mockReturnValue(signinDto.email);

        jest.spyOn(bcrypt, 'compare').mockImplementation(() =>
            Promise.resolve(true),
        );

        const result = await service.signin(signinDto);

        expect(result).toEqual({ data: 'User succesfully connected' });
    });

    it('should throw NotFoundException when user is not registered in the database', async () => {
        const existingSigninDto: SigninDto = {
            email: 'test@example.com',
            password: 'StrongPass123!',
        };

        prismaMock.user.findUnique.mockReturnValue(null);

        await expect(service.signin(existingSigninDto)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
        const signinDto: SigninDto = {
            email: 'test@example.com',
            password: 'StrongPass123!',
        };
        prismaMock.user.findUnique.mockResolvedValue(signinDto.email);
        jest.spyOn(bcrypt, 'compare').mockImplementation(() =>
            Promise.resolve(false),
        );
        await expect(service.signin(signinDto)).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
