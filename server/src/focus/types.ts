export interface Session {
	userId: string;
	currentTime: number;
	cycles: number;
	cycleDuration: number;
	currentCycle: number;
	breakDuration: number;
	socketUserIds: string[];
	hasTimerStarted: boolean;
	isOnBreak: boolean;
	isPaused: boolean;
	interval: NodeJS.Timeout;
}

export interface StartTimerBody {
	userId: string;
	cycles: number;
	breakMinutes: number;
	breakHours: number;
	cycleMinutes: number;
	cycleHours: number;
}
