var scatterPlot = function scatterPlot(all_data, target) {
  // Set the dimensions of the canvas / graph
  let usable_data = all_data['data'];

  var margin = { top: 60, right: 220, bottom: 60, left: 40 },
    height = 340 - margin.top - margin.bottom;
    
  let width = 400 - margin.left - margin.right
  if ($(window).width() < 800) {
    width = $(window).width() - margin.left - margin.right
  }

  d3.selectAll(target + " > *").remove();

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  let labels,
    links,
    labelArray = [],
    anchorArray = [];

  //Redraw label and lines with transition
  function redrawLabels() {
    labels
      .transition()
      .duration(1500)
      .attr("x", d => d.x)
      .attr("y", d => d.y);

    links
      .transition()
      .duration(1500)
      .attr("x2", d => d.x)
      .attr("y2", d => d.y);
  }

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

  var circles = gdots
    .append("circle")
    .attr("r", function(d) {
      labelArray.push({
        x: x(+d.x),
        y: y(d.y),
        name: d.label,
        width: 0.0,
        height: 0.0
      });
      anchorArray.push({ x: x(+d.x), y: y(d.y), r: 5 });
      return 3;
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
    .attr("opacity", 1)
    // .on("mouseover", dotmouseover)
    // .on("mouseleave", dotmouseleave);

  labels = g
    .selectAll(".label")
    .data(labelArray)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(d => d.name)
    .attr("font-family", "sans-serif")
    .attr("x", (d, i) => {
      return d.x;
    })
    .attr("y", (d, i) => {
      return d.y;
    })
    .attr("text-anchor", "start")
    .attr("font-size", 10)
    // .on("mouseover", labelmouseover)
    // .on("mouseleave", labelmouseleave);

  //Add height and width of label to array
  var index = 0;
  labels.each(function(d) {
    //var bbox = this.node().getBBox();
    // BBox doesn't seem to cooperate with firefox before the element is drawn
    // so this is a guess on the length of the text for now
    labelArray[index].width = 6 * d.name.length; //this.node().getBBox().width;
    labelArray[index].height = 14; //this.node().getBBox().height;
    index += 1;
  });

  //Add links connecting label and circle
  links = g
    .selectAll(".link")
    .data(labelArray)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", d => d.x)
    .attr("y1", d => d.y)
    .attr("x2", d => d.x)
    .attr("y2", d => d.y)
    .attr("stroke-width", 0.4)
    .attr("stroke", "#6f6f6f");

  //Remove overlaps
  d3.labeler()
    .label(labelArray)
    .anchor(anchorArray)
    .width(width)
    .height(height)
    .start(2000);

  redrawLabels();

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