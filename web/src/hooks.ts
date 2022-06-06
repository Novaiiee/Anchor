import type { GetSession, Handle } from "@sveltejs/kit";
import { serialize } from "cookie";

export const handle: Handle = async ({ event, resolve }) => {
	let token: string = "";

	if (event.url.pathname.endsWith("auth/redirect")) {
		token = event.url.searchParams.get("token")!;
		console.log(token);

		event.locals.token = token;
	} else {
		token = event.request.headers.get("cookie") ?? "";
		event.locals.token = token;
	}

	const response = await resolve(event);

	response.headers.set("Set-Cookie", serialize("access_token", token));
	return response;
};

export const getSession: GetSession = async ({ locals }) => {
	const token = locals.token;

	return {
		token
	};
};
