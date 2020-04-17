var scatterPlot = function scatterPlot(all_data, target, params) {
  // Set the dimensions of the canvas / graph

  var margin = { top: 80, right: 200, bottom: 80, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

  
  var data = all_data["data"];
  var title = all_data["data_params"]["title"];
  var xlabel = all_data["data_params"]["xlabel"];
  var ylabel = all_data["data_params"]["ylabel"];

  // Adds the svg canvas
  var svg = d3
    .select(target)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var out_colors = d3.scaleOrdinal(d3["schemeDark2"]);


  var xExtent = d3.extent(data, function(d) {
      return d.x;
    }),
    xRange = xExtent[1] - xExtent[0],
    yExtent = d3.extent(data, function(d) {
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


  var gdots = svg
    .selectAll("g.dot")
    .data(data)
    .enter()
    .append("g");


  // create a tooltip
  var tooltip = d3
    .select(target)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("width", "200px")
    .style("padding", "5px")
    .style("position", "relative");

  // Three function that change the tooltip when user hover / move / leave a cell
  var dotmouseover = function(d, i) {
    d3.select(this)
      .attr("r", 5)
      .attr("opacity", 1);
    svg.selectAll("text").attr("font-weight", function(d2, i2) {
      return i2 == i ? "bold" : "normal";
    });
  };
  var dotmouseleave = function(d) {
    svg
      .selectAll("circle")
      .attr("r", 3)
      .attr("opacity", 0.8);
    svg.selectAll("text").attr("font-weight", "normal");
  };

  var labelmouseover = function(d, i) {
    d3.select(this).attr("font-weight", "bold");
    svg
      .selectAll("circle")
      .attr("r", function(d2, i2) {
        return i2 == i ? 5 : 3;
      })
      .attr("opacity", function(d2, i2) {
        return i2 == i ? 1 : 0.8;
      });
  };
  var labelmouseleave = function(d) {
    svg
      .selectAll("circle")
      .attr("r", 3)
      .attr("opacity", 0.8);
    svg.selectAll("text").attr("font-weight", "normal");
  };

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
      return "teal";
    })
    .attr("opacity", 1)
    .on("mouseover", dotmouseover)
    .on("mouseleave", dotmouseleave);

  labels = svg
    .selectAll(".label")
    .data(labelArray)
    .enter()
    .append("text")
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
    .on("mouseover", labelmouseover)
    .on("mouseleave", labelmouseleave);

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
  links = svg
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
  if (params.show_axis == 1) {
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));
  }

  //xlabel
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" +
        width / 2 +
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
    .text(xlabel);
  //ylabel

  //title
  svg
    .append("text")
    .attr("transform", "translate(" + 0 + " ," + height / 2 + ") rotate(-90)")
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
    .text(ylabel);
  title = svg
    .append("text")
    .attr("class", "titletext")
    .attr("x", params.title_x)
    .attr("y", params.title_y)
    .attr("dy", "0.36em")
    .style("text-anchor", "left")
    .text(title);

  //text styling
  svg
    .selectAll(".titletext")
    .attr("font-family", "proxima-nova, sans-serif")
    .attr("font-style", "normal")
    .attr("font-weight", "normal")
    .attr("font-size", params.font_size + "px")
    .attr("line-height", "20px")
    .attr("letter-spacing", "0.3px")
    .attr("fill", params.font_color);

  //title text styling
  title
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .attr("fill", params.font_color);

  //});
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        dx = -0.9,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em")
          .attr("dx", dx + "em")
          .style("fill", function(d) {
            if (params.bgcolor) {
              if (params.bgcolor == "black") {
                return "white";
              }
            } else {
              return "black";
            }
          });

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + "em")
            .attr("dx", dx + "em")
            .text(word)
            .style("fill", function(d) {
              if (params.bgcolor) {
                if (params.bgcolor == "black") {
                  return "white";
                }
              } else {
                return "black";
              }
            });
        }
      }
    });
  }
};
