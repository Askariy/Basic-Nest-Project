import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(configService:ConfigService){
        super({
            datasources:{
                db:{
                    // url: 'postgresql://postgres:admin@localhost:5432/tempDb?schema=public'
                    url: configService.get('DATABASE_URL'),
                },
            }
        })
    }
}
