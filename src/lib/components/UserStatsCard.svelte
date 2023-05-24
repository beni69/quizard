<script lang="ts">
	import FasUser from "~icons/fa6-solid/user";
	import FasScrewdriverWrench from "~icons/fa6-solid/screwdriver-wrench";
	import FasGlobe from "~icons/fa6-solid/globe";
    import FasCalendarPlus from "~icons/fa6-solid/calendar-plus";

	export var username: string;
	export var receivedLikeCount: number;
	export var publishedSetCount: number;
	export var registrationDate: Date;
</script>

<div {...$$restProps} class="card flex flex-col items-start p-4 {$$restProps.class}">
	<div class="flex items-center gap-1 justify-evenly w-full">
		<div class="flex items-center w-full">
			<FasUser class="text-surface-400" />
			<span class="font-semibold text-lg ml-2"> Egyedi felhasználónév: </span>
		</div>
		<span class="font-semibold text-lg ml-2 text-surface-400"> {username}</span>
	</div>
	<div class="flex items-center gap-1 justify-evenly w-full">
		<div class="flex items-center w-full">
			<FasScrewdriverWrench class="text-surface-400" />
			<span class="font-semibold text-lg ml-2"> Alkotói pontszám: </span>
		</div>
		<span class="font-semibold text-lg ml-2 text-surface-400">{receivedLikeCount}</span>
	</div>
	<div class="flex items-center gap-1 justify-evenly w-full">
		<div class="flex items-center w-full">
			<FasGlobe class="text-surface-400" />
			<span class="font-semibold text-lg ml-2">Közzétett tananyagok: </span>
		</div>
		<span class="font-semibold text-lg ml-2 text-surface-400">{publishedSetCount}</span>
	</div>
	<div class="flex items-center gap-1 justify-evenly w-full">
		<div class="flex items-center w-full">
			<FasCalendarPlus class="text-surface-400" />
			<span class="font-semibold text-lg ml-2"> Csatlakozás dátuma: </span>
		</div>
		<span class="font-semibold text-lg ml-2 text-surface-400"
			>{registrationDate.toLocaleDateString()}</span
		>
	</div>
</div>
