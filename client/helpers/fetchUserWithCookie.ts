import { NextApiRequest } from "next";
import { User } from "../types";

export default async function fetchUserWithCookie(req: NextApiRequest): Promise<User | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`, {
		method: "GET",
		credentials: "include",
		headers: { cookie: req.headers.cookie ?? "" }
	});

	const user = (await res.json()) as User;
	if (res.ok) return user;

	return null;
}
