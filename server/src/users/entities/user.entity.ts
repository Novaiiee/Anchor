import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user" })
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	@Exclude()
	password?: string;

	@Column()
	provider: "email" | "google" | "github";

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
