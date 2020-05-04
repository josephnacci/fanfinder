var scatterPlot = function scatterPlot(all_data, target) {
  // Set the dimensions of the canvas / graph
  let usable_data = all_data['data'];

  var margin = { top: 60, right: 120, bottom: 60, left: 40 },
    height = 340 - margin.top - margin.bottom;
    
  let width = 420 - margin.left - margin.right
  if ($(window).width() < 800) {
    width = $(window).width() - margin.left - margin.right
  }

  d3.selectAll(target + " > *").remove();

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  let links,
    labelArray = [],
    anchorArray = [];

  //Redraw label and lines with transition

  var params = all_data["data_params"]
  var title = all_data["data_params"]["title"];
  var xlabel = "Agreement of this movie's fans over non-fans";
  var ylabel = "Agreement in general public";

  // Adds the svg canvas
  var svg = d3
    .select(target)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var out_colors = d3.scaleOrdinal(d3["schemeDark2"]);

  var xExtent = d3.extent(usable_data, function(d) {
      return d.x;
    }),
    xRange = xExtent[1] - xExtent[0],
    yExtent = d3.extent(usable_data, function(d) {
      return d.y;
    }),
    yRange = yExtent[1] - yExtent[0];

  if (params.pad_range == 1) {
    x.domain([xExtent[0] - xRange * 0.05, xExtent[1] + xRange * 0.05]);
    y.domain([yExtent[0] - yRange * 0.05, yExtent[1] + yRange * 0.05]);
  } else {
    x.domain([xExtent[0], xExtent[1]]);
    y.domain([yExtent[0], yExtent[1]]);
  }

  var max = d3.max(usable_data, function(d){
    return d.x;
  }),
     min = d3.min(usable_data, function(d){
    return d.x;
  })

  var svgDefs = svg.append('defs');

  var mainGradient = svgDefs.append('linearGradient')
      .attr('id', 'mainGradient');

  var leftGradient = mainGradient.append('stop')
      .attr('class', 'stop-left')
      .attr('offset', '0');

  var rightGradient = mainGradient.append('stop')
      .attr('class', 'stop-right')
      .attr('offset', '1');

  var rect = g
    .append("rect")
    .attr("class", "filled")

  rect.attr("width", width)
      .attr("height", height)
      .attr("opacity",.2)
      .attr("x", 0)
      .attr("y", 0)

  var gdots = g
    .selectAll("g.dot")
    .data(usable_data)
    .enter()
    .append("g");

  var dotmouseover = function(d, i) {
    svg.selectAll(".circle")
      .attr("r", 4)
      .attr("opacity", .6)
    svg.selectAll(".label")
      .attr("opacity", 0)
    d3.select(this)
      .attr("r", 5)
      .attr("opacity", 1);
    d3.select(this.parentNode).select(".label")
      .attr("opacity", 1)
  };

  var dotmouseleave = function(d) {
    svg
      .selectAll("circle")
      .attr("r", 4)
      .attr("opacity", 0.6);
    d3.select(this.parentNode).select(".label")
      .attr("opacity", 0)
  };

  var circles = gdots
    .append("circle")
    .attr("class", "circle")
    .attr("r", function(d) {
      if (d.x == max || d.x == min) {
        return 5
      } else {
        return 4;
      }
    })
    .attr("cx", function(d) {
      return x(d.x);
    })
    .attr("cy", function(d) {
      return y(d.y);
    })
    .attr("fill", function(d, i) {
      return "#514b9a";
    })
    .attr("opacity", function(d){
      if (d.x == max || d.x == min) {
        return 1
      } else {
        return .6;
      }
    })
    .on("mouseover", dotmouseover)
    .on("mouseleave", dotmouseleave);

  var labels = gdots
    .append("text")
    .attr("class", "label")
    .text((d) => {
      return d.label
    })
    .attr("font-family", "sans-serif")
    .attr("x", (d)=>{
      if (d.x>max/2) {
        return x(d.x) - 10;
      } else {
        return x(d.x) + 7;
      }
    })
    .attr("y", (d, i) => {
      return y(d.y) + 3;
    })
    .attr("text-anchor", (d)=>{
      if (d.x>max/2) {
        return "end"
      } else {
        return "start"
      }
    })
    .attr("font-size", 10)
    .attr("opacity", (d)=>{
      if (d.x == max || d.x == min) {
        return 1
      } else {
        return 0
      }
    }).attr("pointer-events", "none")

  // Add the X Axis
    g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(4).tickSize(0).tickFormat(d3.format(".0%")));

    // Add the Y Axis
    g
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(4).tickSize(0).tickFormat(d3.format(".0%")));
  //xlabel
  g
    .append("text")
    .attr(
      "transform",
      "translate(" +
        130 +
        " ," +
        (height + margin.bottom - margin.top + 2) +
        ")"
    )
    .attr("dy", "2em")
    .style("text-anchor", "middle")
    .style("fill", function() {
      if (params.bgcolor) {
        if (params.bgcolor == "black") {
          return "white";
        }
      } else {
        return "black";
      }
    })
    .text(xlabel)
    .attr("font-size", 12);
  //ylabel

  //title
  g
    .append("text")
    .attr("transform", "translate(" + -6 + " ," + height / 2 + ") rotate(-90)")
    .attr("dy", "-2em")
    .style("text-anchor", "middle")
    .style("fill", function() {
      if (params.bgcolor) {
        if (params.bgcolor == "black") {
          return "white";
        }
      } else {
        return "black";
      }
    })
    .text(ylabel).attr("font-size", 12);

  g
      .append("text")
      .attr("class", "titletext")
      .attr("x", params.title_x)
      .attr("y", params.title_y)
      .attr("dy", "-1.26em")
      .attr("dx", "-.5em")
        .style("text-anchor", "left")
        .text(title)
          .attr("font-size", 16)
          .attr("font-weight", 400)
          .attr("font-family", "ProximaNova")
          .attr("fill", "black")
          .attr("text-anchor", "beginning")
};