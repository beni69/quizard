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
		class="alert variant-filled-error !flex !flex-row !items-center !flex-nowrap {$$restProps.class}"
		transition:scale={{ duration: 100, easing: expoInOut }}
	>
		<FasTriangleExclamation />
		<p class="alert-message !ml-4 !mt-0 unstyled">{message}</p>
		<div class="alert-actions !mt-0">
			<button class="btn-icon w-6 text-xs variant-soft" on:click={() => (messageDismissed = true)}
				><FasXMark /></button
			>
		</div>
	</div>
{/if}
