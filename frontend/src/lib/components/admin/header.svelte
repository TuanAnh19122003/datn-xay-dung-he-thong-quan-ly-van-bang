<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	const user = writable(null);
	const dropdownOpen = writable(false);

	onMount(() => {
		const userData = localStorage.getItem('user');
		if (userData) {
			user.set(JSON.parse(userData));
		}
	});

	const showToast = writable(false);
	let toastMessage = '';

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		toastMessage = 'Đăng xuất thành công!';
		showToast.set(true);

		setTimeout(() => {
			showToast.set(false);
			goto('/auth/login');
		}, 3000);
	}
	function toggleDropdown() {
		dropdownOpen.update((open) => !open);
	}

	function goToProfile() {
		goto('/profile');
	}

	function goToSettings() {
		goto('/settings');
	}
</script>

<header class="flex items-center justify-between bg-gray-100 p-4 shadow-md">
	<div class="text-xl font-bold">Hệ thống quản lý văn bằng</div>

	<div class="relative">
		<!-- Avatar và tên -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-gray-100"
			on:click={toggleDropdown}
		>
			{#if $user}
				<img
					src={`http://localhost:5000/${$user.image}`}
					alt="avatar"
					class="h-9 w-9 rounded-full"
				/>
				<span>{$user.lastname} {$user.firstname}</span>
			{/if}
		</div>

		<!-- Dropdown -->
		<!-- Dropdown -->
		{#if $dropdownOpen}
			<div
				class="animate-fadeIn absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
			>
				<button
					class="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-gray-700 transition hover:bg-purple-50"
					on:click={() => {
						goToProfile();
						dropdownOpen.set(false);
					}}
				>
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5.121 17.804A4 4 0 0110 14h4a4 4 0 014.879 3.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/></svg
					>
					Thông tin cá nhân
				</button>

				<button
					class="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-gray-700 transition hover:bg-purple-50"
					on:click={() => {
						goToSettings();
						dropdownOpen.set(false);
					}}
				>
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3"
						/></svg
					>
					Cài đặt
				</button>

				<!-- Mục tìm kiếm mới -->
				<button
					class="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-gray-700 transition hover:bg-purple-50"
					on:click={() => {
						goto('/');
						dropdownOpen.set(false);
					}}
				>
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					Tìm kiếm
				</button>

				<hr class="border-gray-200" />
				<button
					class="flex w-full items-center gap-2 px-4 py-3 text-left font-bold text-red-600 transition hover:bg-red-100"
					on:click={logout}
				>
					<svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7"
						/>
					</svg>
					Đăng xuất
				</button>
			</div>
		{/if}
	</div>
</header>

<!-- Toast thông báo -->
{#if $showToast}
	<div
		class="animate-fadeInOut fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg"
	>
		{toastMessage}
	</div>
{/if}

<style>
	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: translateY(-10px);
		}
		10% {
			opacity: 1;
			transform: translateY(0);
		}
		90% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
	.animate-fadeInOut {
		animation: fadeInOut 2s ease-in-out forwards;
	}
</style>
