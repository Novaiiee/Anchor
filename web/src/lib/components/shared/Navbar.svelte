<script lang="ts">
	import { user } from "$lib/stores/userStore";
</script>

<nav class="bg-blue-700 py-4">
	<div class="container mx-auto flex items-center justify-between px-8">
		<div>
			<a class="text-2xl font-semibold text-white" href="/">Anchor</a>
		</div>
		{#if $user}
			<div class="flex items-center justify-center space-x-4 font-medium text-white">
				<a href="/focus">Focus Mode</a>
				<a href="/insights">Insights</a>
			</div>
		{/if}
		<div class="space-x-4">
			{#if $user}
				<img src={""} alt="" />
			{:else}
				<a
					href="/auth/register"
					class="rounded-md bg-white px-4 py-2 font-medium text-black shadow-md hover:bg-gray-300"
					>Get Started</a
				>
				<a href="/auth/login" class="hidden font-medium text-white hover:text-gray-300 md:inline"
					>Or Login</a
				>
			{/if}
		</div>
	</div>
</nav>
