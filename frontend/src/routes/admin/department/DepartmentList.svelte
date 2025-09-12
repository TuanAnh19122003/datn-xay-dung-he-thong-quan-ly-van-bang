<script>
	import { createEventDispatcher } from 'svelte';
	import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data = [];
	export let pagination = { current: 1, pageSize: 5, total: 0 };

	const dispatch = createEventDispatcher();

	function handleView(department) {
		dispatch('view', department);
	}
	function handleEdit(department) {
		dispatch('edit', department);
	}
	function handleDelete(id) {
		if (confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
			dispatch('delete', id);
		}
	}

	$: totalPages = Math.ceil(pagination.total / pagination.pageSize);

	function getPagesToShow(current, total) {
		const delta = 2;
		const pages = [];

		for (let i = 1; i <= total; i++) {
			if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
				pages.push(i);
			}
		}

		// thêm dấu "..." nếu có khoảng cách
		const result = [];
		let last = 0;

		for (const page of pages) {
			if (page - last > 1) {
				result.push('...');
			}
			result.push(page);
			last = page;
		}

		return result;
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
	<table class="w-full border-collapse text-sm">
		<thead class="bg-gray-50 text-gray-700">
			<tr>
				<th class="px-2 py-3 text-left font-medium">STT</th>
				<th class="px-4 py-3 text-left font-medium">Mã vai trò</th>
				<th class="px-4 py-3 text-left font-medium">Tên vai trò</th>
				<th class="px-4 py-3 text-center font-medium">Hành động</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100">
			{#each data as department, index}
				<tr class="transition-colors hover:bg-gray-50">
					<td class="px-4 py-3 text-center text-gray-600">
						{(pagination.current - 1) * pagination.pageSize + index + 1}
					</td>
					<td class="px-4 py-3 font-mono text-blue-600">{department.code}</td>
					<td class="px-4 py-3">{department.name}</td>

					<td class="px-4 py-3 text-center">
						<div class="flex justify-center gap-2">
							<!-- View -->
							<button
								class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
								on:click={() => handleView(department)}
								title="Chi tiết"
							>
								<Eye class="h-4 w-4 text-gray-700" />
							</button>

							<!-- Edit -->
							<button
								class="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
								on:click={() => handleEdit(department)}
								title="Chỉnh sửa"
							>
								<Pencil class="h-4 w-4" />
							</button>

							<!-- Delete -->
							<button
								class="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
								on:click={() => handleDelete(department.id)}
								title="Xóa"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Pagination -->
<div class="mt-4 flex items-center justify-between text-sm">
	<span class="text-gray-600">Trang {pagination.current} / {totalPages}</span>

	<div class="flex items-center gap-1">
		<!-- Prev -->
		<button
			class="flex items-center rounded-full border border-gray-300 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
			on:click={() => dispatch('pageChange', pagination.current - 1)}
			disabled={pagination.current <= 1}
		>
			<ChevronLeft class="h-4 w-4" />
		</button>

		<!-- Page numbers with ellipsis -->
		{#each getPagesToShow(pagination.current, totalPages) as page}
			{#if page === '...'}
				<span class="px-2 text-gray-400">...</span>
			{:else}
				<button
					class={`rounded-full px-3 py-1.5 border ${
						pagination.current === page
							? 'bg-blue-500 text-white border-blue-500'
							: 'border-gray-300 hover:bg-gray-100'
					}`}
					on:click={() => dispatch('pageChange', page)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Next -->
		<button
			class="flex items-center rounded-full border border-gray-300 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
			on:click={() => dispatch('pageChange', pagination.current + 1)}
			disabled={pagination.current >= totalPages}
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
</div>
