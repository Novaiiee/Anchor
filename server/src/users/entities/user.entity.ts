import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	password?: string;

	@Column({ nullable: true })
	resetToken?: string;

	@Column()
	provider: "email" | "google" | "github";

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
