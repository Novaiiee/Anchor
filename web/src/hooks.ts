import type { GetSession, Handle } from "@sveltejs/kit";
import { parse, serialize } from "cookie";
import variables from "./lib/variables";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.endsWith("auth/redirect")) {
		const token = event.url.searchParams.get("token") ?? "";
		event.locals.token = token;

		const response = await resolve(event);

		response.headers.set(
			"Set-Cookie",
			serialize("session", token, {
				path: "/"
			})
		);

		return response;
	}

	const cookies = parse(event.request.headers.get("cookie") ?? "");
	const { session } = cookies;

	const user = await fetch(`${variables.serverUrl}/auth/profile`, {
		headers: {
			Authorization: `Bearer ${session}`
		}
	}).then((a) => a.json());

	event.locals.user = user as User;
	return await resolve(event);
};

export const getSession: GetSession = async ({ locals }) => {
	return {
		token: locals.token,
		user: locals.user
	};
};
