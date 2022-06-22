<script context="module" lang="ts">
	import Jumbotron from "$lib/components/home/Jumbotron.svelte";
	import type { Load } from "@sveltejs/kit";
	import { userStore } from "../lib/stores/userStore";

	export const load: Load = async ({ session }) => {
		if (!session.user) {
			userStore.set(null);

			return {
				props: {}
			};
		}

		return {
			redirect: "/focus",
			status: 302
		};
	};
</script>

<svelte:head>
	<title>Anchor</title>
</svelte:head>
<main>
	<Jumbotron />
</main>
