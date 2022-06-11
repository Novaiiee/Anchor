<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ session }) => {
		if (session.user) {
			return {
				props: { session: session.user }
			};
		}

		return {
			redirect: "/",
			status: 301
		};
	};
</script>

<script lang="ts">
	export let session: User;
</script>

<svelte:head>
	<title>Timer - Anchor</title>
</svelte:head>

<h1>{session.username}</h1>
