/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/RegisterDTO";
import { LoginResult } from "./types";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AuthGuard("local"))
	@Post("/login")
	async login(@Req() req): Promise<LoginResult> {
		return this.authService.login(req.user);
	}

	@Post("/register")
	async register(@Body() data: RegisterDTO): Promise<LoginResult> {
		return this.authService.register(data);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("profile")
	getProfile(@Req() req) {
		return req.user;
	}

	@Get("google")
	@UseGuards(AuthGuard("google"))
	async googleAuth() {}

	@Get("google/callback")
	@UseGuards(AuthGuard("google"))
	googleAuthCallback(@Req() req) {
		return req.user;
	}

	@Get("github")
	@UseGuards(AuthGuard("github"))
	async githubAuth() {}

	@Get("github/callback")
	@UseGuards(AuthGuard("github"))
	githubAuthCallback(@Req() req) {
		return req.user;
	}
}
