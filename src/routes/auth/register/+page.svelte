<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	$: {
		console.log(form);
		if (form?.taken) alert(`${form.taken} is already taken`);
	}
</script>

<h1>Register</h1>
<form method="post" use:enhance>
	<label>
		Email
		<input type="email" name="email" id="email" />
		<span class="err">{form?.formError?.email || ""}</span>
	</label>
	<label>
		Username
		<input type="text" name="name" id="name" />
		<span class="err">{form?.formError?.name || ""}</span>
	</label>
	<label>
		Password
		<input type="password" name="password" id="password" />
		<span class="err">{form?.formError?.password || ""}</span>
	</label>
	<button type="submit">Register</button>
</form>

<style>
	form {
		display: grid;
	}
	.err {
		color: red;
	}
</style>
