<script lang="ts">
	import { convertMsToTime } from "../../helpers/time";
	import { focusSession } from "../../stores/focusStore";

	$: time = "";
	$: currentTime = 0;

	$: {
		if (currentTime != $focusSession.currentTime) {
			time = convertMsToTime($focusSession.currentTime);
			console.log("Updated Time");
		}
	}
</script>

<div>
	<h1 class="font-inter text-7xl font-medium">{time}</h1>
</div>
