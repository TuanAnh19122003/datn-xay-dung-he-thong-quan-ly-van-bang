<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import {
		User,
		Shield,
		Home,
		Book,
		FileText,
		GraduationCap,
		Clipboard,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';

	export let collapsed = false;

	// const user = writable(null);

	// onMount(() => {
	// 	const userData = localStorage.getItem('user');
	// 	if (userData) {
	// 		user.set(JSON.parse(userData));
	// 	} else {
	// 		window.location.href = '/auth/login';
	// 	}
	// });

	const menuItems = [
		{ key: 'user-management', label: 'Quản lý người dùng', link: '/admin/user', icon: User },
		{ key: 'role-management', label: 'Quản lý vai trò', link: '/admin/roles', icon: Shield },
		{ key: 'faculty', label: 'Khoa', link: '/admin/faculty', icon: Home },
		{ key: 'major', label: 'Chuyên ngành', link: '/admin/major', icon: Book },
		{ key: 'template', label: 'Template', link: '/admin/template', icon: FileText },
		{ key: 'student', label: 'Sinh viên', link: '/admin/students', icon: GraduationCap },
		{ key: 'logs', label: 'Kiểm tra logs & văn bằng', link: '/admin/logs', icon: Clipboard }
	];
</script>

<aside
	class={`bg-gray-900 text-white ${collapsed ? 'w-20' : 'w-64'} flex h-screen flex-col transition-all`}
>
	<!-- Logo -->
	<a href="/admin" class="flex items-center justify-center p-4">
		<img
			src="/img/logo.png"
			alt="Logo"
			class={`rounded-lg shadow-md transition-all ${collapsed ? 'h-10 w-10' : 'h-24 w-24'}`}
		/>
	</a>

	<!-- Menu -->
	<nav class="mt-6 flex-1">
		{#each menuItems as item}
			<a
				href={item.link}
				class="mx-2 my-1 flex items-center gap-3 rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700"
			>
				<!-- Sử dụng svelte:component để render icon -->
				<svelte:component this={item.icon} class="h-5 w-5" />
				{#if !collapsed}
					<span class="font-medium">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<button
		class="m-2 rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
		on:click={() => (collapsed = !collapsed)}
	>
		{#if collapsed}
			<ChevronRight class="h-5 w-5 text-white" />
		{:else}
			<ChevronLeft class="h-5 w-5 text-white" />
		{/if}
	</button>
</aside>
