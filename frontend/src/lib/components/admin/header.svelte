<script>
	export let title = 'Admin Panel';
</script>

<header class="header">
	<h1>{title}</h1>
	<nav>
		<a href="/admin">Dashboard</a>
		<a href="/admin/user">Users</a>
		<a href="/admin/settings">Settings</a>
	</nav>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background-color: #1e293b;
		color: white;
	}
	nav a {
		margin-left: 1rem;
		color: white;
		text-decoration: none;
	}
	nav a:hover {
		text-decoration: underline;
	}
</style>
