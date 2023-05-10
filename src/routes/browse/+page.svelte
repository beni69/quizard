<script lang="ts">
	import type { PageData } from "./$types";

    export var data: PageData;
</script>

<h1>Böngészés</h1>
<ul>
    {#each data.learningSets as set}
        <li><a href="/set/{set.id}">{set.name}</a> by: {set.user.name}</li>
    {/each}
</ul>