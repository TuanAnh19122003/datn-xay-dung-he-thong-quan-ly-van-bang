<script>
	let menu = [
		{ name: 'Dashboard', href: '/admin' },
		{ name: 'Users', href: '/admin/user' },
		{ name: 'Settings', href: '/admin/settings' }
	];
</script>

<aside class="sidebar">
	<ul>
		{#each menu as item}
			<li><a href={item.href}>{item.name}</a></li>
		{/each}
	</ul>
</aside>

<style>
	.sidebar {
		width: 220px;
		background-color: #0f172a;
		color: white;
		padding: 2rem 1rem;
		min-height: 100vh;
	}
	.sidebar ul {
		list-style: none;
		padding: 0;
	}
	.sidebar li {
		margin-bottom: 1rem;
	}
	.sidebar a {
		color: white;
		text-decoration: none;
	}
	.sidebar a:hover {
		text-decoration: underline;
	}
</style>
