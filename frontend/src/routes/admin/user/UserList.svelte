<script>
	import { createEventDispatcher } from 'svelte';
	import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data = [];
	export let pagination = { current: 1, pageSize: 5, total: 0 };

	const API_URL = import.meta.env.VITE_API_URL;

	const dispatch = createEventDispatcher();

	function handleView(user) {
		dispatch('view', user);
	}
	function handleEdit(user) {
		dispatch('edit', user);
	}
	function handleDelete(id) {
		if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
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
		const result = [];
		let last = 0;
		for (const page of pages) {
			if (page - last > 1) result.push('...');
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
				<th class="px-2 py-3 text-left">STT</th>
				<th class="px-4 py-3 text-left">Ảnh</th>
				<th class="px-4 py-3 text-left">Họ tên</th>
				<th class="px-4 py-3 text-left">Email</th>
				<th class="px-4 py-3 text-left">SĐT</th>
				<th class="px-4 py-3 text-left">Vai trò</th>
				<th class="px-4 py-3 text-center">Hành động</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100">
			{#each data as user, index}
				<tr class="hover:bg-gray-50">
					<td class="px-2 py-3 text-center"
						>{(pagination.current - 1) * pagination.pageSize + index + 1}</td
					>
					<td class="px-4 py-3">
						{#if user.image}
							<img
								src={`http://localhost:5000/${user.image}`}
								alt="avatar"
								class="h-[100px] w-[100px] rounded-[10px] object-cover"
							/>
						{:else}
							<div
								class="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-gray-200 text-gray-500"
							>
								?
							</div>
						{/if}
					</td>

					<td class="px-4 py-3">{user.lastname} {user.firstname}</td>
					<td class="px-4 py-3">{user.email}</td>
					<td class="px-4 py-3">{user.phone || '-'}</td>
					<td>
						{user.role ? `${user.role.name}` : user.roleId}
					</td>
					<td class="px-4 py-3 text-center">
						<div class="flex justify-center gap-2">
							<button
								class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
								on:click={() => handleView(user)}
							>
								<Eye class="h-4 w-4" />
							</button>
							<button
								class="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
								on:click={() => handleEdit(user)}
							>
								<Pencil class="h-4 w-4" />
							</button>
							<button
								class="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
								on:click={() => handleDelete(user.id)}
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
				<span class="px-2">...</span>
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
