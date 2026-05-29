<script>
	import { base } from "$app/paths";
	import wordmark from "$svg/Not1More.svg";

	const nav = [
		{ id: "map", label: "Map" },
		{ id: "stories", label: "Stories" },
		{ id: "resources", label: "Resources" },
		{ id: "acknowledgements", label: "Credits" }
	];

	let active = "map";

	function goTo(id) {
		active = id;

		const el = document.getElementById(id);

		if (!el) return;

		el.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
</script>

<header class="header">

	<nav class="nav">

		<!-- INLINE SMALL LOGO (NEW) -->
		<a href="{base}/" class="nav-logo" aria-label="home">
			{@html wordmark}
		</a>

		{#each nav as item}
			<button
				class:selected={active === item.id}
				on:click={() => goTo(item.id)}
			>
				{item.label}
			</button>
		{/each}

	</nav>

</header>

<style>

.header {
	background: #0a061b;
	color: white;
}

/* NAV (unchanged except layout support) */
.nav {
	position: fixed;
	top: 1.25rem;
	right: 1.5rem;

	z-index: 1000;

	display: flex;
	align-items: center;
	gap: 0.5rem;

	flex-wrap: wrap;
}

/* NEW: inline logo inside nav */
.nav-logo {
	display: flex;
	align-items: center;

	max-width: 3.2em;

	margin-right: 0.4rem;

	opacity: 0.85;

	transform: rotate(-3deg);

	transition: opacity 0.2s ease;
}

.nav-logo:hover {
	opacity: 1;
}

/* ensure svg scales properly */
.nav-logo :global(svg) {
	width: 100%;
	height: auto;
	display: block;
}

/* BUTTONS (unchanged) */
.nav button {
	background: rgba(18, 12, 34, 0.82);

	backdrop-filter: blur(10px);

	border: 1px solid rgba(255,255,255,0.08);

	color: rgba(255,255,255,0.82);

	font-size: 0.72rem;
	font-weight: 600;
	letter-spacing: 0.02em;
	text-transform: uppercase;

	padding: 0.5rem 0.9rem;

	border-radius: 999px;

	cursor: pointer;

	box-shadow: 0 4px 18px rgba(0,0,0,0.35);

	transition:
		transform 0.18s ease,
		background 0.18s ease,
		border-color 0.18s ease,
		color 0.18s ease;
}

.nav button:hover {
	transform: translateY(-1px);
	background: rgba(40, 22, 70, 0.92);
	border-color: rgba(255,255,255,0.16);
	color: white;
}

.nav button.selected {
	background: rgba(255,255,255,0.10);
	border-color: rgba(252,253,79,0.55);
	color: #fcfd4f;

	box-shadow:
		0 0 0 1px rgba(252,253,79,0.15),
		0 6px 18px rgba(0,0,0,0.35);
}

/* MOBILE (unchanged) */
@media (max-width: 900px) {

	.nav {
		top: auto;
		bottom: 1rem;

		left: 50%;
		right: auto;

		transform: translateX(-50%);

		justify-content: center;

		max-width: calc(100vw - 2rem);

		gap: 0.4rem;
	}

	.nav button {
		font-size: 0.66rem;
		padding: 0.45rem 0.75rem;
	}
}

</style>