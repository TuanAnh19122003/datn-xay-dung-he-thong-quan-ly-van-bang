<script>
	import Header from "$lib/components/auth/header.svelte";
	import Footer from "$lib/components/auth/footer.svelte";
</script>

<div class="auth-layout">
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<style>
	.auth-layout {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: #f0f2f5;
	}
</style>
