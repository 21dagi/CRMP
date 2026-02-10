import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Login endpoint
     * POST /auth/login
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(ValidationPipe) loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        return this.authService.login(user);
    }

    /**
     * Registration endpoint
     * POST /auth/register
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body(ValidationPipe) registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
