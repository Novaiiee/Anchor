<script>
	import LoginForm from "../../lib/components/auth/LoginForm.svelte";
	import Navbar from "../../lib/components/Navbar.svelte";
</script>

<main>
	<Navbar />
	<div class="flex w-screen h-full justify-center items-center">
		<div class="flex justify-center items-center w-full h-full">
			<LoginForm name="Register" />
		</div>
	</div>
</main>
