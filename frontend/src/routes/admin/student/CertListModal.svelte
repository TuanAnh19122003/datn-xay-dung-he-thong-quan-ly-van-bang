<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import axios from 'axios';
	import { X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let open = false;
	export let studentCode = null;

	const dispatch = createEventDispatcher();
	let certs = [];
	let loading = false;

	const API_URL = import.meta.env.VITE_API_URL;

	async function fetchCerts() {
		if (!studentCode) return;
		loading = true;
		try {
			const response = await axios.get(`${API_URL}/students/${studentCode}/certs`);
			certs = response.data.data || [];
		} catch (err) {
			toast.error('Không thể tải danh sách văn bằng');
		} finally {
			loading = false;
		}
	}

	$: if (open) fetchCerts();

	function closeModal() {
		dispatch('close');
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-3xl rounded-xl bg-white shadow-lg">
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h3 class="text-lg font-semibold">Danh sách văn bằng</h3>
				<button class="text-gray-600 hover:text-gray-800" on:click={closeModal}><X class="h-5 w-5"/></button>
			</div>
			<div class="p-6">
				{#if loading}
					<div class="text-center text-gray-500">Đang tải...</div>
				{:else if certs.length === 0}
					<div class="text-center text-gray-500">Không có văn bằng nào</div>
				{:else}
					<table class="w-full text-sm border-collapse">
						<thead class="bg-gray-50 text-gray-700">
							<tr>
								<th class="px-3 py-2 text-left">Mã</th>
								<th class="px-3 py-2 text-left">Tên sinh viên</th>
								<th class="px-3 py-2 text-left">Ngành</th>
								<th class="px-3 py-2 text-left">Loại</th>
								<th class="px-3 py-2 text-left">Số</th>
								<th class="px-3 py-2 text-left">Ngày tốt nghiệp</th>
								<th class="px-3 py-2 text-left">Người cấp</th>
								<th class="px-3 py-2 text-left">Template</th>
								<th class="px-3 py-2 text-left">File</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each certs as cert}
								<tr>
									<td class="px-3 py-2">{cert.student.code}</td>
									<td class="px-3 py-2">{cert.student.lastname} {cert.student.firstname}</td>
									<td class="px-3 py-2">{cert.student.major?.name || '-'}</td>
									<td class="px-3 py-2">{cert.type}</td>
									<td class="px-3 py-2">{cert.number}</td>
									<td class="px-3 py-2">{new Date(cert.gradDate).toLocaleDateString()}</td>
									<td class="px-3 py-2">{cert.issuer}</td>
									<td class="px-3 py-2">{cert.template?.name || '-'}</td>
									<td class="px-3 py-2">
										{#if cert.fileUrl}
											<a href={`http://localhost:5000/${cert.fileUrl}`} target="_blank" class="text-blue-600 hover:underline">Xem</a>
										{:else}
											-
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
			<div class="flex justify-end border-t px-6 py-4">
				<button class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300" on:click={closeModal}>Đóng</button>
			</div>
		</div>
	</div>
{/if}
