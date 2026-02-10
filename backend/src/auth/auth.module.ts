import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET is not defined in environment variables');
                }
                return {
                    secret,
                    signOptions: {
                        expiresIn: '7d',
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
