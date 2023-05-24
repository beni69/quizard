<script lang="ts">
	import type { PageData } from "./$types";

	export var data: PageData;
</script>

<h1>Profil</h1>
<p>Felhasználónév: {data.user.username}</p>
<p>Regisztráció dátuma: {new Date(data.user.createdAt).toLocaleString()}</p>
<img src={data.user.avatar} alt={data.user.username + " avatar"} />

<h2>Közzétett tananyagok</h2>
<ul>
    {#each data.user.createdSets as set}
        <li><a href="/set/{set.id}">{set.name}</a></li>
    {/each}
</ul>