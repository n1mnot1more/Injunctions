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

		el.scrollIntoView({ behavior: "smooth", block: "start" });
	}
</script>

<header class="header">
	<div class="wordmark">
		<a href="{base}/" aria-label="home">
			{@html wordmark}
		</a>
	</div>

	<nav class="nav">
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
	padding-bottom: 6px;
}

/* WORDMARK */
.wordmark {
	max-width: 11em;
	margin: 0 auto;
	padding: 28px 0 16px;
	transform: rotate(-3deg);
	opacity: 0.95;
}

.wordmark a {
	display: block;
	border: none;
	color: inherit;
}

/* NAV CONTAINER */
.nav {
	display: flex;
	justify-content: center;
	gap: 8px;
	padding: 0 16px 14px;
	flex-wrap: wrap;
}

/* BUTTON BASE */
.nav button {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.12);
	color: rgba(255, 255, 255, 0.75);

	font-size: 12px;
	letter-spacing: 0.02em;
	text-transform: uppercase;

	padding: 6px 12px;
	border-radius: 999px;

	cursor: pointer;

	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease,
		color 0.2s ease;
}

/* HOVER */
.nav button:hover {
	background: rgba(255, 255, 255, 0.06);
	border-color: rgba(255, 255, 255, 0.25);
	color: white;
	transform: translateY(-1px);
}

/* ACTIVE STATE */
.nav button.selected {
	background: rgba(255, 255, 255, 0.10);
	border-color: rgba(252, 253, 79, 0.55);
	color: #fcfd4f;

	box-shadow:
		0 0 0 1px rgba(252, 253, 79, 0.15),
		0 6px 18px rgba(0, 0, 0, 0.35);
}

/* MOBILE */
@media (max-width: 900px) {
	.nav {
		gap: 6px;
	}

	.nav button {
		font-size: 11px;
		padding: 5px 10px;
	}
}

</style>
<style>

header {
	background: #0a061b;
	position: relative;
}

/* LOGO */

.wordmark {
	max-width: 11em;

	margin: 0 auto;

	padding: 32px 0;

	transform: rotate(-4deg);

	position: relative;
	z-index: 5;
}

.wordmark a {
	border: none;
	display: block;
	color: var(--color-fg);
}

.wordmark a:hover {
	background-color: transparent;
}

/* FIXED NAV */

.jump-nav {
	position: fixed;

	top: 1.25rem;
	right: 1.5rem;

	z-index: 1000;

	display: flex;
	align-items: center;
	gap: 0.55rem;
}

/* PUDDING STYLE BUTTONS */

.jump-nav a {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	padding:
		0.5rem
		0.9rem;

	border-radius: 999px;

	background:
		rgba(18, 12, 34, 0.82);

	backdrop-filter: blur(10px);

	border:
		1px solid
		rgba(255,255,255,0.08);

	color: white;
	text-decoration: none;

	font-size: 0.72rem;
	font-weight: 600;
	letter-spacing: 0.02em;

	box-shadow:
		0 4px 18px rgba(0,0,0,0.35);

	transition:
		transform 0.18s ease,
		background 0.18s ease,
		border-color 0.18s ease;
}

.jump-nav a:hover {
	transform: translateY(-1px);

	background:
		rgba(40, 22, 70, 0.92);

	border-color:
		rgba(255,255,255,0.16);
}

/* MOBILE */

@media (max-width: 900px) {

	.jump-nav {
		top: auto;
		bottom: 1rem;

		left: 50%;
		right: auto;

		transform: translateX(-50%);

		flex-wrap: wrap;
		justify-content: center;

		max-width: calc(100vw - 2rem);
	}

	.jump-nav a {
		font-size: 0.68rem;

		padding:
			0.45rem
			0.75rem;
	}

	.wordmark {
		padding-top: 24px;
	}

}

</style>
