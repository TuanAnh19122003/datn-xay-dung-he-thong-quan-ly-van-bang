<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { Eye, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import LogList from './LogList.svelte';

	let logs = [];
	let pagination = { current: 1, pageSize: 10, total: 0 };
	let search = '';
	let viewingLog = null;
	let loading = false;

	const API_URL = import.meta.env.VITE_API_URL;

	function getAuthHeader() {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	async function fetchLogs(page = 1, pageSize = 10, keyword = search) {
		loading = true;
		try {
			const response = keyword.trim()
				? await axios.get(`${API_URL}/logs/search`, {
						params: { q: keyword, page, pageSize },
						headers: getAuthHeader()
					})
				: await axios.get(`${API_URL}/logs`, {
						params: { page, pageSize },
						headers: getAuthHeader()
					});

			const { data, total } = response.data;
			logs = data;
			pagination = { current: page, pageSize, total };
		} catch (err) {
			console.error(err);
			toast.error('Lỗi khi tải log!');
		} finally {
			loading = false;
		}
	}

	onMount(fetchLogs);

	function handleView(log) {
		viewingLog = log;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="flex items-center gap-2 text-2xl font-semibold">
			<Loader2 class="h-6 w-6 text-blue-600" /> Lịch sử hoạt động
		</h2>
		<input
			placeholder="Tìm kiếm log..."
			bind:value={search}
			on:input={() => fetchLogs(1, pagination.pageSize, search)}
			class="w-64 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	{#if loading}
		<div class="py-10 text-center text-gray-500">Đang tải...</div>
	{:else}
		<LogList
			{logs}
			{pagination}
			on:view={(e) => handleView(e.detail)}
			on:pageChange={(e) => fetchLogs(e.detail, pagination.pageSize)}
		/>
	{/if}

	{#if viewingLog}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="animate-fade-in w-[420px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					<Eye class="h-5 w-5 text-blue-600" /> Chi tiết log
				</h3>
				<div class="space-y-2 text-gray-700">
					<p><strong>ID:</strong> {viewingLog.id}</p>
					<p><strong>User:</strong> {viewingLog.user ? `${viewingLog.user.lastname} ${viewingLog.user.firstname}` : viewingLog.userId}</p>
					<p><strong>Hành động:</strong> {viewingLog.action}</p>
					<p><strong>Target:</strong> {viewingLog.targetType} - {viewingLog.targetId}</p>
					<p><strong>IP:</strong> {viewingLog.ip}</p>
					<p><strong>Thời gian:</strong> {new Date(viewingLog.createdAt).toLocaleString()}</p>
				</div>
				<div class="mt-4 text-right">
					<button
						class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
						on:click={() => (viewingLog = null)}>Đóng</button
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.animate-fade-in {
		animation: fade-in 0.25s ease-out;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
