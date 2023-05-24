<script lang="ts">
	import { popup } from "@skeletonlabs/skeleton";
	import { page } from "$app/stores";

	export var tooltip: {
		text: string;
		name: string;
		placement: "top" | "bottom" | "left" | "right";
	};

	$: active = $page.url.pathname === $$restProps.href;
</script>

<div use:popup={{ event: "hover", target: tooltip.name, placement: tooltip.placement }}>
	<a
		href="##"
		{...$$restProps}
		class="aspect-square flex place-items-center place-content-center !text-white bg-primary-hover-token {$$restProps.class}"
		class:bg-primary-active-token={active}
		class:cursor-default={active}
	>
		<slot />
	</a>
	<div class="card variant-filled py-2 px-3 z-50" data-popup={tooltip.name}>
		{tooltip.text}
		<div class="arrow variant-filled" />
	</div>
</div>
