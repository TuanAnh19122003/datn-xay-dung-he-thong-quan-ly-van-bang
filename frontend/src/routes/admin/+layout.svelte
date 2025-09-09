<script>
	import Sidebar from '$lib/components/admin/Sidebar.svelte';
	import Header from '$lib/components/admin/Header.svelte';
	import Footer from '$lib/components/admin/Footer.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let collapsed = false;

	// onMount(() => {
	// 	const token = localStorage.getItem('token');
	// 	if (!token) {
	// 		goto('/auth/login');
	// 	}
	// });
</script>

<div class="flex min-h-screen">
	<Sidebar bind:collapsed />

	<div class="flex flex-1 flex-col">
		<Header />

		<main class="flex-1 overflow-auto bg-gray-50 p-4">
			<slot />
		</main>

		<Footer />
	</div>
</div>
