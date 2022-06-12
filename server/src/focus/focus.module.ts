import { Module } from "@nestjs/common";
import { FocusGateway } from "./focus.gateway";

@Module({
	providers: [FocusGateway]
})
export class FocusModule {}
