<script lang="ts">
	import { scale } from "svelte/transition";
	import { expoInOut } from "svelte/easing";
	import FasTriangleExclamation from "~icons/fa6-solid/triangle-exclamation";
	import FasXMark from "~icons/fa6-solid/xmark";

	export var message: string;

	var messageDismissed = false;
</script>

{#if !messageDismissed}
	<div
		{...$$restProps}
		class="alert variant-filled-error {$$restProps.class}"
		transition:scale={{ duration: 100, easing: expoInOut }}
	>
		<FasTriangleExclamation />
		<p class="alert-message">{message}</p>
		<div class="alert-actions">
			<button class="btn-icon w-6 text-xs variant-soft" on:click={() => (messageDismissed = true)}
				><FasXMark /></button
			>
		</div>
	</div>
{/if}
