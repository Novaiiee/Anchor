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
	socketUserIds: string[];
	userId: string;
	time: number;
	hasTimerStarted: boolean;
	isPaused: boolean;
	interval: NodeJS.Timeout;
}

interface StartTimerBody {
	userId: string;
	startTime: number;
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
	handleOnJoin(@MessageBody() userId: string, @ConnectedSocket() socket: Socket): WsResponse<unknown> {
		const session = this.findOrCreateSession(userId, socket.id);

		socket.join(session.userId);
		session.socketUserIds.push(socket.id);

		this.sessions = this.sessions.map((x) => {
			if (x.userId === session.userId) return session;
			return x;
		});

		return {
			event: "join-room",
			data: {
				isPaused: session.isPaused,
				hasTimerStarted: session.hasTimerStarted,
				time: session.time
			}
		};
	}

	@SubscribeMessage("start-timer")
	handleStartTimer(@MessageBody() { userId, startTime }: StartTimerBody, @ConnectedSocket() socket: Socket) {
		const session = this.findOrCreateSession(userId, socket.id, startTime ?? 60);

		if (session.interval === null) {
			session.interval = this.createInterval(userId, startTime);
		}

		this.server.to(userId).emit("on-timer", {
			time: startTime,
			userId,
			hasTimerStarted: true
		});
	}

	@SubscribeMessage("stop-timer")
	handleStopTimer(@MessageBody() userId: string): WsResponse<unknown> {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		clearInterval(session.interval);

		session.hasTimerStarted = false;
		session.time = 0;
		session.interval = null;
		session.isPaused = false;

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

		session.interval = this.createInterval(session.userId, session.time);
		session.isPaused = false;

		this.server.to(userId).emit("unpause-timer");
	}

	createInterval(userId: string, startTime: number) {
		return setInterval(async () => {
			const s = this.sessions.find((x) => x.userId === userId);

			if (!s.hasTimerStarted) {
				s.time = startTime;
				s.hasTimerStarted = true;
				s.isPaused = false;
			}

			s.time--;

			if (s.time <= 0) {
				const interval = s.interval;

				s.time === 0;
				s.interval = null;
				s.hasTimerStarted = false;
				s.isPaused = false;

				clearInterval(interval);
			}

			this.sessions = this.sessions.map((x) => {
				if (x.userId === s.userId) return s;
				return x;
			});

			this.server.to(s.userId).emit("on-timer", {
				time: s.time,
				userId: s.userId,
				hasTimerStarted: s.hasTimerStarted,
				isPaused: s.isPaused
			});

			return () => {
				clearInterval(sessionStorage.interval);
				s.hasTimerStarted = false;
			};
		}, 1000);
	}

	findOrCreateSession(userId: string, socketId: string, time = 60) {
		let session = this.sessions.find((x) => x.userId === userId);

		if (!session) {
			session = {
				socketUserIds: [socketId],
				time,
				userId,
				interval: null,
				hasTimerStarted: false,
				isPaused: false
			};

			this.sessions.push(session);
		}

		return session;
	}
}
