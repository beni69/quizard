<script lang="ts">
	let email: string, password: string;

	const handleSubmit = () => {};
</script>

<main>
	<h1>Login</h1>
	<form method="post" on:submit|preventDefault={handleSubmit}>
		<label for="email">Email</label>
		<input type="email" name="email" id="email" bind:value={email} />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" bind:value={password} />
		<button type="submit">Log in</button>
	</form>
</main>
