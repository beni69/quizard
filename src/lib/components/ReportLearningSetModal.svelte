<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { fade, fly } from "svelte/transition";
	import FasCircleNotch from "~icons/fa6-solid/circle-notch";

	export var id: string;
	export var open: boolean = true;

	var otherChecked: boolean = false;
	var isSubmitting: boolean = false;

	var fieldErrors: Record<string, string[]> | null = null;
	$: firstError = Object.values(fieldErrors ?? {}).map((errors) => (errors as string[])[0])[0];
	const submit: SubmitFunction =
		() => {
			isSubmitting = true;
			return ({ result }) => {
				if (result.type === "failure")
					fieldErrors = result.data?.errors ?? { message: "💀💀💀" };
				else open = false;
				isSubmitting = false;
			};

		};
</script>

<div
	class="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center pb-32 z-50"
	transition:fade={{ duration: 150 }}
>
	<div
		class="modal-example-form card p-6 w-modal shadow-xl space-y-4"
		transition:fly={{ duration: 150, y: 150, opacity: 0 }}
	>
		<header class="text-2xl font-bold">Tananyag bejelentése</header>
		<p>Kérlek add meg, szerinted miért nincs helye a tananyagnak a platformon!</p>

		<form action="/set/{id}?/report" method="post" class="space-y-4" use:enhance={submit}>
			<div class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						name="inapropriate"
					/>
					<p>Nem megfelelő, provokatív, vagy sértő tartalom</p>
				</label>
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						name="copyright"
					/>
					<p>Plágium vagy szerzői jogsértés</p>
				</label>
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						name="misleading"
					/>
					<p>Pontatlan vagy megtévesztő információ</p>
				</label>
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						name="privacy"
					/>
					<p>Adatvédelmi jogsértés</p>
				</label>
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						name="spam"
					/>
					<p>Kéretlen vagy alacsony minőségű tartalom (spam)</p>
				</label>
				<label class="flex items-center space-x-2">
					<input
						class="checkbox focus:!border-warning-500 checked:!bg-warning-500"
						type="checkbox"
						bind:checked={otherChecked}
					/>
					<p>Egyéb</p>
				</label>
				{#if otherChecked}
					<textarea
						class="textarea resize-none focus:!border-warning-500"
						placeholder="Kérlek írd le részletesen a bejelentés okát!"
						name="customReason"
					/>
				{/if}
			</div>
			<footer class="modal-footer flex items-center w-full justify-end gap-2">
				{#if firstError}
					<p class="text-error-500 w-full">{firstError}</p>
				{/if}
				<button class="btn variant-ringed" type="button" on:click={() => (open = false)}
					disabled={isSubmitting}
					>Mégsem</button
				>
				<button class="btn variant-filled-warning gap-2" type="submit" disabled={isSubmitting}>
					{#if isSubmitting}
						<FasCircleNotch class="text-sm animate-spin" />
					{/if}
					Küldés
				</button>
			</footer>
		</form>
	</div>
</div>
