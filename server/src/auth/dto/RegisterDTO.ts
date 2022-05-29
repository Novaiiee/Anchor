import { IsEmail, MinLength } from "class-validator";

export class RegisterDTO {
	@MinLength(4)
	username: string;

	@MinLength(6)
	password: string;

	@IsEmail()
	email: string;
}
