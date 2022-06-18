import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "socket.io";

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

	@SubscribeMessage("on-join")
	handleOnJoin(@MessageBody() userId: string, @ConnectedSocket() socket: Socket): WsResponse<unknown> {
		const session = this.findOrCreateSession(userId, socket.id);

		socket.join(session.userId);
		session.socketUserIds.push(socket.id);

		this.sessions = this.sessions.map((x) => {
			if (x.userId === session.userId) return session;
			return x;
		});

		return {
			data: {
				socketId: socket.id,
				room: session.userId
			},
			event: "on-join-success"
		};
	}

	@SubscribeMessage("start-timer")
	handleStartTimer(@MessageBody() { userId, startTime }: StartTimerBody, @ConnectedSocket() socket: Socket) {
		const session = this.findOrCreateSession(userId, socket.id, startTime ?? 60);

		if (session.interval === null) {
			session.interval = setInterval(async () => {
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

				socket.to(s.userId).emit("on-timer", {
					time: s.time,
					userId: s.userId,
					hasStartedTimer: s.hasTimerStarted
				});

				return () => {
					clearInterval(session.interval);
					s.hasTimerStarted = false;
				};
			}, 1000);
		}
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
