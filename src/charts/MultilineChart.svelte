<script>
import { onMount, afterUpdate } from 'svelte';
import { scaleLinear, scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';
import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import { path } from 'd3-path';
import { extent } from 'd3-array';
import { select, selectAll } from 'd3-selection';
import { timeParse, timeFormat } from 'd3-time-format';
import { legendColor } from 'd3-svg-legend';
import { vibrant } from '../helpers/colors.js'

let d3 = {
	scaleLinear: scaleLinear,
	scaleBand: scaleBand,
	scaleTime: scaleTime,
	scaleOrdinal: scaleOrdinal,
	select: select,
	selectAll: selectAll,
	axisLeft: axisLeft,
	axisRight: axisRight,
	axisBottom: axisBottom,
	axisTop: axisTop,
	line: line,
	extent: extent,
	timeParse: timeParse,
	timeFormat: timeFormat,
	path: path,
	legendColor: legendColor
}

let el;

const padding = { top: 5, right: 5, bottom: 40, left: 30 };

export let data = {data};
export let width = {width};
export let height = {height};
export let xVar = {xVar};
export let yGroups = {yGroups};
export let yDomain = {yDomain};
export let active = {active};
export let colorscheme = vibrant;

let lines = yGroups;
let campusstats = false;
const parseTime = d3.timeParse("%b %Y");


$: xScale = d3.scaleTime()
	.range([0, width - padding.left - padding.right]);

$: yScale = d3.scaleLinear()
	.range([height - padding.bottom, padding.top]);

$: colors = d3.scaleOrdinal()
	.domain(lines)
	.range(colorscheme)

function highlightActive() {
	d3.selectAll("path")
		.lower()
		.attr("stroke-width", 2)
		.attr("opacity", 0.35)

	d3.select("path." + active.split(' ').join('_'))
		.raise()
		.attr("stroke-width", 10)
		.attr("opacity", 1)
}

onMount(generateLineChart);
afterUpdate(highlightActive);

function generateLineChart() {
	xScale.domain(d3.extent(Object.keys(data[0]).filter(d => (d !== "State")).map(d => parseTime(d))))
	yScale.domain(yDomain)

	var svg = d3.select(el)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform",
		"translate(" + padding.left + "," + 0 + ")");

	let axescontainer = svg.append("g")
	let datacontainer = svg.append("g")

	// add data lines
	for (let s in data) {
		let statedata = Object.entries(data[s])
			.map(([key, value]) => ({key,value}));

		let statename = data[s].State;

		datacontainer.append("path")
			.datum(statedata)
			.classed(statename.split(' ').join('_'), true)
			.attr("fill", "none")
			.attr("stroke", colors(statename))
			.attr("stroke-width", 2)
			.attr("opacity", 0.35)
			.attr("d", d3.line()
 				.defined(d => !isNaN(d.value))
				.x(function(d) { return xScale(parseTime(d.key))  })
				.y(function(d) { return yScale(d.value)})
			)
			.on("mouseover mousemove", function(event, d) {
				active = d[0].value
			}).on("mouseleave", function(d) {
				d3.select(this)
					.lower()
		 			.attr("stroke-width", 2)
		 			.attr("opacity", 0.35)
			});
		// svg append
	} // add data labels



	axescontainer.append("g")
		.attr("transform", "translate(0," + (height-padding.bottom) + ")")
		.call(d3.axisBottom(xScale)
		  .tickSizeInner(5)
		  .tickSizeOuter(0)
		  .tickPadding(5)
		  .tickFormat(d3.timeFormat("%b %Y"))
	  )
	  .call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick text").attr("text-anchor","end").attr("transform","rotate(-40 -8 8)"));

	axescontainer.append("g")
		.call(d3.axisLeft(yScale)
		  .ticks(5)
		  .tickSizeInner(-width)
		  .tickSizeOuter(0)
		  .tickPadding(3)
		  .tickFormat(d => (d + "%"))
	  )
	  .call(g => g.select(".domain").remove());





// line labels
// lines.forEach(function(l,i){
// 	let offset = 6;
//
// 	if (
// 		(i == 1) &&
// 		((data[data.length-1][lines[i]] - data[data.length-1][lines[i-1]]) < 40)
// 		)
// 	{
// 		offset = yScale(data[data.length-1][l]) - 5;
// 	}
// 	else if (
// 		(i == 1) &&
// 		((data[data.length-1][lines[i-1]] - data[data.length-1][lines[i]]) < 40) &&
// 		((data[data.length-1][lines[i-1]] - data[data.length-1][lines[i]]) > 0)
// 		)
// 	{
// 		offset = yScale(data[data.length-1][l]) + 5;
// 	}
// 	else
// 	{
// 		offset = yScale(data[data.length-1][l]);
// 	}
//
// 		// add line label squares
// 		if (campusstats) {
// 			let g = svg.append("g")
// 				.attr("transform", "translate(" + (xScale.range()[1]) + ", " + (offset-6) + ")")
//
// 			g.append("rect")
// 				.attr("width",56)
// 				.attr("height",12)
// 				.attr("fill", colorscheme[i])
//
// 			g.append("text")
// 				.attr("class","linelabel")
// 				.attr("text-anchor", "middle")
// 				.attr("fill", "white")
// 				.attr("x", 28)
// 				.attr("y", 9)
// 				.attr("font-size", "9px")
// 				.html(["ON CAMPUS","OFF CAMPUS"][i])
// 		}
//
// }) // lines ForEach

}
</script>

<style>
.chart :global(){
	display:inline;
}

	.chart :global(g.tick line) {
		stroke: #ccc;
	}
</style>


<div bind:this={el} class="chart"></div>
