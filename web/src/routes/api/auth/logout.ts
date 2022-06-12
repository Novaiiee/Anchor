import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";

export const get: RequestHandler = () => {
	return {
		status: 303,
		headers: {
			location: "/",
			"Set-Cookie": serialize("session", "", {
				path: "/",
				expires: new Date(0)
			})
		}
	};
};
