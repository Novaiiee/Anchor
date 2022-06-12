<script context="module" lang="ts">
	import { userStore } from "$lib/stores/userStore";
	import type { Load } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { socketStore } from "../lib/stores/socketStore";

	export const load: Load = async ({ session }) => {
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

	onMount(() => {
		userStore.set(session);
		$socketStore.emit("events", { data: "" });

		$socketStore.on("events", (data) => {
			console.log(data);
		});
	});
</script>

<svelte:head>
	<title>Focus - Anchor</title>
</svelte:head>

<h1>{session.username}</h1>
