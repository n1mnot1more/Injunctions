<script>
	import wordmark from "$svg/Not1More.svg";

	const links = [
		{ id: "map", label: "Map" },
		{ id: "personal-stories", label: "Stories" },
		{ id: "resources", label: "Resources" },
		{ id: "acknowledgements", label: "Credits" }
	];
</script>

<header>

	<!-- LOGO -->
	<div class="wordmark">
		<a
			href="https://not1more.org/"
			aria-label="Not1More"
			target="_self"
		>
			{@html wordmark}
		</a>
	</div>

	<!-- FIXED NAV -->
	<nav class="jump-nav">

		{#each links as link}
			<a href={"#" + link.id}>
				{link.label}
			</a>
		{/each}

	</nav>

</header>

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
