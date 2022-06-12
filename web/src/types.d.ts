interface User {
	username: string;
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