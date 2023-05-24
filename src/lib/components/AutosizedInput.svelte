<script lang="ts">
    export var value: string;    
    var width: number;
</script>

<div class="relative min-w-[1em] w-min">
    <span bind:clientWidth={width} class="invisible whitespace-pre p-0 {$$restProps.class}">{value}</span>
    <input {...$$restProps} class="absolute left-0 w-full p-0 {$$restProps.class}" bind:value/>
</div>