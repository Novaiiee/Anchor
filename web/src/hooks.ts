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

	try {
		const res = await fetch(`${variables.serverUrl}/auth/profile`, {
			headers: {
				Authorization: `Bearer ${session}`
			}
		});

		if (res.ok) {
			const user = (await res.json()) as User;
			event.locals.user = user;
		}
	} catch (e) {
		console.log(e);
		event.locals.user = null;
	}

	return await resolve(event);
};

export const getSession: GetSession = async ({ locals }) => {
	return {
		token: locals.token,
		user: locals.user
	};
};
