<script>
	import StudentList from './StudentList.svelte';
	import StudentForm from './StudentForm.svelte';
	import CertListModal from './CertListModal.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Plus, Pencil, Eye } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let students = [];
	let pagination = { current: 1, pageSize: 5, total: 0 };
	let search = '';
	let openForm = false;
	let editingStudent = null;
	let viewingStudent = null;
	let loading = false;

	// Modal chứng chỉ
	let openCertsModal = false;
	let selectedStudentCode = null;

	const API_URL = import.meta.env.VITE_API_URL;

	function getAuthHeader() {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	// Lấy danh sách sinh viên
	async function fetchData(page = 1, pageSize = 5, keyword = search) {
		loading = true;
		try {
			let response;
			if (keyword && keyword.trim() !== '') {
				response = await axios.get(`${API_URL}/students/search`, {
					params: { q: keyword, page, pageSize }
				});
			} else {
				response = await axios.get(`${API_URL}/students`, { params: { page, pageSize } });
			}

			// Chuẩn hóa dữ liệu major
			students = response.data.data.map(student => {
				return {
					...student,
					major: student.major || (student.majorName ? { name: student.majorName, code: student.majorCode } : null)
				};
			});

			pagination = {
				current: page,
				pageSize,
				total: response.data.total ?? students.length
			};
		} catch (e) {
			toast.error('Lỗi khi tải danh sách sinh viên!');
		} finally {
			loading = false;
		}
	}

	onMount(fetchData);

	// Form Thêm/Cập nhật
	function handleAdd() {
		editingStudent = null;
		openForm = true;
	}
	function handleEdit(student) {
		editingStudent = student;
		openForm = true;
	}
	async function handleSubmit(student) {
		try {
			const formData = new FormData();
			Object.entries(student).forEach(([key, value]) => {
				if (value !== null && value !== undefined) formData.append(key, value);
			});

			if (editingStudent) {
				await axios.put(`${API_URL}/students/${editingStudent.id}`, formData, {
					headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
				});
				toast.success('Cập nhật sinh viên thành công');
			} else {
				await axios.post(`${API_URL}/students`, formData, {
					headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
				});
				toast.success('Thêm sinh viên thành công');
			}
			openForm = false;
			fetchData(1, pagination.pageSize);
		} catch (err) {
			toast.error('Lưu thất bại');
		}
	}

	// Xem chi tiết
	function handleView(student) {
		viewingStudent = student;
	}

	// Xóa sinh viên
	async function handleDelete(id) {
		try {
			await axios.delete(`${API_URL}/students/${id}`, { headers: getAuthHeader() });
			const newPage =
				students.length === 1 && pagination.current > 1
					? pagination.current - 1
					: pagination.current;
			await fetchData(newPage, pagination.pageSize);
			toast.success('Xóa thành công');
		} catch {
			toast.error('Xóa thất bại');
		}
	}

	// Xem chứng chỉ
	function handleViewCerts(code) {
		selectedStudentCode = code;
		openCertsModal = true;
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

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="flex items-center gap-2 text-2xl font-semibold">
			<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/>
			</svg>
			Danh sách sinh viên
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
		<StudentList
			data={students}
			{pagination}
			on:edit={(e) => handleEdit(e.detail)}
			on:view={(e) => handleView(e.detail)}
			on:delete={(e) => handleDelete(e.detail)}
			on:viewCerts={(e) => handleViewCerts(e.detail)}
			on:pageChange={(e) => fetchData(e.detail, pagination.pageSize)}
		/>
	{/if}

	<!-- Modal Thêm/Cập nhật -->
	{#if openForm}
		<div class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/40 p-4">
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-lg font-bold">
					{editingStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
				</h3>
				<StudentForm
					initialValues={editingStudent || {}}
					on:submit={(e) => handleSubmit(e.detail)}
					on:cancel={() => (openForm = false)}
				/>
			</div>
		</div>
	{/if}

	<!-- Modal Chi tiết sinh viên -->
	{#if viewingStudent}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
				<div class="flex items-center justify-between bg-blue-600 px-6 py-4">
					<h3 class="flex items-center gap-2 text-lg font-semibold text-white">
						<Eye class="h-5 w-5" /> Chi tiết sinh viên
					</h3>
					<button
						class="rounded-lg px-3 py-1 text-white hover:bg-blue-700"
						on:click={() => (viewingStudent = null)}
					>
						Đóng
					</button>
				</div>
				<div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
					<div class="flex justify-center md:justify-start">
						{#if viewingStudent.image}
							<img
								src={`http://localhost:5000/${viewingStudent.image}`}
								alt="avatar"
								class="h-50 w-50 rounded-xl object-cover shadow"
							/>
						{:else}
							<div class="flex h-48 w-48 items-center justify-center rounded-xl bg-gray-200 text-gray-500 shadow">
								No Image
							</div>
						{/if}
					</div>
					<div class="space-y-3 text-gray-700 md:col-span-2">
						<div class="flex justify-between"><span class="font-medium">Mã SV:</span><span>{viewingStudent.code}</span></div>
						<div class="flex justify-between"><span class="font-medium">Họ tên:</span><span>{viewingStudent.lastname} {viewingStudent.firstname}</span></div>
						<div class="flex justify-between"><span class="font-medium">Email:</span><span>{viewingStudent.email || '-'}</span></div>
						<div class="flex justify-between"><span class="font-medium">SĐT:</span><span>{viewingStudent.phone || '-'}</span></div>
						<div class="flex justify-between"><span class="font-medium">Ngày sinh:</span><span>{viewingStudent.dob ? new Date(viewingStudent.dob).toLocaleDateString() : '-'}</span></div>
						<div class="flex justify-between"><span class="font-medium">Giới tính:</span><span>{displayGender(viewingStudent.gender)}</span></div>
						<div class="flex justify-between"><span class="font-medium">Địa chỉ:</span><span>{viewingStudent.address || '-'}</span></div>
						<div class="flex justify-between"><span class="font-medium">Ngành học:</span><span>{viewingStudent.major?.name || '-'}</span></div>
						<div class="flex justify-between">
							<span class="font-medium">GPA:</span>
							<span>{viewingStudent.gpa ?? '-'}</span>
						</div>
						<div class="flex justify-between"><span class="font-medium">Ngày tạo:</span><span>{new Date(viewingStudent.createdAt).toLocaleString()}</span></div>
						<div class="flex justify-between"><span class="font-medium">Ngày cập nhật:</span><span>{new Date(viewingStudent.updatedAt).toLocaleString()}</span></div>
					</div>
				</div>
				<div class="flex justify-end px-6 pb-6">
					<button class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300" on:click={() => (viewingStudent = null)}>Đóng</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Modal Xem chứng chỉ -->
	<CertListModal
		open={openCertsModal}
		studentCode={selectedStudentCode}
		on:close={() => (openCertsModal = false)}
	/>
</div>
