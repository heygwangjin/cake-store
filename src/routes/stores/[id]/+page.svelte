<script>
	import { onMount } from 'svelte';
	import { createScene } from '$lib/three/main.js';
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

<div id="blocker">
	<div id="instructions">
		<p style="">
			Click to play
		</p>
		<p>
			Move: WASD<br/>
			Jump: SPACE<br/>
			Look: MOUSE
		</p>
	</div>
</div>

<canvas bind:this={el} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

 	#blocker {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
	}

	#instructions {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		text-align: center;
		font-size: 14px;
		cursor: pointer;
	}
</style>
