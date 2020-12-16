<script>
	import { onMount } from 'svelte';
	import BarChart from './charts/BarChart.svelte'
	import ColumnChart from './charts/ColumnChart.svelte'
	import LineChart from './charts/LineChart.svelte'
	import MultiLineChart from './charts/MultiLineChart.svelte'
	import XYHeatmap from './charts/XYHeatmap.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
	import USStates from './helpers/USStates.js'
	import * as dataset from '../public/datasets/data.json'

	export let width = Math.min(
		document.getElementById('interactive').getBoundingClientRect().width,
		1000
	);

	export let height = Math.min(
		document.getElementById('interactive').getBoundingClientRect().height,
		1000
	);

	let active = "";
	export let activecolor = "#dedede";
</script>

<style>
#interactive-filter {
	display:block;
	width: 100%;
	text-align:center;
	margin:0 0 2rem;
}

#interactive-filter div {
	font-size:1rem;
	margin:0 0 1rem;
}

#interactive-filter form {
	padding:10px;
}

#interactive-filter form select {
	font-size:1.25rem;
	font-family: "Akkurat", sans-serif;
	padding:0.5rem 0.2rem;
	border:unset;
	background-color:white;
}

#interactive-filter form select:focus {
	outline: none
}

</style>

<GraphicTitle
	title={"2020 monthly unemployment rates by state"}
	subhed={"A look at something etc"}
/>
<div id="interactive-filter">
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
