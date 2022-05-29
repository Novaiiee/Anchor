import { UserEntity } from "../users/entities/user.entity";

export interface LoginResult {
	user: Omit<UserEntity, "password">;
	token: string;
}
