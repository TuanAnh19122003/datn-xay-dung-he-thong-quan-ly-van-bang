<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import axios from 'axios';

	export let initialValues = {
		image: null,
		code: '',
		lastname: '',
		firstname: '',
		dob: '',
		gender: 'male',
		email: '',
		phone: '',
		address: '',
		majorId: ''
	};

	const dispatch = createEventDispatcher();
	let formData = { ...initialValues };
	let filePreview = formData.image ? formData.image : null;
	let majors = [];

	const API_URL = import.meta.env.VITE_API_URL;

	onMount(async () => {
		try {
			const res = await axios.get(`${API_URL}/majors`);
			majors = res.data.data;
		} catch (err) {
			toast.error('Không tải được danh sách ngành');
		}
	});

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			formData.image = file;
			filePreview = URL.createObjectURL(file);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (!formData.code || !formData.lastname || !formData.firstname || !formData.majorId) {
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
	<div>
		<label class="mb-1 block font-medium">Mã sinh viên</label>
		<input type="text" bind:value={formData.code} class="w-full rounded-lg border px-3 py-2" required />
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label class="mb-1 block font-medium">Họ</label>
			<input type="text" bind:value={formData.lastname} class="w-full rounded-lg border px-3 py-2" required />
		</div>
		<div>
			<label class="mb-1 block font-medium">Tên</label>
			<input type="text" bind:value={formData.firstname} class="w-full rounded-lg border px-3 py-2" required />
		</div>
	</div>

	<div>
		<label class="mb-1 block font-medium">Ngày sinh</label>
		<input type="date" bind:value={formData.dob} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<div>
		<label class="mb-1 block font-medium">Giới tính</label>
		<select bind:value={formData.gender} class="w-full rounded-lg border px-3 py-2">
			<option value="male">Nam</option>
			<option value="female">Nữ</option>
			<option value="other">Khác</option>
		</select>
	</div>

	<div>
		<label class="mb-1 block font-medium">Email</label>
		<input type="email" bind:value={formData.email} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<div>
		<label class="mb-1 block font-medium">Số điện thoại</label>
		<input type="text" bind:value={formData.phone} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<div>
		<label class="mb-1 block font-medium">Địa chỉ</label>
		<textarea bind:value={formData.address} class="w-full rounded-lg border px-3 py-2"></textarea>
	</div>

	<div>
		<label class="mb-1 block font-medium">Ngành học</label>
		<select bind:value={formData.majorId} class="w-full rounded-lg border px-3 py-2" required>
			<option value="" disabled>-- Chọn ngành --</option>
			{#each majors as major}
				<option value={major.id}>{major.name}</option>
			{/each}
		</select>
	</div>

	<div>
		<label class="mb-1 block font-medium">Ảnh đại diện</label>
		<input type="file" accept="image/*" on:change={handleFileChange} />
		{#if filePreview}
			<img src={filePreview} alt="Preview" class="mt-2 h-[200px] w-[200px] rounded-[10px] border object-cover" />
		{/if}
	</div>

	<div class="flex justify-end gap-3">
		<button type="button" class="rounded-lg bg-gray-200 px-4 py-2" on:click={handleCancel}>Hủy</button>
		<button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-white">Lưu</button>
	</div>
</form>
