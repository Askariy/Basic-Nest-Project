import {Controller, Post, Body} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth-dto";

@Controller()
export class AuthController{
    constructor(private authService:AuthService){}

    // POST /register
    @Post('register')
    register(@Body() authDto:AuthDto){
        return this.authService.register(authDto);
    }
        
    @Post('login')
    login(@Body() authDto:AuthDto){
        return this.authService.login(authDto);
    }
}