interface User {
	id: string;
	username: string;
	email: string;
	provider: "email" | "google" | "github";
	createdAt: Date;
	updatedAt: Date;
}

interface LoginFormSubmit {
	name?: string;
	identifier?: string;
	password: string;
}

interface AuthFormResult {
	user: User;
	token: string;
}

interface AuthError {
	type: "Email" | "Password" | "Username",
	message: string;
}