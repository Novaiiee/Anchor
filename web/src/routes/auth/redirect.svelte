<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import { fetchUser } from "../../lib/helpers/fetchUser";

	export const load: Load = async ({ fetch, session, stuff, props, params }) => {
		const data = await fetchUser(fetch, session);

		if (data) {
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
</script>
