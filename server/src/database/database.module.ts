import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				url: config.get("DATABASE_URL"),
				synchronize: true,
				autoLoadEntities: true
			}),
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	exports: [TypeOrmModule]
})
export class DatabaseModule {}
