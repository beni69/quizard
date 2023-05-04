<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form action="/auth/logout" method="post" use:enhance>
	<button type="submit" {...$$props}><slot>Sign out</slot></button>
</form>
