<script context="module" lang="ts">
	import Jumbotron from "$lib/components/home/Jumbotron.svelte";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ session }) => {
		if (!session.user) {
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
