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