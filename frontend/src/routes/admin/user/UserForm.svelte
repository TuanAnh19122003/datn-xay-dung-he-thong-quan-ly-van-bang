<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import axios from 'axios';

	export let initialValues = {
		lastname: '',
		firstname: '',
		email: '',
		password: '',
		phone: '',
		roleId: '',
		is_active: true,
		image: null
	};

	const dispatch = createEventDispatcher();
	let formData = { ...initialValues };
	let filePreview = formData.image ? formData.image : null;
	let roles = []; // danh sách roles

	const API_URL = import.meta.env.VITE_API_URL;

	onMount(async () => {
		try {
			const res = await axios.get(`${API_URL}/roles`);
			roles = res.data.data; // API của bạn trả về { data: [...] }
		} catch (err) {
			toast.error('Không tải được danh sách vai trò');
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

		if (!formData.firstname || !formData.lastname || !formData.email || !formData.roleId) {
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
		<label class="mb-1 block font-medium">Email</label>
		<input type="email" bind:value={formData.email} class="w-full rounded-lg border px-3 py-2" required />
	</div>

	{#if !formData.id}
		<div>
			<label class="mb-1 block font-medium">Mật khẩu</label>
			<input type="password" bind:value={formData.password} class="w-full rounded-lg border px-3 py-2" required />
		</div>
	{/if}

	<div>
		<label class="mb-1 block font-medium">Số điện thoại</label>
		<input type="text" bind:value={formData.phone} class="w-full rounded-lg border px-3 py-2" />
	</div>

	<!-- Vai trò -->
	<div>
		<label class="mb-1 block font-medium">Vai trò</label>
		<select bind:value={formData.roleId} class="w-full rounded-lg border px-3 py-2" required>
			<option value="" disabled>-- Chọn vai trò --</option>
			{#each roles as role}
				<option value={role.id}>{role.name}</option>
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

	<div class="flex items-center gap-2">
		<input type="checkbox" bind:checked={formData.is_active} id="is_active" />
		<label for="is_active">Kích hoạt</label>
	</div>

	<div class="flex justify-end gap-3">
		<button type="button" class="rounded-lg bg-gray-200 px-4 py-2" on:click={handleCancel}>Hủy</button>
		<button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-white">Lưu</button>
	</div>
</form>
