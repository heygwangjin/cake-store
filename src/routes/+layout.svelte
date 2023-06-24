<script>
	import '../app.css';
</script>

<header class="fixed w-full z-10 bg-white">
	<div class="max-w-3xl mx-auto py-2 flex justify-between items-center gap-6 px-6">
		<div class="" />
		<input
			type="text"
			class="border border-gray-300 rounded-full px-4 w-full shadow-sm py-2 text-sm"
			placeholder="케이크가게 검색하기"
		/>
		<div class="" />
	</div>
</header>
<div class="h-screen bg-gray-100">
	<main class="max-w-3xl mx-auto bg-white py-16 h-full">
		<slot />
	</main>
</div>
<footer class="fixed p-4 bg-white flex items-center justify-center w-full z-10 bottom-0">
	<div>하단메뉴</div>
</footer>
