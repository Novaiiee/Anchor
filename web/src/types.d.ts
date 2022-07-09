interface User {
	id: string;
	username: string;
	email: string;
	accounts: Account[];
	createdAt: Date;
	updatedAt: Date;
}

interface Account {
	id: string;
	email: string;
	provider: Provider;
	user: User;
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
	type: "Email" | "Password" | "Username";
	message: string;
}

interface Session {
	currentTime: number;
	cycles: number;
	cycleDuration: number;
	currentCycle: number;
	breakDuration: number;
	hasTimerStarted: boolean;
	isOnBreak: boolean;
	isPaused: boolean;
	socketUserIds?: Set<string>;
}

interface CreateSessionValues {
	cycles: number;
	cycleMinutes: number;
	cycleHours: number;
	breakMinutes: number;
	breakHours: number;
}

type Provider = "github" | "google" | "local";

interface ServerError {
	body: {
		messages: string[]
	},
	timestamp: string,
	path: string,
	statusCode: number
}