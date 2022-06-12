import type { RequestHandler } from "@sveltejs/kit";
import { fetchUser } from "../../lib/helpers/fetchUser";

export const get: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get("token");

	if (!token) {
		return {
			status: 302,
			headers: {
				location: "/"
			}
		};
	}

	const user = await fetchUser(token);

	if (user) {
		return {
			redirect: "/focus",
			status: 301
		};
	}

	return {
		redirect: "/auth/login?error=oauth",
		status: 301
	};
};
