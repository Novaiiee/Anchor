<script>
	import Footer from "$lib/components/shared/Footer.svelte";
	import Navbar from "$lib/components/shared/Navbar.svelte";
	import "../app.css";
</script>

<main class="flex h-screen w-screen flex-col justify-between space-y-0 bg-white dark:bg-gray-800">
	<Navbar />
	<slot class="mb-auto" />
	<Footer />
</main>
