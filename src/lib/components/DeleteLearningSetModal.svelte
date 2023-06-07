<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import FasCircleExclamation from "~icons/fa6-solid/circle-exclamation";
	import FasCircleNotch from "~icons/fa6-solid/circle-notch";

	export var id: string;
	export var open: boolean = true;

	var isSubmitting = false;
	const submit = () => {
		isSubmitting = true;
		return async () => {
			await invalidateAll();
			open = false;
			isSubmitting = false;
		};
	};
</script>

<div
	class="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center pb-32 z-50"
	transition:fade={{ duration: 150 }}
>
	<div
		class="card p-6 w-modal shadow-xl space-y-4"
		transition:fly={{ duration: 150, y: 150, opacity: 0 }}
	>
		<header class="text-2xl font-bold">Megerősítés</header>
		<article class="flex gap-8 px-4">
			<FasCircleExclamation class="text-5xl self-center" />
			A törlés után az adott tananyag örökre elvész! Biztosan törölni szeretnéd a szerkesztés alatt lévő
			tananyagot?
		</article>
		<footer class="flex items-center justify-end gap-2">
			<button class="btn variant-ringed" on:click={() => (open = false)} disabled={isSubmitting}
				>Mégsem</button
			>
			<form action="/create/{id}?/delete" method="post" use:enhance={submit}>
				<button class="btn variant-filled-error gap-2" disabled={isSubmitting}>
					{#if isSubmitting}
						<FasCircleNotch class="text-sm animate-spin" />
					{/if}
					Végleges törlés
				</button>
			</form>
		</footer>
	</div>
</div>
