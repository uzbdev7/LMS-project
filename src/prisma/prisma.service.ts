import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        // 1. DATABASE_URL mavjudligini va string ekanini kafolatlaymiz
        const connectionString = String(process.env.DATABASE_URL);

        // 2. Pool obyektini yaratishda xatolikning oldini olish uchun
        const pool = new Pool({ 
            connectionString,
            // Ba'zida pg kutubxonasi parolni alohida so'raydi
            password: connectionString.split(':')[2]?.split('@')[0] 
        });

        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: ["error", "warn"]
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log("✅ Prisma connected successfully");
        } catch (error) {
            this.logger.error("❌ Prisma connection failed", error);
            process.exit(1);
        }
    }
}