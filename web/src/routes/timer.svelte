<script context="module" lang="ts">
	import { fetchUser } from "$lib/helpers/fetchUser";
	import { user } from "$lib/stores/userStore";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ fetch, session, stuff, props, params }) => {
		const data = await fetchUser(fetch, session);

		if (data) {
			return {
				props: { userData: data }
			};
		}

		return {
			redirect: "/",
			status: 301
		};
	};
</script>

<script lang="ts">
	export let userData: User;

	$: user.set(userData);
</script>

<svelte:head>
	<title>Timer - Anchor</title>
</svelte:head>

<h1>{$user?.username}</h1>
