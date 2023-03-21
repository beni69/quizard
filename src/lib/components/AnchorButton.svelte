<script lang="ts">
    import { Button } from "@svelteuidev/core";

    export var href: string;
</script>

<Button {href} {...$$restProps} target={undefined}>
    <slot/>
</Button>