<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { toast } from 'svelte-sonner';

	const placeholderImg = '/img/placeholder.png';
	const API_URL = import.meta.env.VITE_API_URL;

	let query = '';
	let results = [];
	let loading = false;
	let showPlaceholder = true;

	let debounceTimeout;
	function onInputChange(e) {
		query = e.target.value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(fetchResults, 300);

		if (!query.trim()) {
			showPlaceholder = true;
			results = [];
		}
	}

	async function fetchResults() {
		if (!query.trim()) {
			results = [];
			showPlaceholder = true;
			return;
		}

		showPlaceholder = false;
		loading = true;
		try {
			const res = await axios.get(`${API_URL}/students/search`, { params: { q: query } });
			results = res.data.data.filter((r) => r.type === 'student' || r.type === 'certs');
		} catch (err) {
			console.error(err);
			toast.error('Không thể tìm kiếm');
		} finally {
			loading = false;
		}
	}

	function goToLogin() {
		// ví dụ điều hướng sang trang login
		window.location.href = '/auth/login';
	}
</script>

<!-- Nút đăng nhập góc trên bên phải -->
<button
	on:click={goToLogin}
	class="fixed top-4 right-4 z-50 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg hover:bg-blue-600 transition"
>
	Đăng nhập
</button>

<div class="flex min-h-screen bg-gray-100">
	<!-- LEFT: placeholder or results -->
	<div class="flex w-3/5 items-center justify-center bg-gray-200 p-6">
		{#if showPlaceholder}
			<img
				src={placeholderImg}
				alt="Placeholder"
				class="h-full w-full rounded-lg object-contain shadow-md"
			/>
		{:else}
			<div class="h-full w-full space-y-4 overflow-y-auto">
				{#if loading}
					<p class="text-center text-gray-500">Đang tải...</p>
				{:else if results.length === 0}
					<p class="text-center text-gray-400">Không tìm thấy kết quả</p>
				{:else}
					<ul class="space-y-4">
						{#each results as item}
							<li class="flex rounded-lg bg-white p-4 shadow transition hover:shadow-lg">
								{#if item.type === 'student'}
									<!-- svelte-ignore a11y_missing_attribute -->
									<img
										src={item.image ? `http://localhost:5000/${item.image}` : placeholderImg}
										class="h-32 w-24 rounded-lg object-cover"
									/>
									<div class="ml-4">
										<p class="text-lg font-bold">{item.lastname} {item.firstname}</p>
										<p class="text-sm text-gray-500">{item.code}</p>
										<p class="text-sm text-gray-500">{item.majorName}</p>
									</div>
								{:else if item.type === 'certs'}
									<div
										class="flex h-20 w-20 items-center justify-center rounded-full bg-green-200 text-xl font-bold text-white"
									>
										C
									</div>
									<div class="ml-4">
										<p class="text-lg font-bold">{item.templateName}</p>
										<p class="text-sm text-gray-500">Mã chứng chỉ: {item.number}</p>
										<p class="text-sm text-gray-500">
											Sinh viên: {item.studentName} ({item.studentCode})
										</p>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>

	<!-- RIGHT: search box -->
	<div class="flex w-2/5 flex-col justify-center rounded-l-lg bg-white p-8 shadow-lg">
		<h1 class="mb-2 text-center text-2xl font-bold">Tìm kiếm nhanh</h1>
		<p class="mb-4 text-center text-gray-500">
			Nhập thông tin để tìm kiếm sinh viên hoặc chứng chỉ
		</p>
		<input
			type="text"
			placeholder="Ví dụ: Tuấn 2007, Hải Tú Hạ Long, 0987 14/02/2008"
			bind:value={query}
			on:input={onInputChange}
			class="mb-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
		/>
		<p class="text-center text-sm text-gray-500">
			Có thể tìm kiếm theo tên, mã sinh viên, mã hồ sơ, hoặc tên chứng chỉ.
		</p>
	</div>
</div>
