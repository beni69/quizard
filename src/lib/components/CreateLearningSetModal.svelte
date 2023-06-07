<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { goto, invalidateAll } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import FasCircleNotch from "~icons/fa6-solid/circle-notch";
	import FormMessageAlert from "./FormMessageAlert.svelte";

	export var open: boolean = true;

	var isSubmitting = false;

	var fieldErrors: Record<string, string[]> | null = null;

	const submit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result }) => {
			if (result.type === "failure") {
				fieldErrors = result.data?.errors ?? { message: "💀💀💀" };
			} else if (result.type === "redirect") {
				await goto(result.location);
			} else {
				await invalidateAll();
				open = false;
			}
			isSubmitting = false;
		};
	};

	var showWarning = true;
</script>

<div
	class="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center pb-32 z-50"
	transition:fade={{ duration: 150 }}
>
	<div
		class="card p-6 w-modal shadow-xl space-y-4"
		transition:fly={{ duration: 150, y: 150, opacity: 0 }}
	>
		<header class="text-2xl font-bold">Tananyag létrehozása</header>
		<article class="flex flex-col gap-4">
			{#if showWarning}
				<!-- <div class="alert variant-ghost-warning" out:scale={{duration:250}}>
					<FasTriangleExclamation class="text-xs" />
					<div class="alert-message">
						<p class="!text-xs">
							Kérlek vedd figyelembe, hogy egyszerre legfeljebb 5 tananyagon dolgozhatsz!
						</p>
					</div>
					<button class="hover:opacity-75 transition-opacity" on:click={() => (showWarning = false)}
						><FasXmark class="text-sm" /></button
					>
				</div> -->
				<FormMessageAlert class="!text-xs variant-ghost-warning" message="Kérlek vedd figyelembe, hogy egyszerre legfeljebb 5 tananyagon dolgozhatsz!"/>
			{/if}
			Mi legyen a tananyag címe és leírása?
		</article>
		<form action="/create?/new" method="post" class="space-y-4" use:enhance={submit}>
			<div class="border border-surface-500 p-4 space-y-4 rounded-container-token">
				<label for="name" class="label">
					<span class="ml-2">Címe</span>
					<input type="text" class="input" id="name" name="name" placeholder="Lorem ipsum" />
					<span class="text-sm text-error-400">{fieldErrors?.name?.[0] ?? ""}</span>
				</label>
				<label for="description" class="label">
					<span class="ml-2"
						>Leírás <span class="italic text-surface-300 text-xs">(nem kötelező)</span></span
					>
					<textarea
						class="textarea"
						id="description"
						name="description"
						rows="6"
						placeholder="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt amet deserunt ducimus distinctio delectus. Eaque officiis ipsa repellat autem non exercitationem modi pariatur incidunt quam a, reprehenderit natus distinctio."
					/>
					<span class="text-sm text-error-400">{fieldErrors?.description?.[0] ?? ""}</span>
				</label>
			</div>
			<footer class="flex items-center justify-end gap-2">
				<button class="btn variant-ringed" type="button" on:click={() => (open = false)} disabled={isSubmitting}>
					Mégsem
				</button>
				<button class="btn variant-filled-primary gap-2" disabled={isSubmitting}>
					{#if isSubmitting}
						<FasCircleNotch class="text-sm animate-spin" />
					{/if}
					Létrehozás
				</button>
			</footer>
		</form>
	</div>
</div>
