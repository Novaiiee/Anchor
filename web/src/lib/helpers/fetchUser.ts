import variables from "../variables";

type Fetch = (info: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export async function fetchUser(fetch: Fetch, session: App.Session) {
	console.log(session.token);
	
	const user = await fetch(`${variables.serverUrl}/auth/profile`, {
		headers: { Authorization: `Bearer ${session.token}` }
	}).then((res) => res.json());

	return user as User;
}
