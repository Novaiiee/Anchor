<script>
	export let startTime = 0;
	export let currentTime = startTime;

	$: seconds = new Date(currentTime * 1000).toISOString().slice(11, 19);
</script>

<div>
	<h1>{seconds}</h1>
</div>
