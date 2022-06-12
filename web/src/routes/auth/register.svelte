<script context="module" lang="ts">
	import LoginForm from "$lib/components/auth/LoginForm.svelte";
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
	<title>Register - Anchor</title>
</svelte:head>
<main class="flex h-full w-screen items-center justify-center">
	<div class="flex h-full w-full items-center justify-center">
		<LoginForm name="Register" />
	</div>
</main>
