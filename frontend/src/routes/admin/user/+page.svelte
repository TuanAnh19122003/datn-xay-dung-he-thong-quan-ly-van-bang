<script>
	import UserList from './UserList.svelte';
	import UserForm from './UserForm.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Plus, Pencil, Eye } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let users = [];
	let pagination = { current: 1, pageSize: 5, total: 0 };
	let search = '';
	let openForm = false;
	let editingUser = null;
	let viewingUser = null;
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
				response = await axios.get(`${API_URL}/users/search`, {
					params: { q: keyword, page, pageSize }
				});
			} else {
				response = await axios.get(`${API_URL}/users`, { params: { page, pageSize } });
			}

			// Chuẩn hóa role
			users = response.data.data.map(user => ({
				...user,
				role: user.role || (user.roleName ? { name: user.roleName, code: user.roleCode } : null)
			}));

			pagination = { current: page, pageSize, total: response.data.total ?? users.length };
		} catch (e) {
			toast.error('Lỗi khi tải danh sách user!');
		} finally {
			loading = false;
		}
	}

	onMount(fetchData);

	function handleAdd() {
		editingUser = null;
		openForm = true;
	}
	function handleEdit(user) {
		editingUser = user;
		openForm = true;
	}
	function handleView(user) {
		viewingUser = user;
	}
	async function handleDelete(id) {
		try {
			await axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
			const newPage =
				users.length === 1 && pagination.current > 1
					? pagination.current - 1
					: pagination.current;

			await fetchData(newPage, pagination.pageSize);
            toast.success('Xóa thành công');
		} catch {
			toast.error('Xóa thất bại');
		}
	}

	async function handleSubmit(user) {
		try {
			const formData = new FormData();
			Object.entries(user).forEach(([key, value]) => {
				if (value !== null && value !== undefined) formData.append(key, value);
			});

			if (editingUser) {
				await axios.put(`${API_URL}/users/${editingUser.id}`, formData, {
					headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
				});
				toast.success('Cập nhật user thành công');
			} else {
				await axios.post(`${API_URL}/users`, formData, {
					headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
				});
				toast.success('Thêm người dùng thành công');
			}
			openForm = false;
			fetchData(1, pagination.pageSize);
		} catch (err) {
			toast.error('Lưu thất bại');
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="flex items-center gap-2 text-2xl font-semibold">
			<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/>
			</svg>
			Danh sách người dùng
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
		<UserList
			data={users}
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
					{#if editingUser}
						<Pencil class="h-5 w-5 text-blue-600" /> Cập nhật người dùng
					{:else}
						<Plus class="h-5 w-5 text-blue-600" /> Thêm người dùng
					{/if}
				</h3>
				<UserForm
					initialValues={editingUser || {}}
					on:submit={(e) => handleSubmit(e.detail)}
					on:cancel={() => (openForm = false)}
				/>
			</div>
		</div>
	{/if}

	{#if viewingUser}
		<div class="fixed inset-0 flex items-center justify-center bg-black/40">
			<div class="w-[600px] rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
					<Eye class="h-5 w-5 text-blue-600" /> Chi tiết người dùng
				</h3>

				<div class="flex items-start gap-6">
					{#if viewingUser.image}
						<img
							src={`http://localhost:5000/${viewingUser.image}`}
							alt="avatar"
							class="h-[200px] w-[200px] rounded-[10px] border object-cover"
						/>
					{:else}
						<div class="flex h-[200px] w-[200px] items-center justify-center rounded-[10px] bg-gray-200 text-gray-500">
							No Image
						</div>
					{/if}

					<div class="flex-1 space-y-2 text-gray-700">
						<p><strong>Họ tên:</strong> {viewingUser.lastname} {viewingUser.firstname}</p>
						<p><strong>Email:</strong> {viewingUser.email}</p>
						<p><strong>SĐT:</strong> {viewingUser.phone || '-'}</p>
						<p><strong>Vai trò:</strong> {viewingUser.role?.name || '-'}</p>
						<p><strong>Trạng thái:</strong> {viewingUser.is_active ? 'Kích hoạt' : 'Khoá'}</p>
						<p><strong>Ngày tạo:</strong> {new Date(viewingUser.createdAt).toLocaleString()}</p>
						<p><strong>Ngày cập nhật:</strong> {new Date(viewingUser.updatedAt).toLocaleString()}</p>
					</div>
				</div>

				<div class="mt-6 text-right">
					<button class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300" on:click={() => (viewingUser = null)}>Đóng</button>
				</div>
			</div>
		</div>
	{/if}
</div>
