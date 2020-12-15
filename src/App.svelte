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

	let active = "x";
</script>

<style>

</style>

<GraphicTitle
	title={"2020 monthly unemployment rates by state"}
	subhed={"A look at something etc"}
/>
<div id="interactive-filter">
		<span>Select a state</span>
		<form>
			<select bind:value={active}>
				{#each dataset.default as opt}
					<option value={opt.State}>
						{opt.State}
					</option>
				{/each}
			</select>
		</form>
	</div>
<MultiLineChart
	data = {dataset.default}
	width = {width}
	height = {Math.min(400, width * 0.67)}
	xVar={"date"}
	yGroups={USStates.map(d => d.name)}
	yDomain={[0, 30]}
	active={"x"}
/>
<GraphicFooter
	source={'<a href="https://www.bls.gov/charts/state-employment-and-unemployment/state-unemployment-rates-animated.htm">Bureau of Labor Statistics</a>'}
	note={''}
	credit={'Tyler Machado/Northeastern University'}
/>
