<script lang="ts">
	import FasGlobe from "~icons/fa6-solid/globe";
	import FasLock from "~icons/fa6-solid/lock";
	import FasUpload from "~icons/fa6-solid/upload";
	import FasChevronDown from "~icons/fa6-solid/chevron-down";
	import FasCircleNotch from "~icons/fa6-solid/circle-notch";
	import { fade } from "svelte/transition";
	import { enhance } from "$app/forms";
	import { clickOutside } from "svelte-use-click-outside";
	import { invalidateAll } from "$app/navigation";

	export var id: string;

	var container: HTMLDivElement;
	$: containerRect = container?.getBoundingClientRect();
	$: x = containerRect && containerRect.x + window.scrollX;
	$: y = containerRect && containerRect.y + window.scrollY;

	var showDropdown = false;
	var dropdownWidth = 0;
	var isSubmitting = false;

	async function submit() {
		isSubmitting = true;
		return async () => {
			await invalidateAll();
			isSubmitting = false;
		};
	}
</script>

<svelte:window on:resize={() => (container = container)} />
<div {...$$restProps} bind:this={container} use:clickOutside={() => (showDropdown = false)}>
	<button
		class="btn variant-filled-primary justify-center w-full relative"
		on:click={() => (showDropdown = true)}
	>
		<div class="flex items-center gap-2">
			<FasUpload />
			Közzététel
		</div>
		<FasChevronDown class="text-[8px] absolute right-4" />
	</button>
	{#if showDropdown}
		<div
			class="card w-fit shadow-xl py-4 flex !flex-col items-center fixed"
			style="top: {y + 8}px; left: {x + containerRect.width / 2 - dropdownWidth / 2}px;"
			transition:fade={{ duration: 100 }}
			bind:clientWidth={dropdownWidth}
		>
			<form
				method="post"
				action="/create/{id}?/publish"
				class="flex flex-col px-4 gap-4 w-fit mx-auto"
				use:enhance={submit}
			>
				<h4>Ki láthassa a tananyagot?</h4>
				<div class="flex flex-col w-fit mx-auto">
					<label class="flex items-center space-x-2">
						<input
							class="radio"
							type="radio"
							checked
							name="visibility"
							value="public"
							disabled={isSubmitting}
						/>
						<span class="flex items-center gap-2">
							<FasGlobe class="text-sm" />
							<div class="divider-vertical h-5" />
							Mindenki
						</span>
					</label>
					<label class="flex items-center space-x-2">
						<input
							class="radio"
							type="radio"
							name="visibility"
							value="unlisted"
							disabled={isSubmitting}
						/>
						<span class="flex items-center gap-2">
							<FasLock class="text-sm" />
							<div class="divider-vertical h-5" />
							A link birtokosai
						</span>
					</label>
				</div>
				<button class="btn variant-filled-primary gap-2" disabled={isSubmitting} type="submit">
					{#if isSubmitting}
						<FasCircleNotch class="animate-spin text-sm" />
					{:else}
						<FasUpload class="text-sm" />
					{/if}
					Közzététel
				</button>
			</form>
		</div>
	{/if}
</div>
