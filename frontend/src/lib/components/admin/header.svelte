<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	// const user = writable(null);

	// onMount(() => {
	// 	const userData = localStorage.getItem('user');
	// 	if (userData) {
	// 		user.set(JSON.parse(userData));
	// 	}
	// });

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		window.location.href = '/auth/login';
	}
</script>

<header class="flex items-center justify-between bg-gray-100 p-4 shadow-md">
	<div class="text-xl font-bold">Admin Panel</div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="flex cursor-pointer items-center gap-2" on:click={logout}>
		<!-- {#if $user}
			<img src={`http://localhost:5000/${$user.image}`} alt="avatar" class="h-9 w-9 rounded-full" />
			<span>{$user.lastname} {$user.firstname}</span>
		{/if} -->
		<img src="/img/user.png" alt="Logo" class="h-9 w-9 rounded-full" />

		<span>Nguyễn Văn Anh</span>
	</div>
</header>
