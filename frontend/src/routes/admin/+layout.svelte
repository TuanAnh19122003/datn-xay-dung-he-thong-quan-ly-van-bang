<script>
	import Header from '$lib/components/admin/Header.svelte';
	import Footer from '$lib/components/admin/Footer.svelte';
	import Sidebar from '$lib/components/admin/Sidebar.svelte';
</script>

<div class="admin-layout">
	<Sidebar />
	<div class="main-area">
		<Header />
		<main>
			<slot />
		</main>
		<Footer />
	</div>
</div>

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
	}
	.main-area {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
		padding: 1rem 2rem;
	}
</style>
