<script lang="ts">
    import type {PageData} from "./$types";
    import {enhance} from "$app/forms";

    export var data: PageData;
</script>

<svelte:head>
    <title>Alkotás- Quizard</title>
</svelte:head>

<h1>Alkotás</h1>
<h2>Korábbi tananyagaim:</h2>
<ul>
    {#each data.learningSets as set}
        <li><a href="/create/{set.id}">{set.name}</a></li>
    {/each}
</ul>
<form action="?/new" method="post" use:enhance>
    <label for="name">Tananyag neve:</label>
    <input type="text" id="name" name="name">
    <label for="description">Leírás:</label>
    <textarea id="description" name="description"></textarea>
    <label for="visibility">Láthatóság:</label>
    <select name="visibility" id="visibility">
        <option value="public">Nyilvános</option>
        <option value="unlisted">Nem listázott</option>
        <option value="private">Privát</option>
    </select>
    <button type="submit">Új tananyag</button>
</form>

