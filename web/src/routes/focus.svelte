<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { user } from "../lib/stores/userStore";

	export const load: Load = async ({ session }) => {
		console.log(session.user);
		
		if (session.user) {
			return {
				props: { session: session.user }
			};
		}

		return {
			redirect: "/",
			status: 302
		};
	};
</script>

<script lang="ts">
	export let session: User;

	onMount(() => user.set(session));
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<h1>{session.username}</h1>
