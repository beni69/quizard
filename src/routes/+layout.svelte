<script lang="ts">
	import "../app.pcss";

	import { page } from "$app/stores";
	import { getUser, handleSession } from "@lucia-auth/sveltekit/client";
	handleSession(page);

	// the store returned by getUser() only updates to reflect the latest data in the database when the layout load re-runs,
	// but requests to protected routes fetch the latest information every time, so don't worry (it won't update this though)
	const user = getUser();

	import { AppShell, AppRail, AppRailTile, Avatar } from "@skeletonlabs/skeleton";

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
	import { storePopup, popup } from "@skeletonlabs/skeleton";
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import FasRightFromBracket from "~icons/fa6-solid/right-from-bracket";
	import FasPlus from "~icons/fa6-solid/plus";
	import FasMagnifyingGlass from "~icons/fa6-solid/magnifying-glass";
	import FasUser from "~icons/fa6-solid/user";
	import { writable } from "svelte/store";
	import SignOutButton from "$lib/components/SignOutButton.svelte";
</script>

<AppShell>
	<AppRail slot="sidebarLeft">
		<div class="w-full p-1">
			<AppRailTile
				active={writable()}
				tag="a"
				href="/"
				style="background-image: url('/logo.svg');"
				class="bg-center bg-contain bg-no-repeat rounded-2xl hover:bg-secondary-600"
			/>
		</div>
		<div use:popup={{ event: "hover", target: "create", placement: "right" }}>
			<AppRailTile value={0} tag="a" href="/create" class="">
				<FasPlus />
			</AppRailTile>
			<div class="card variant-filled py-2 px-3" data-popup="create">
				Alkotás
				<div class="arrow variant-filled" />
			</div>
		</div>
		<div use:popup={{ event: "hover", target: "browse", placement: "right" }}>
			<AppRailTile value={1} tag="a" href="/browse" class="">
				<FasMagnifyingGlass />
			</AppRailTile>
			<div class="card variant-filled py-2 px-3" data-popup="browse">
				Böngészés
				<div class="arrow variant-filled" />
			</div>
		</div>

		<svelte:fragment slot="trail">
			{#if $user}
				<div use:popup={{event:"click", target: "avatar", placement: "top"}}>
					<AppRailTile active={writable()} hover={writable()}>
						<div class="p-2">
							<Avatar class="w-full" src={$user.avatar} />
						</div>
					</AppRailTile>
					<div class="card variant-filled-surface items-stretch isolate" data-popup="avatar">
						<a href="/profile" class="btn flex items-center justify-start hover:variant-ghost-secondary rounded-md gap-2"><FasUser/>Profil</a>
						<SignOutButton class="btn flex items-center justify-start hover:variant-ghost-error rounded-md gap-2"><FasRightFromBracket/>Kijelentkezés</SignOutButton>
						<div class="arrow variant-filled-surface -z-10" />
					</div>
				</div>
			{:else}
				<div use:popup={{ event: "hover", target: "login", placement: "right" }}>
					<AppRailTile value={2} tag="a" href="/auth/login">
						<div class="flex flex-col w-full items-center">
							<FasRightToBracket />
							<div class="card variant-filled py-2 px-3" data-popup="login">
								Bejelentkezés
								<div class="arrow variant-filled" />
							</div>
						</div>
					</AppRailTile>
				</div>
			{/if}
		</svelte:fragment>
	</AppRail>
	<slot />
</AppShell>
