<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<main>
	<h1>Sign in</h1>
	<form method="post" use:enhance>
		<label>
			Email
			<input type="email" name="email" id="email" />
			<span class="err">{form?.errors?.email?.[0] ?? ""}</span>
		</label>
		<label>
			Password
			<input type="password" name="password" id="password" />
			<span class="err">{form?.errors?.password?.[0] ?? ""}</span>
		</label>
		<button type="submit">Sign in</button>
	</form>

	<style>
		form {
			display: grid;
		}
		.err {
			color: red;
		}
	</style>
</main>
