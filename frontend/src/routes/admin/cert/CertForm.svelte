<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import axios from 'axios';

	export let initialValues = {
		studentId: '',
		templateId: '',
		type: 'BA',
		number: '',
		gradDate: '',
		issuer: 'ĐH Điện lực',
		status: 'draft',
	};

	const dispatch = createEventDispatcher();
	let formData = { ...initialValues };

	let students = [];
	let templates = [];

	const API_URL = import.meta.env.VITE_API_URL;

	onMount(async () => {
		try {
			// Gọi API lấy danh sách sinh viên
			const svRes = await axios.get(`${API_URL}/students`);
			students = svRes.data.data;

			// Gọi API lấy danh sách template
			const tplRes = await axios.get(`${API_URL}/templates`);
			templates = tplRes.data.data;
		} catch (err) {
			toast.error('Không tải được danh sách sinh viên / template');
		}
	});

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			formData.fileUrl = file;
			filePreview = URL.createObjectURL(file);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (!formData.studentId || !formData.templateId || !formData.type || !formData.number) {
			toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
			return;
		}

		dispatch('submit', formData);
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
	<!-- Sinh viên -->
	<div>
		<label class="mb-1 block font-medium">Sinh viên</label>
		<select bind:value={formData.studentId} class="w-full rounded-lg border px-3 py-2" required>
			<option value="" disabled>-- Chọn sinh viên --</option>
			{#each students as sv}
				<option value={sv.id}>{sv.lastname} {sv.firstname} ({sv.code})</option>
			{/each}
		</select>
	</div>

	<!-- Template -->
	<div>
		<label class="mb-1 block font-medium">Template</label>
		<select bind:value={formData.templateId} class="w-full rounded-lg border px-3 py-2" required>
			<option value="" disabled>-- Chọn template --</option>
			{#each templates as tpl}
				<option value={tpl.id}>{tpl.name}</option>
			{/each}
		</select>
	</div>

	<!-- Loại văn bằng -->
	<div>
		<label class="mb-1 block font-medium">Loại văn bằng</label>
		<select bind:value={formData.type} class="w-full rounded-lg border px-3 py-2" required>
			<option value="BA">Cử nhân (BA)</option>
			<option value="MA">Thạc sĩ (MA)</option>
			<option value="PhD">Tiến sĩ (PhD)</option>
			<option value="CERT">Chứng chỉ (CERT)</option>
		</select>
	</div>

	<!-- Số hiệu -->
	<div>
		<label class="mb-1 block font-medium">Số hiệu</label>
		<input
			type="text"
			bind:value={formData.number}
			class="w-full rounded-lg border px-3 py-2"
			required
		/>
	</div>

	<!-- Ngày tốt nghiệp -->
	<div>
		<label class="mb-1 block font-medium">Ngày tốt nghiệp</label>
		<input type="date" bind:value={formData.gradDate} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<!-- Cơ quan cấp -->
	<div>
		<label class="mb-1 block font-medium">Cơ quan cấp</label>
		<input type="text" bind:value={formData.issuer} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<!-- Trạng thái -->
	<div>
		<label class="mb-1 block font-medium">Trạng thái</label>
		<select bind:value={formData.status} class="w-full rounded-lg border px-3 py-2">
			<option value="draft">Nháp</option>
			<option value="issued">Đã cấp</option>
			<option value="revoked">Thu hồi</option>
		</select>
	</div>

	<!-- Buttons -->
	<div class="flex justify-end gap-3">
		<button type="button" class="rounded-lg bg-gray-200 px-4 py-2" on:click={handleCancel}>
			Hủy
		</button>
		<button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-white">Lưu</button>
	</div>
</form>
