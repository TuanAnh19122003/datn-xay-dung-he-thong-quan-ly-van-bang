<script>
	import { createEventDispatcher } from 'svelte';
	import { Eye, Pencil, Trash2, FileText, ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data = [];
	export let pagination = { current: 1, pageSize: 5, total: 0 };

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

	function handleView(student) {
		dispatch('view', student);
	}
	function handleEdit(student) {
		dispatch('edit', student);
	}
	function handleDelete(id) {
		if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) dispatch('delete', id);
	}
	function handleViewCerts(student) {
		dispatch('viewCerts', student.code); // gửi code sinh viên
	}

	const genderMap = {
		male: 'Nam',
		female: 'Nữ',
		other: 'Khác'
	};

	function displayGender(gender) {
		return genderMap[gender] || '-';
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
	<table class="w-full border-collapse text-sm">
		<thead class="bg-gray-50 text-gray-700">
			<tr>
				<th class="px-2 py-3 text-left">STT</th>
				<th class="px-4 py-3 text-left">Ảnh</th>
				<th class="px-4 py-3 text-left">Mã SV</th>
				<th class="px-4 py-3 text-left">Họ tên</th>
				<th class="px-4 py-3 text-left">Email</th>
				<th class="px-4 py-3 text-left">SĐT</th>
				<th class="px-4 py-3 text-left">Ngày sinh</th>
				<th class="px-4 py-3 text-left">Giới tính</th>
				<th class="px-4 py-3 text-left">Ngành học</th>
				<th class="px-4 py-3 text-left">GPA</th>
				<th class="px-4 py-3 text-center">Hành động</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100">
			{#each data as student, index}
				<tr class="hover:bg-gray-50">
					<td class="px-2 py-3 text-center"
						>{(pagination.current - 1) * pagination.pageSize + index + 1}</td
					>
					<td class="px-4 py-3">
						{#if student.image}
							<img
								src={`http://localhost:5000/${student.image}`}
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
					<td>{student.code}</td>
					<td>{student.lastname} {student.firstname}</td>
					<td>{student.email || '-'}</td>
					<td>{student.phone || '-'}</td>
					<td>{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</td>
					<td>{displayGender(student.gender)}</td>
					<td>{student.major ? student.major.name : student.majorId}</td>
					<td>{student.gpa ?? '-'}</td>
					<td class="px-4 py-3 text-center">
						<div class="flex justify-center gap-2">
							<button
								class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
								on:click={() => handleView(student)}
								title="Chi tiết"
							>
								<Eye class="h-4 w-4" />
							</button>
							<button
								class="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
								on:click={() => handleEdit(student)}
								title="Chỉnh sửa"
							>
								<Pencil class="h-4 w-4" />
							</button>
							<button
								class="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
								on:click={() => handleDelete(student.id)}
								title="Xóa"
							>
								<Trash2 class="h-4 w-4" />
							</button>
							<button
								class="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
								on:click={() => handleViewCerts(student)}
								title="Xem chứng chỉ"
							>
								<FileText class="h-4 w-4" />
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
					on:click={() => dispatch('pageChange', page)}>{page}</button
				>
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
