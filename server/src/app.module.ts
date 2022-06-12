import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { FocusModule } from "./focus/focus.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [ConfigModule.forRoot(), UsersModule, DatabaseModule, AuthModule, FocusModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
