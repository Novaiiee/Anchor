<script>
	import Navbar from "$lib/components/shared/Navbar.svelte";
	import "../app.css";
	import Footer from "../lib/components/shared/Footer.svelte";
</script>

<main class="flex h-screen flex-col justify-between space-y-0 bg-white dark:bg-gray-800">
	<div>
		<Navbar />
		<slot class="mb-auto" />
	</div>
	<Footer />
</main>
