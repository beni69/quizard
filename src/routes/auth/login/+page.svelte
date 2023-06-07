<script lang="ts">
	import type { PageData } from "./$types";
	import FasEnvelope from "~icons/fa6-solid/envelope";
	import FasKey from "~icons/fa6-solid/key";
	import FasArrowRight from "~icons/fa6-solid/arrow-right";
	import FasRotate from "~icons/fa6-solid/rotate";
	import FormMessageAlert from "$lib/components/FormMessageAlert.svelte";
	import FasCircleNotch from "~icons/fa6-solid/circle-notch";
	import { superForm } from "sveltekit-superforms/client";

	export var data: PageData;

	const { form, errors, enhance, message, submitting } = superForm(data.form, { taintedMessage: null, clearOnSubmit: "message", multipleSubmits: "prevent" });
</script>

<svelte:head>
	<title>Bejelentkezés - Quizard</title>
</svelte:head>

<div class="max-w-sm mx-auto">
	<form class="card px-4 py-6 rounded-3xl flex flex-col gap-2" method="post" use:enhance>
		<h1 class="!text-3xl text-center mb-2">Üdv újra!</h1>
		<label for="email" class="label">
			<span class="ml-2">E-mail cím</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><FasEnvelope /></div>
				<input
					id="email"
					class={$errors.email?.[0] ? "input-error" : ""}
					type="email"
					name="email"
					placeholder="johnpork@email.com"
					bind:value={$form.email}
				/>
			</div>
			<span class="text-sm text-error-400">{$errors.email?.[0] ?? ""}</span>
		</label>

		<label for="password" class="label">
			<span class="ml-2">Jelszó</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><FasKey /></div>
				<input
					id="password"
					class={$errors.password?.[0] ? "input-error" : ""}
					type="password"
					name="password"
					placeholder="•••••••••"
					bind:value={$form.password}
				/>
			</div>
			<span class="text-sm text-error-400">{$errors.password?.[0] ?? ""}</span>
		</label>

		<button class="btn variant-filled-primary !text-white mt-4 gap-2" type="submit" disabled={$submitting}>
			{#if $submitting}
				<FasCircleNotch class="animate-spin"/>
			{/if}
			Bejelentkezés
		</button>
	</form>

	{#if $message}
		<FormMessageAlert class="!py-3 mt-4" message={$message} />
	{/if}

	<ul class="mx-auto mt-4 text-sm list-nav card p-2">
		<p class="font-semibold m-4 mt-2 text-center">Kapcsolódó hivatkozások</p>
		<li>
			<a href="/auth/register">
				<div class="badge-icon w-8 h-8 variant-soft-secondary">
					<FasArrowRight />
				</div>
				<div class="flex flex-col">
					<span class="font-semibold">Nincs még fiókod?</span>
					<span class="text-surface-400">Csatlakozz!</span>
				</div>
			</a>
		</li>
		<li>
			<a href="/auth/forgot-password" class="flex items-center justify-start">
				<div class="badge-icon w-8 h-8 variant-soft-secondary">
					<FasRotate />
				</div>
				<div class="flex flex-col">
					<span class="font-semibold">Elfelejtetted a jelszavad?</span>
					<span class="text-surface-400">Kérj újat!</span>
				</div>
			</a>
		</li>
	</ul>
</div>
