import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*"
	}
})
export class FocusGateway {
	@SubscribeMessage("events")
	handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): WsResponse<unknown> {
		console.log(socket.id);
		console.log(data);

		return {
			data: "",
			event: "events"
		};
	}
}
