import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
import { AuthService } from "../auth.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: process.env.GITHUB_REDIRECT_URL,
			scope: ["user:email"]
		});
	}

	async validate(_, __, profile: Profile) {
		return this.authService.loginWithOAuth(profile);
	}
}
