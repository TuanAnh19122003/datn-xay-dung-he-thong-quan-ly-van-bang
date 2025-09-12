<script>
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let initialValues = { name: '', desc: '', fileUrl };

	const dispatch = createEventDispatcher();
	let formData = { ...initialValues };

	function handleSubmit(e) {
		e.preventDefault();

		if (!formData.name || !formData.desc || !formData.fileUrl) {
			toast.error('Vui lòng nhập đầy đủ thông tin template!');
			return;
		}

		dispatch('submit', formData);
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<div>
		<div>
			<label class="mt-3 mb-1 block font-medium">Tên mẫu văn bằng</label>
			<input
				type="text"
				bind:value={formData.name}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="Nhập tên mẫu văn bằng..."
				required
			/>
		</div>
		<div>
			<label class="mb-1 block font-medium">Mô tả</label>
			<textarea
				bind:value={formData.desc}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="Nhập mô tả vai trò..."
				rows="4"
				required
			></textarea>
		</div>

		<div>
			<label class="mb-1 block font-medium">Đường dẫn</label>
			<input
				type="text"
				bind:value={formData.fileUrl}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="Nhập mô tả mẫu văn bằng..."
				required
			/>
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
