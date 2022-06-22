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
				socketId: socket.id,
				room: session.userId
			}
		};
	}

	@SubscribeMessage("start-timer")
	handleStartTimer(@MessageBody() { userId, startTime }: StartTimerBody, @ConnectedSocket() socket: Socket) {
		const session = this.findOrCreateSession(userId, socket.id, startTime ?? 60);

		if (session.interval === null) {
			session.interval = this.createInterval(userId, startTime);
		}

		socket.to(userId).emit("on-timer", {
			time: startTime,
			userId,
			hasStartedTimer: true
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

		return {
			event: "on-timer",
			data: {
				time: 0
			}
		};
	}

	@SubscribeMessage("pause-timer")
	handlePauseTimer(@MessageBody() userId: string) {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		clearInterval(session.interval);
		session.interval = null;
	}

	@SubscribeMessage("unpause-timer")
	handleUnPauseTimer(@MessageBody() userId: string) {
		const session = this.sessions.find((x) => x.userId === userId);
		if (!session) return;

		session.interval = this.createInterval(session.userId, session.time);
	}

	createInterval(userId: string, startTime: number) {
		return setInterval(async () => {
			const s = this.sessions.find((x) => x.userId === userId);

			if (!s.hasTimerStarted) {
				s.time = startTime;
				s.hasTimerStarted = true;
			}

			s.time--;

			if (s.time <= 0) {
				const interval = s.interval;

				s.time === 0;
				s.interval = null;
				s.hasTimerStarted = false;
				clearInterval(interval);
			}

			this.sessions = this.sessions.map((x) => {
				if (x.userId === s.userId) return s;
				return x;
			});

			this.server.to(s.userId).emit("on-timer", {
				time: s.time,
				userId: s.userId,
				hasStartedTimer: s.hasTimerStarted
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
				hasTimerStarted: false
			};

			this.sessions.push(session);
		}

		return session;
	}
}
