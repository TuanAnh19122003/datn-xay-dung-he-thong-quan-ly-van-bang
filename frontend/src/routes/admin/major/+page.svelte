<script>
	import MajorForm from './MajorForm.svelte';
	import MajorList from './MajorList.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Plus, Pencil, Eye, Loader2, Inbox } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let majors = [];
	let pagination = { current: 1, pageSize: 5, total: 0 };
	let search = '';
	let openForm = false;
	let editingMajor = null;
	let viewingMajor = null;
	let loading = false;

	const API_URL = import.meta.env.VITE_API_URL;

	function getAuthHeader() {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	async function fetchData(page = 1, pageSize = 5, keyword = search) {
		loading = true;
		try {
			let response;

			if (keyword && keyword.trim() !== '') {
				response = await axios.get(`${API_URL}/majors/search`, {
					params: { q: keyword, page, pageSize }
				});
			} else {
				response = await axios.get(`${API_URL}/majors`, {
					params: { page, pageSize }
				});
			}

			const { data, total } = response.data;
			majors = data;
			pagination = { current: page, pageSize, total };
		} catch (e) {
			console.error(e);
			toast.error('Lỗi khi tải danh sách chuyên ngành!');
		} finally {
			loading = false;
		}
	}

	onMount(fetchData);

	function handleAdd() {
		editingMajor = null;
		openForm = true;
	}
	function handleEdit(major) {
		editingMajor = major;
		openForm = true;
	}
	function handleView(major) {
		viewingMajor = major;
	}

	async function handleDelete(id) {
		try {
			await axios.delete(`${API_URL}/majors/${id}`, {
				headers: getAuthHeader()
			});
			const newPage =
				majors.length === 1 && pagination.current > 1
					? pagination.current - 1
					: pagination.current;

			await fetchData(newPage, pagination.pageSize);
			toast.success('Xóa thành công');
		} catch {
			toast.error('Thao tác thất bại');
		}
	}

	async function handleSubmit(major) {
		try {
			if (editingMajor) {
				await axios.put(`${API_URL}/majors/${editingMajor.id}`, major, {
					headers: getAuthHeader()
				});
				toast.success('Cập nhật chuyên ngành thành công');
			} else {
				await axios.post(`${API_URL}/majors`, major, {
					headers: getAuthHeader()
				});
				toast.success('Thêm chuyên ngành thành công');
			}

			openForm = false;
			fetchData(1, pagination.pageSize);
		} catch (err) {
			console.error(err);
			toast.error('Thao tác thất bại');
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="flex items-center gap-2 text-2xl font-semibold">
			<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 7h18M3 12h18M3 17h18"
				/>
			</svg>
			Danh sách chuyên ngành
		</h2>
		<div class="flex gap-3">
			<input
				placeholder="Tìm kiếm chuyên ngành..."
				bind:value={search}
				on:input={() => fetchData(1, pagination.pageSize, search)}
				class="w-64 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
			/>
			<button
				class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
				on:click={handleAdd}
			>
				<Plus class="h-4 w-4" /> Thêm
			</button>
		</div>
	</div>

	<!-- List -->
	{#if loading}
		<div class="py-10 text-center text-gray-500">Đang tải...</div>
	{:else}
		<MajorList
			data={majors}
			{pagination}
			on:edit={(e) => handleEdit(e.detail)}
			on:view={(e) => handleView(e.detail)}
			on:delete={(e) => handleDelete(e.detail)}
			on:pageChange={(e) => fetchData(e.detail, pagination.pageSize)}
		/>
	{/if}

	<!-- Modal Form -->
	{#if openForm}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="animate-fade-in w-[420px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					{#if editingMajor}
						<Pencil class="h-5 w-5 text-blue-600" /> Cập nhật chuyên ngành
					{:else}
						<Plus class="h-5 w-5 text-blue-600" /> Thêm chuyên ngành
					{/if}
				</h3>
				<MajorForm
					initialValues={editingMajor}
					on:submit={(e) => handleSubmit(e.detail)}
					on:cancel={() => (openForm = false)}
				/>
			</div>
		</div>
	{/if}

	<!-- Modal View -->
	{#if viewingMajor}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="animate-fade-in w-[420px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					<Eye class="h-5 w-5 text-blue-600" /> Chi tiết chuyên ngành
				</h3>
				<div class="space-y-2 text-gray-700">
					<p><strong>ID:</strong> {viewingMajor.id}</p>
					<p><strong>Tên chuyên ngành:</strong> {viewingMajor.name}</p>
					<p><strong>Ngày tạo:</strong> {new Date(viewingMajor.createdAt).toLocaleString()}</p>
					<p><strong>Ngày cập nhật:</strong> {new Date(viewingMajor.updatedAt).toLocaleString()}</p>
				</div>
				<div class="mt-4 text-right">
					<button
						class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
						on:click={() => (viewingMajor = null)}
					>
						Đóng
					</button>
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
