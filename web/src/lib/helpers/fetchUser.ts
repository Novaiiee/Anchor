import variables from "../variables";
import axios from "axios";

export async function fetchUser(token: string) {
	const res = await axios.get(`${variables.serverUrl}/auth/profile`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	return res.data;
}
