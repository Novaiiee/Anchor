import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

	async findOne(id: string) {
		return this.usersRepository.findOne(id);
	}

	async findByIdentifier(identifier: string) {
		let user = await this.usersRepository.findOne({ where: { email: identifier } });
		if (user) return user;

		user = await this.usersRepository.findOne({ where: { username: identifier } });
		return user;
	}

	async create(user: Omit<Partial<UserEntity>, "createdAt" | "updatedAt">) {
		const newUser = this.usersRepository.create({ ...user });
		this.usersRepository.save(newUser);

		return newUser;
	}
}
