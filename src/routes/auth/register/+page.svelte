<script lang="ts">
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import FasEnvelope from "~icons/fa6-solid/envelope";
	import FasUser from "~icons/fa6-solid/user";
	import FasKey from "~icons/fa6-solid/key";
	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import FasRotate from "~icons/fa6-solid/rotate";

	export var data: PageData;

	const { form, errors, enhance } = superForm(data.form, { taintedMessage: null, clearOnSubmit: "none", multipleSubmits: "prevent" });
</script>

<svelte:head>
	<title>Regisztráció - Quizard</title>
</svelte:head>

<div class="max-w-sm mx-auto">
	<form class="card px-4 py-6 rounded-3xl flex flex-col gap-4" method="post" use:enhance>
		<h1 class="!text-3xl text-center mb-2">Regisztráció</h1>
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

		<label for="name" class="label">
			<span class="ml-2">Felhasználónév</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><FasUser /></div>
				<input
					id="name"
					class={$errors.name?.[0] ? "input-error" : ""}
					type="text"
					name="name"
					placeholder="John Pork"
					bind:value={$form.name}
				/>
			</div>
			<span class="text-sm text-error-400">{$errors.name?.[0] ?? ""}</span>
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

		<button class="btn variant-filled-primary !text-white mt-4" type="submit">Küldés</button>
	</form>

	<ul class="mx-auto mt-4 text-sm list-nav card p-2">
		<p class="font-semibold m-4 mt-2 text-center">Kapcsolódó hivatkozások</p>
		<li>
			<a href="/auth/login">
				<div class="badge-icon w-8 h-8 variant-soft-secondary">
					<FasRightToBracket />
				</div>
				<div class="flex flex-col">
					<span class="font-semibold">Van már fiókod?</span>
					<span class="text-surface-400">Jelentkezz be!</span>
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
