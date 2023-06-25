<script>
	import RightCircle from '~icons/icon-park-solid/right-c';

	const stores = [
		{ id: 1, name: '가게1', description: '가게1입니다.' },
		{ id: 2, name: '가게2', description: '가게2입니다.' },
		{ id: 3, name: '가게3', description: '가게3입니다.' }
	];
</script>

<svelte:head>
	<title>케이크가게 목록</title>
	<meta name="description" content="케이크 가게 목록을 검색할 수 있는 페이지입니다." />
</svelte:head>

<div class="p-4">
	<div class="grid grid-cols-2 gap-4">
		{#each stores as store}
			<a
				data-sveltekit-reload
				href="/stores/{store.id}"
				class="w-full bg-green-400 h-48 rounded-md shadow-lg p-4 flex flex-col justify-between"
			>
				<div class="text-xl font-bold">{store.name}</div>
				<div class="text-sm">{store.description}</div>
				<div class="flex justify-end">
					<RightCircle class="w-6 h-6" />
				</div>
			</a>
		{/each}
	</div>
</div>
