function columnTemplate(data, chartmeta, targetElement) {

    var title = d3.select(targetElement).append("h3").text(chartmeta.title);
    var subtitle = d3.select(targetElement).append("h5").text(chartmeta.subtitle);

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

    // set the ranges
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.candidate; }))
        .range([0, width - margin.left - margin.right])
        .padding(0.33);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.positive; })])
        .range([height, 0])
        .nice();

    var xAxis = d3.axisBottom(x)
                  .tickFormat(function(d){
                        return d;
                    })
                    .tickSize(0);

    var yAxis = d3.axisLeft(y)
                  .ticks(7)
                  .tickSize(-width);

    // create container SVG
    var svg = d3.select(targetElement).append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "14px")
        .call(customXAxis);
        // .selectAll(".tick:not(:first-of-type) line")
        // .attr("stroke-opacity", 0);

    svg.append("g")
        .attr("class", "yAxis")
        .style("font-size", "12px")
        .call(customYAxis);
        // .selectAll(".tick:not(:first-of-type) line")
        // .attr("stroke", "gray")
        // .attr("stroke-dasharray", "2,2")
        // .attr("stroke-opacity", 0.5);


    // create tooltip using d3-tip library
    // var tooltip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10,0])
    //     .html(function(d) {
    //         return d.candidate + ": " + d.positive;
    //       });
    //
    // svg.append('circle')
    //     .attr('class', 'tiptarget');
    // svg.call(tooltip);

    function customXAxis(g) {
      g.call(xAxis);
      g.select(".domain").remove();
    }

    function customYAxis(g) {
      var s = g.selection ? g.selection() : g;
      g.call(yAxis);
      s.select(".domain").remove();
      s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
      // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
    }

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.candidate);})
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.positive); })
        .attr("height", function(d) { return height - y(d.positive); })
        .attr("fill", function(d,i) { return "#cc0000"; })
        .on('mouseover, mousemove', function(d){
            // console.log("hover");
            var target = d3.select(targetElement + ' .tiptarget');
            d3.select(this)
                .attr("fill", "#f08080");
            // d3.select(".label").attr("fill", "#777");
        })
        .on("mouseout", function(d, i) {
         d3.select(this).attr("fill", function() {
             return "#cc0000";
             d3.select(".label").attr("fill", "#e6e6e6");
         });
     });

        // label for each data points
     svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("fill", "#e6e6e6")
        .attr("x", function(d,i){
            return x(d.candidate) + (x.bandwidth()/2);
        })
        .attr("y", function(d){
             return y(d.positive) + 25;
        })
        .attr("text-anchor", "middle")
        .text(function(d){
            return d.positive;
        });

        // text label for the x axis
    svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.top + 15) + ")")
        .style("text-anchor", "middle")
        .text("Horizontal Label");

        // text label for the y axis
    svg.append("text")
      .attr("class", "axislabel")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .style("text-anchor", "middle")
      .text("Vertical Label");


    if (chartmeta.source) {
        d3.select(targetElement).append("h6").html("<b>SOURCE:</b> " + chartmeta.source);
    }
    if (chartmeta.note) {
        d3.select(targetElement).append("h6").html("<b>NOTE:</b> " + chartmeta.note);
    }
}