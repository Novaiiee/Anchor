<script>
	import { user } from "../stores/userStore";
</script>

<nav class="bg-cyan-700 w-screen py-4">
	<div class="container mx-auto flex items-center justify-between">
		<div>
			<a class="text-2xl text-white font-semibold" href="/">Anchor</a>
		</div>
		{#if $user}
			<div class="flex items-center space-x-4 justify-center text-white font-medium">
				<a href="/focus">Focus Mode</a>
				<a href="/insights">Insights</a>
			</div>
		{/if}
		<div>
			{#if $user}
				<img src={""} alt="" />
			{:else}
				<a href="/auth/login" class="px-4 py-2 shadow-md bg-white rounded-md text-black font-medium hover:bg-gray-300"
					>Login</a
				>
			{/if}
		</div>
	</div>
</nav>
