<script lang="ts">
    import {navigating} from "$app/stores";
    import FasChevronRight from "~icons/fa6-solid/chevron-right";
	import FasChevronLeft from "~icons/fa6-solid/chevron-left";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{"navigate": number}>();

    export var currentPage: number;
    export var pageCount: number;
</script>

<div class="flex items-center gap-4">
    <slot {currentPage} {pageCount}></slot>
    <div class="flex items-center justify-between gap-2">
        <button
            class="btn btn-icon !w-10 variant-filled-tertiary"
            on:click={() => dispatch("navigate", currentPage - 1)}
            disabled={currentPage === 0 || $navigating != null}
            ><FasChevronLeft class="text-sm" /></button
        >
        <button
            class="btn btn-icon !w-10 variant-filled-tertiary"
            on:click={() => dispatch("navigate", currentPage + 1)}
            disabled={currentPage === pageCount - 1 || $navigating != null}
            ><FasChevronRight class="text-sm" /></button
        >
    </div>
</div>