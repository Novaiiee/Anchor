import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { Profile as GithubProfile } from "passport-github2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { UserEntity } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { RegisterDTO } from "./dto/RegisterDTO";
import { LoginResult } from "./types";

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

	async validateUser(identifier: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByIdentifier(identifier);
		if (!user) throw new UnauthorizedException("User not found");

		if (user.provider !== "email") {
			throw new BadRequestException(`OAuth Provider is ${user.provider}, not email`);
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Password is Invalid");
		}

		return user;
	}

	generateToken(id: string, username: string) {
		return this.jwtService.sign({ id, username });
	}

	async login(user: UserEntity): Promise<LoginResult> {
		const token = this.generateToken(user.id, user.username);
		const { createdAt, email, id, provider, updatedAt, username, resetToken } = user;

		return {
			token,
			user: {
				createdAt,
				email,
				id,
				provider,
				updatedAt,
				username,
				resetToken
			}
		};
	}

	async register(data: RegisterDTO) {
		const finder = await this.findByIdentifier(data.email, data.username);

		if (finder.exists) {
			throw new UnauthorizedException("User already exists");
		}

		const newUser = await this.usersService.create({
			email: data.email,
			username: data.username,
			password: await hash(data.password, 12),
			provider: "email"
		});

		return this.login(newUser);
	}

	async registerWithOAuth(user: Partial<UserEntity>) {
		const newUser = await this.usersService.create(user);
		return this.login(newUser);
	}

	async findByIdentifier(email: string, username: string) {
		let doesUserExist = await this.usersService.findByIdentifier(email);

		if (doesUserExist)
			return {
				user: doesUserExist,
				exists: true
			};

		doesUserExist = await this.usersService.findByIdentifier(username);

		if (doesUserExist)
			return {
				user: doesUserExist,
				exists: true
			};

		return {
			exists: false,
			user: null
		};
	}

	async loginWithOAuth(profile: GithubProfile | GoogleProfile, resetToken: string): Promise<LoginResult> {
		const profileUser = this.extractUserFromProfile(profile, resetToken);
		const { user, exists } = await this.findByIdentifier(profileUser.email, profileUser.username);

		if (!exists) {
			return this.registerWithOAuth(profileUser);
		}

		if (user.provider !== profileUser.provider) {
			throw new UnauthorizedException("User created with different provider");
		}

		const token = this.generateToken(user.id, user.username);

		return {
			user,
			token
		};
	}

	extractUserFromProfile(profile: GithubProfile | GoogleProfile, resetToken: string): Partial<UserEntity> {
		if (!this.instanceOfGoogle(profile)) {
			return {
				email: profile.emails[0].value,
				username: profile.username,
				provider: "github",
				password: null,
				resetToken
			};
		} else if (this.instanceOfGoogle(profile)) {
			return {
				email: profile.emails[0].value,
				username: `${profile.name.givenName} ${profile.name.familyName}`,
				provider: "google",
				password: null,
				resetToken
			};
		}
	}

	instanceOfGoogle(object: any): object is GoogleProfile {
		return "name" in object;
	}
}
