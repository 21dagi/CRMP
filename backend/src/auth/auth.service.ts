import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../drizzle/drizzle.module';
import * as schema from '../drizzle/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DB_CONNECTION) private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Validate user credentials
     * @param email - User email
     * @param password - Plain text password
     * @returns User object without password
     */
    async validateUser(email: string, password: string) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.passwordHash) {
            throw new UnauthorizedException('Please use OAuth to login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Return user without password
        const { passwordHash, ...result } = user;
        return result;
    }

    /**
     * Generate JWT token for authenticated user
     * @param user - User object
     * @returns Access token
     */
    async login(user: any) {
        const payload = { sub: user.id, email: user.email };

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
            },
            backendTokens: {
                accessToken: this.jwtService.sign(payload),
            },
        };
    }

    /**
     * Register a new user
     * @param registerDto - Registration data
     * @returns Created user and tokens
     */
    async register(registerDto: RegisterDto) {
        const { email, password, name, image } = registerDto;

        // Check if user already exists
        const [existingUser] = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const [newUser] = await this.db
            .insert(schema.users)
            .values({
                email,
                passwordHash,
                name,
                image: image || null,
            })
            .returning();

        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = newUser;

        // Generate token
        return this.login(userWithoutPassword);
    }
}
