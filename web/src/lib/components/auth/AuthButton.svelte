<script lang="ts">
	import variables from "$lib/variables";

	export let provider: "google" | "github";

	const styles = "flex w-full items-center justify-center space-x-4 rounded-md p-2 shadow-md";
	const googleStyles = `${styles} transition duration-75 ease-in hover:bg-gray-100`;
	const githubStyles = `${styles} bg-black text-white`;
</script>

<a
	href="{variables.serverUrl}/auth/{provider}"
	type="button"
	class={provider == "google" ? googleStyles : githubStyles}
>
	<slot name="icon" />
	<slot name="text" />
</a>
