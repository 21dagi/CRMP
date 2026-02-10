import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DB_CONNECTION = 'DB_CONNECTION';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: DB_CONNECTION,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const connectionString = configService.get<string>('DATABASE_URL');
                const pool = new Pool({
                    connectionString,
                });
                return drizzle(pool, { schema });
            },
        },
    ],
    exports: [DB_CONNECTION],
})
export class DrizzleModule { }
