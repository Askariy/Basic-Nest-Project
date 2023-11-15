import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth-dto";
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    async register(authDto: AuthDto) {
        try {
            const hash = await argon.hash(authDto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: authDto.email,
                    hash,
                }
            })
            return this.signToken(user.id, user.email);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {//duplicate error code
                    throw new ForbiddenException("Email in use already");
                }
            }
            throw e;
        }
    }

    async login(authDto: AuthDto) {

        const user = await this.prismaService.user.findFirst({
            where: {
                email: authDto.email,
            }
        })

        if (!user) {
            throw new ForbiddenException(
                'Incorrect Credentials',
            )
        }

        const PassVerify = await argon.verify(user.hash, authDto.password);
        if (!PassVerify) {
            throw new ForbiddenException(
                'Incorrect Credentials',
            )
        }

        const token = await this.signToken(user.id, user.email);
        return {userId: user.id, email:user.email, token:token.access_token};
        // return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token:string}> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.configService.get('JWT_SECRET');

        const token= await this.jwtService.signAsync(payload, {
            expiresIn: '30m',
            secret: secret,
        });

        return {
            access_token: token,
        }
    }

}