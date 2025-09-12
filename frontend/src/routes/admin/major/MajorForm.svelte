<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import axios from 'axios';
	export let initialValues = { name: '', code: '', deptId: '' };

	const dispatch = createEventDispatcher();
	let formData = { ...initialValues };
	let departments = [];
	const API_URL = import.meta.env.VITE_API_URL;

	function handleSubmit(e) {
		e.preventDefault();

		if (!formData.name || !formData.code || !formData.deptId) {
			toast.error('Vui lòng nhập đầy đủ thông tin chuyên ngành!');
			return;
		}

		dispatch('submit', formData);
	}

	onMount(async () => {
		try {
			const res = await axios.get(`${API_URL}/departments`);
			departments = res.data.data;
		} catch (err) {
			toast.error('Không tải được danh sách khoa');
		}
	});

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<div>
		<label class="mt-3 mb-1 block font-medium">Mã chuyên ngành</label>
		<input
			type="text"
			bind:value={formData.code}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Nhập mã chuyên ngành..."
			required
		/>

		<label class="mb-1 block font-medium">Tên chuyên ngành</label>
		<input
			type="text"
			bind:value={formData.name}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Nhập tên chuyên ngành..."
			required
		/>

		<div>
			<label class="mb-1 block font-medium">Khoa</label>
			<select bind:value={formData.deptId} class="w-full rounded-lg border px-3 py-2" required>
				<option value="" disabled>-- Chọn Khoa --</option>
				{#each departments as department}
					<option value={department.id}>{department.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex justify-end gap-3">
		<button
			type="button"
			class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
			on:click={handleCancel}
		>
			Hủy
		</button>
		<button
			type="submit"
			class="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
		>
			Lưu
		</button>
	</div>
</form>
