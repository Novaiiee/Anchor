import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Session, StartTimerBody } from "./types";

@WebSocketGateway({
	cors: {
		origin: "*"
	}
})
export class FocusGateway {
	@WebSocketServer()
	server: Server;

	private sessions: Session[] = [];

	@SubscribeMessage("join-room")
	handleOnJoin(@MessageBody() userId: string, @ConnectedSocket() socket: Socket) {
		const session = this.findOrCreateSession(userId, socket.id);

		socket.join(session.userId);
		this.server.to(userId).emit("join-room", this.parseSessionForSocket(session));
	}

	@SubscribeMessage("start-timer")
	handleStartTimer(@MessageBody() data: StartTimerBody, @ConnectedSocket() socket: Socket) {
		this.startSessionTimer(data, socket.id);
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
		session.isOnBreak = false;

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

		session.interval = this.createInterval(session.userId);
		session.isPaused = false;

		this.server.to(userId).emit("unpause-timer");
	}

	createInterval(userId: string) {
		const session = this.sessions.find((x) => x.userId === userId);

		if (!session) {
			console.log("Not found", userId);
			return null;
		}

		if (session.interval) {
			console.log("Session interval exists already", session.userId);
			return session.interval;
		}

		return setInterval(async () => {
			const s = this.sessions.find((x) => x.userId === userId);
			console.log(session.userId, session.interval === null);
			if (!s.hasTimerStarted) {
				s.currentTime = s.isOnBreak ? s.breakDuration : s.cycleDuration;
				s.hasTimerStarted = true;
				s.isPaused = false;
			}

			s.currentTime -= 1000;
			// console.log(s.userId, s.socketUserIds);

			//Timer ended but not completed
			if (s.currentTime < 0) {
				if (s.currentCycle >= s.cycles) {
					console.log("Stopping the timer completely");
					return this.handleStopTimer(userId);
				}

				if (s.isOnBreak) {
					s.currentTime = s.cycleDuration;
					s.currentCycle++;
					s.isOnBreak = false;
				} else {
					s.currentTime = s.breakDuration;
					s.isOnBreak = true;
				}
			}

			this.updateSessions(s);
			this.server.to(s.userId).emit("on-timer", this.parseSessionForSocket(s));

			return () => {
				clearInterval(s.interval);
				this.handleStopTimer(s.userId);
			};
		}, 1000);
	}

	// cycles = 4, cycleDuration = 1200, breakDuration = 300
	findOrCreateSession(userId: string, socketId: string) {
		let session = this.sessions.find((x) => x.userId === userId);

		if (!session) {
			session = {
				currentTime: 0,
				userId,
				cycleDuration: 0,
				cycles: 0,
				currentCycle: 0,
				breakDuration: 0,
				socketUserIds: [socketId],
				hasTimerStarted: false,
				isOnBreak: false,
				isPaused: false,
				interval: null
			};
		} else {
			session.socketUserIds = [...new Set([...session.socketUserIds, socketId])];
		}

		this.updateSessions(session);
		return session;
	}

	startSessionTimer(data: StartTimerBody, socketId: string) {
		const { breakHours, breakMinutes, cycleHours, cycleMinutes, cycles, userId } = data;
		const session = this.findOrCreateSession(userId, socketId);

		const cycleDuration = 1000 * (cycleHours * 60 * 60 + cycleMinutes * 60);
		const breakDuration = 1000 * (breakHours * 60 * 60 + breakMinutes * 60);

		if (session.interval === null) {
			const updatedSession: Session = {
				...session,
				cycles,
				cycleDuration,
				breakDuration,
				currentCycle: 1
			};

			this.updateSessions(updatedSession);

			if (!updatedSession.hasTimerStarted) {
				updatedSession.interval = this.createInterval(updatedSession.userId);
				console.log("Timer has not started for", updatedSession.userId);
			} else {
				console.log("Timer has started for", updatedSession.userId);
			}

			return updatedSession;
		}

		return session;
	}

	updateSessions(session: Session) {
		if (this.sessions.length === 0) {
			this.sessions.push(session);
			return;
		}

		const found = this.sessions.find((x) => x.userId === session.userId);

		if (!found) {
			this.sessions.push(session);
			return;
		}

		this.sessions.forEach((x, i) => {
			if (this.sessions[i].userId === session.userId) {
				this.sessions[i] = session;
				return;
			}
		});
	}

	parseSessionForSocket(session: Session) {
		return {
			...session,
			interval: null
		};
	}
}
