import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { UserEntity } from "../../users/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_REDIRECT_URL,
			scope: ["email", "profile"]
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const { name, emails, photos } = profile;

		const user: Partial<UserEntity> = {
			email: emails[0].value,
			username: `${name.givenName} ${name.lastName}`,
			// picture: photos[0].value,
			provider: "google",
			resetToken: refreshToken
		};

		return user;
	}
}
