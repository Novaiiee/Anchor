import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
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

	async login(user: UserEntity): Promise<LoginResult> {
		const token = await this.jwtService.sign({ id: user.id, username: user.username });
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
		let doesUserExist = await this.usersService.findByIdentifier(data.email);

		if (doesUserExist) {
			throw new BadRequestException("User already exists with that email");
		}

		doesUserExist = await this.usersService.findByIdentifier(data.username);

		if (doesUserExist) {
			throw new BadRequestException("User already exists with that username");
		}

		const newUser = await this.usersService.create({
			email: data.email,
			username: data.username,
			password: await hash(data.password, 12),
			provider: "email"
		});

		return this.login(newUser);
	}
}
