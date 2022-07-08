import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	getHello(): string {
		return `
			<div>
				<h1>Hello Welcome to the Anchor Server!</h1>
				<h1>You are not supposed to be here</h1>
				<h1>So leave.</h1>
			</div>
		`;
	}
}
