<script lang="ts">
    import "../app.pcss";
    import { SvelteUIProvider } from "@svelteuidev/core";
</script>

<SvelteUIProvider>
    <header>
        header
    </header>
    <main class="grow">
        <slot />
    </main>
    <footer>
        footer
    </footer>
</SvelteUIProvider>