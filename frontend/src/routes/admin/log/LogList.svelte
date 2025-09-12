<script>
	import { createEventDispatcher } from 'svelte';
	import { Eye, ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let logs = [];
	export let pagination = { current: 1, pageSize: 10, total: 0 };

	const dispatch = createEventDispatcher();

	$: totalPages = Math.ceil(pagination.total / pagination.pageSize);

	function getPagesToShow(current, total) {
		const delta = 2;
		const pages = [];
		for (let i = 1; i <= total; i++) {
			if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) pages.push(i);
		}
		const result = [];
		let last = 0;
		for (const page of pages) {
			if (page - last > 1) result.push('...');
			result.push(page);
			last = page;
		}
		return result;
	}

	function handleView(log) {
		dispatch('view', log);
	}

	// Chuẩn hóa hiển thị tên user ngay trong component
	const getUserName = (log) => {
		if (log.user) return `${log.user.lastname || ''} ${log.user.firstname || ''}`.trim();
		if (log.displayUserName) return log.displayUserName;
		if (log.userName) return log.userName;
		return log.userId;
	};
</script>

<table class="w-full border-collapse overflow-hidden rounded-lg text-sm">
	<thead class="bg-gray-50 text-gray-700">
		<tr>
			<th class="px-2 py-3 text-left">STT</th>
			<th class="px-4 py-3 text-left">User</th>
			<th class="px-4 py-3 text-left">Hành động</th>
			<th class="px-4 py-3 text-left">Target</th>
			<th class="px-4 py-3 text-left">Thời gian</th>
			<th class="px-4 py-3 text-center">Hành động</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-gray-100">
		{#each logs as log, index}
			<tr class="hover:bg-gray-50">
				<td class="px-4 py-3 text-center">
					{(pagination.current - 1) * pagination.pageSize + index + 1}
				</td>
				<td class="px-4 py-3">{getUserName(log)}</td>
				<td class="px-4 py-3">{log.action}</td>
				<td class="px-4 py-3">{log.targetType} - {log.targetId}</td>
				<td class="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
				<td class="px-4 py-3 text-center">
					<button
						class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
						on:click={() => handleView(log)}
						title="Chi tiết"
					>
						<Eye class="h-4 w-4" />
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div class="mt-4 flex items-center justify-between text-sm">
	<span class="text-gray-600">Trang {pagination.current} / {totalPages}</span>
	<div class="flex items-center gap-1">
		<button
			class="flex items-center rounded-full border border-gray-300 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
			on:click={() => dispatch('pageChange', pagination.current - 1)}
			disabled={pagination.current <= 1}
		>
			<ChevronLeft class="h-4 w-4" />
		</button>
		{#each getPagesToShow(pagination.current, totalPages) as page}
			{#if page === '...'}
				<span class="px-2 text-gray-400">...</span>
			{:else}
				<button
					class={`rounded-full border px-3 py-1.5 ${pagination.current === page ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 hover:bg-gray-100'}`}
					on:click={() => dispatch('pageChange', page)}
				>
					{page}
				</button>
			{/if}
		{/each}
		<button
			class="flex items-center rounded-full border border-gray-300 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
			on:click={() => dispatch('pageChange', pagination.current + 1)}
			disabled={pagination.current >= totalPages}
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
</div>
