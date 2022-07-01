import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface Session {
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

interface StartTimerBody {
	userId: string;
	cycles: number;
	breakDuration: number;
	cycleDuration: number;
}

@WebSocketGateway({
	cors: {
		origin: "*"
	}
})
export class FocusGateway {
	private sessions: Session[] = [];

	@WebSocketServer()
	server: Server;

	@SubscribeMessage("join-room")
	handleOnJoin(
		@MessageBody() { userId, breakDuration, cycleDuration, cycles }: StartTimerBody,
		@ConnectedSocket() socket: Socket
	) {
		const session = this.findOrCreateSession(userId, socket.id, cycles, cycleDuration, breakDuration);

		socket.join(session.userId);
		session.socketUserIds.push(socket.id);

		this.sessions = this.sessions.map((x) => {
			if (x.userId === session.userId) return session;
			return x;
		});

		this.server.to(userId).emit("join-room", session);
	}

	@SubscribeMessage("start-timer")
	handleStartTimer(
		@MessageBody() { userId, breakDuration, cycleDuration, cycles }: StartTimerBody,
		@ConnectedSocket() socket: Socket
	) {
		const session = this.findOrCreateSession(userId, socket.id, cycles, cycleDuration, breakDuration);

		if (session.interval === null) {
			session.interval = this.createInterval(userId, session.cycleDuration);
		}

		this.sessions = this.sessions.map((x) => {
			if (x.userId === session.userId) return session;
			return x;
		});

		this.server.to(userId).emit("on-timer", session);
	}

	@SubscribeMessage("stop-timer")
	handleStopTimer(@MessageBody() userId: string): WsResponse<unknown> {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		clearInterval(session.interval);

		session.hasTimerStarted = false;
		session.currentTime = 0;
		session.interval = null;
		session.isPaused = false;
		session.cycleDuration = 0;
		session.breakDuration = 0;
		session.currentCycle = 1;
		session.cycles = 0;

		this.server.to(userId).emit("stop-timer");
	}

	@SubscribeMessage("pause-timer")
	handlePauseTimer(@MessageBody() userId: string): WsResponse<unknown> {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		clearInterval(session.interval);

		session.interval = null;
		session.isPaused = true;

		this.server.to(userId).emit("pause-timer");
	}

	@SubscribeMessage("unpause-timer")
	handleUnPauseTimer(@MessageBody() userId: string): WsResponse<unknown> {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		session.interval = this.createInterval(session.userId, session.currentTime);
		session.isPaused = false;

		this.server.to(userId).emit("unpause-timer");
	}

	createInterval(userId: string, startTime: number) {
		return setInterval(async () => {
			const s = this.sessions.find((x) => x.userId === userId);

			if (!s.hasTimerStarted) {
				s.currentTime = startTime;
				s.hasTimerStarted = true;
				s.isPaused = false;
			}

			s.currentTime--;

			if (s.currentTime <= 0) {
				const interval = s.interval;

				s.currentTime === 0;
				s.interval = null;
				s.hasTimerStarted = false;
				s.isPaused = false;

				clearInterval(interval);

				if (s.isOnBreak && s.currentCycle < s.cycles) {
					s.currentTime = s.breakDuration;
					s.interval = this.createInterval(userId, s.breakDuration);
					s.isOnBreak = false;
				} else if (!s.isOnBreak && s.currentCycle < s.cycles) {
					s.currentTime = s.cycleDuration;
					s.currentCycle++;
					s.interval = this.createInterval(userId, s.cycleDuration);
					s.isOnBreak = true;
				} else {
					this.handleStopTimer(userId);
				}
			}

			this.sessions = this.sessions.map((x) => {
				if (x.userId === s.userId) return s;
				return x;
			});

			this.server.to(s.userId).emit("on-timer", s);

			return () => {
				clearInterval(sessionStorage.interval);
				s.hasTimerStarted = false;
			};
		}, 1000);
	}

	findOrCreateSession(userId: string, socketId: string, cycles = 4, cycleDuration = 1200, breakDuration = 300) {
		let session = this.sessions.find((x) => x.userId === userId);

		if (!session) {
			session = {
				currentTime: cycleDuration,
				userId,
				cycleDuration,
				cycles,
				currentCycle: 1,
				breakDuration,
				socketUserIds: [socketId],
				hasTimerStarted: false,
				isOnBreak: false,
				isPaused: false,
				interval: null
			};

			this.sessions.push(session);
		}

		return session;
	}
}
