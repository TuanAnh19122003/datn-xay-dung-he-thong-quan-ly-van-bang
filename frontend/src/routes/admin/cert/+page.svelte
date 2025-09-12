<script>
	import CertList from './CertList.svelte';
	import CertForm from './CertForm.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Plus, Pencil, Eye } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let certs = [];
	let pagination = { current: 1, pageSize: 5, total: 0 };
	let search = '';
	let openForm = false;
	let editingCert = null;
	let viewingCert = null;
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
				response = await axios.get(`${API_URL}/certs/search`, {
					params: { q: keyword, page, pageSize }
				});
			} else {
				response = await axios.get(`${API_URL}/certs`, { params: { page, pageSize } });
			}

			certs = response.data.data.map((cert) => ({
				...cert,
				templateName: cert.templateName || (cert.template ? cert.template.name : null),
				studentName:
					cert.studentName ||
					(cert.student ? `${cert.student.lastname} ${cert.student.firstname}` : null),
				studentCode: cert.studentCode || (cert.student ? cert.student.code : null)
			}));

			pagination = { current: page, pageSize, total: response.data.total ?? certs.length };
		} catch (e) {
			toast.error('Lỗi khi tải danh sách chứng chỉ!');
		} finally {
			loading = false;
		}
	}

	onMount(fetchData);

	function handleAdd() {
		editingCert = null;
		openForm = true;
	}
	function handleEdit(cert) {
		editingCert = cert;
		openForm = true;
	}
	function handleView(cert) {
		viewingCert = cert;
	}
	async function handleDelete(id) {
		try {
			await axios.delete(`${API_URL}/certs/${id}`, { headers: getAuthHeader() });
			const newPage =
				certs.length === 1 && pagination.current > 1 ? pagination.current - 1 : pagination.current;
			await fetchData(newPage, pagination.pageSize);
			toast.success('Xóa thành công');
		} catch {
			toast.error('Xóa thất bại');
		}
	}

	// ✅ Hàm submit đã hoàn chỉnh
	async function handleSubmit(cert) {
		try {
			let payload;
			let headers = { ...getAuthHeader() };

			if (cert.fileUrl instanceof File) {
				// Nếu có file upload
				payload = new FormData();
				Object.entries(cert).forEach(([key, value]) => {
					if (value !== null && value !== undefined && value !== '') {
						payload.append(key, value);
					}
				});
				headers['Content-Type'] = 'multipart/form-data';
			} else {
				// Không có file, gửi JSON
				payload = {};
				Object.entries(cert).forEach(([key, value]) => {
					if (value !== null && value !== undefined && value !== '') {
						payload[key] = value;
					}
				});
			}

			if (editingCert) {
				await axios.put(`${API_URL}/certs/${editingCert.id}`, payload, { headers });
				toast.success('Cập nhật chứng chỉ thành công');
			} else {
				await axios.post(`${API_URL}/certs`, payload, { headers });
				toast.success('Thêm chứng chỉ thành công');
			}
			openForm = false;
			fetchData(1, pagination.pageSize);
		} catch (err) {
			console.error('❌ Lỗi lưu chứng chỉ:', err);
			toast.error('Lưu thất bại');
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
			Danh sách chứng chỉ
		</h2>
		<div class="flex gap-3">
			<input
				placeholder="Tìm kiếm..."
				bind:value={search}
				on:input={() => fetchData(1, pagination.pageSize, search)}
				class="w-64 rounded-lg border px-3 py-2"
			/>
			<button
				class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				on:click={handleAdd}
			>
				<Plus class="h-4 w-4" /> Thêm
			</button>
		</div>
	</div>

	{#if loading}
		<div class="py-10 text-center text-gray-500">Đang tải...</div>
	{:else}
		<CertList
			data={certs}
			{pagination}
			on:edit={(e) => handleEdit(e.detail)}
			on:view={(e) => handleView(e.detail)}
			on:delete={(e) => handleDelete(e.detail)}
			on:pageChange={(e) => fetchData(e.detail, pagination.pageSize)}
		/>
	{/if}

	{#if openForm}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="w-[480px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					{#if editingCert}
						<Pencil class="h-5 w-5 text-blue-600" /> Cập nhật chứng chỉ
					{:else}
						<Plus class="h-5 w-5 text-blue-600" /> Thêm chứng chỉ
					{/if}
				</h3>
				<CertForm
					initialValues={editingCert || {}}
					on:submit={(e) => handleSubmit(e.detail)}
					on:cancel={() => (openForm = false)}
				/>
			</div>
		</div>
	{/if}

	{#if viewingCert}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="w-[600px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					<Eye class="h-5 w-5 text-blue-600" /> Chi tiết chứng chỉ
				</h3>

				<div class="space-y-2 text-gray-700">
					<p><strong>Số hiệu:</strong> {viewingCert.number}</p>
					<p><strong>Loại:</strong> {viewingCert.type}</p>
					<p>
						<strong>Sinh viên:</strong>
						{viewingCert.studentName || '-'}
						{#if viewingCert.studentCode}
							({viewingCert.studentCode})
						{/if}
					</p>
					<p><strong>Template:</strong> {viewingCert.templateName || '-'}</p>
					<p><strong>Ngày tốt nghiệp:</strong> {viewingCert.gradDate || '-'}</p>
					<p><strong>Cơ quan cấp:</strong> {viewingCert.issuer}</p>
					<p><strong>Trạng thái:</strong> {viewingCert.status}</p>

					{#if viewingCert.fileUrl}
						<p>
							<strong>File:</strong>
							<a
								href={`${API_URL}/${viewingCert.fileUrl}`}
								target="_blank"
								class="text-blue-600 underline"
							>
								Xem / tải xuống
							</a>
						</p>
					{/if}

					{#if viewingCert.createdAt}
						<p><strong>Ngày tạo:</strong> {new Date(viewingCert.createdAt).toLocaleString()}</p>
					{/if}
					{#if viewingCert.updatedAt}
						<p>
							<strong>Ngày cập nhật:</strong>
							{new Date(viewingCert.updatedAt).toLocaleString()}
						</p>
					{/if}
				</div>

				<div class="mt-6 text-right">
					<button
						class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
						on:click={() => (viewingCert = null)}
					>
						Đóng
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
