<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import FasUser from "~icons/fa6-solid/user";
	import FasKey from "~icons/fa6-solid/key";

	export let form: ActionData;
</script>

<main>
	<form class="max-w-sm mx-auto card px-4 py-6 rounded-3xl flex flex-col gap-2" method="post" use:enhance>
		<h1 class="!text-3xl text-center mb-2">Üdv újra!</h1>
		<label class="label">
			<span class="ml-2">E-mail cím</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><FasUser/></div>
				<input class="{form?.errors?.email?.[0] ? "input-error":""}" type="email" name="email" id="email" placeholder="johnpork@email.com" />
			</div>
			<span class="text-sm text-error-400">{form?.errors?.email?.[0] ?? ""}</span>
		</label>
		<label class="label">
			<span class="ml-2">Jelszó</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><FasKey/></div>
				<input class="{form?.errors?.password?.[0] ? "input-error":""}" type="password" name="password" id="password" placeholder="•••••••••" />
			</div>
			<span class="text-sm text-error-400">{form?.errors?.password?.[0] ?? ""}</span>
		</label>
		<button class="btn variant-filled-primary !text-white mt-4" type="submit">Küldés</button>
	</form>
</main>
