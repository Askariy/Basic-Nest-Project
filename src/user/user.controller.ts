import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller()
export class UserController {
    @Get('user')
    getUser(@GetUser() user: User): {id:number, email:string}{
        return {
            id: user.id,
            email: user.email,
        };
    }
}
