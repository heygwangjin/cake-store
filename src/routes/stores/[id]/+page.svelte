<script>
	import { onMount } from 'svelte';
	import { createScene } from '$lib/three/scene.js';
	import { page } from '$app/stores';

	const id = $page.params.id;

	let el;

	onMount(() => {
		createScene(el);
	});
</script>

<svelte:head>
	<title>가게명</title>
	<meta name="description" content="가게명 가게입니다." />
</svelte:head>

<canvas bind:this={el} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
