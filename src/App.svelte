<script>
	import { onMount } from 'svelte';
	import MultiLineChart from './charts/MultiLineChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
	import * as dataset from '../public/datasets/data.json'

	export let width = Math.min(
		document.getElementById('multilinechart').getBoundingClientRect().width,
		1000
	);

	let active = "";
	export let activecolor = "#dedede";
</script>

<style>
#multilinechart-filter {
	display:block;
	width: 100%;
	text-align:center;
	margin:0 0 2rem;
}

#multilinechart-filter div {
	font-size:0.9rem;
	margin:0 0 1rem;
}

#multilinechart-filter form {
	padding:0px;
}

#multilinechart-filter form select {
	font-size:1.25rem;
	font-family: "Akkurat", sans-serif;
	padding:0.5rem 0.2rem;
	border:unset;
	background-color:white;
}

#multilinechart-filter form select:focus {
	outline: none
}

</style>

<GraphicTitle
	title={"2020 monthly unemployment rates by state"}
	subhed={"A look at something etc"}
/>
<div id="multilinechart-filter">
	<div>Select a state below to see its unemployment rates across the months of 2020.</div>
	<form>
		<select bind:value={active}  style={"border:7.5px solid " + activecolor}>
			<option value={null} selected={true}>
				---
			</option>
			{#each dataset.default as opt}
				<option value={opt.State} selected={false}>
					{opt.State}
				</option>
			{/each}
		</select>
	</form>
	</div>
<MultiLineChart bind:activecolor={activecolor} bind:active={active}
	data = {dataset.default}
	width = {width}
	height = {Math.min(400, width * 0.67)}
	xVar={"date"}
	yGroups={dataset.default.map(d => d.State)}
	yDomain={[0, 30]}
/>
<GraphicFooter
	source={'<a href="https://www.bls.gov/charts/state-employment-and-unemployment/state-unemployment-rates-animated.htm">Bureau of Labor Statistics</a>'}
	note={''}
	credit={'Tyler Machado/Northeastern University'}
/>
