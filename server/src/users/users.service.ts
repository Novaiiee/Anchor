import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

export class UsersService {
	constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

	async findOne(id: string) {
		return this.usersRepository.findOne(id);
	}
}
