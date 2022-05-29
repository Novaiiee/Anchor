import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				host: config.get("DB_HOST"),
				port: config.get<number>("DB_PORT"),
				username: config.get("DB_USERNAME"),
				password: config.get("DB_PASSWORD"),
				database: config.get("DB_DATABASE"),
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
