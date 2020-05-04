var chloropleth = function chloropleth(all_data, selector) {
  var margin = { top: 60, right: 10, bottom: 40, left: 10 };

  let width = 800 - margin.left - margin.right;

  let  height = 650 - margin.top - margin.bottom;

  d3.selectAll(selector + " > *").remove();

  // The svg
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  var g = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  // Map and projection
  var projection = d3
    .geoAlbersUsa()
    .scale(800) //.translate([487.5, 305])
    .translate([width / 2, height / 1.5]);
  
  var path = d3.geoPath().projection(projection);

  var color = d3.scaleQuantize()
      .range(colorbrewer["PuOr"][5])  

    color.domain([0, 2]);

  //function ready(error, dataGeo, data) {

  dataGeo = all_data["data_params"]["dataGeo"];
  data = all_data["data"];
  chart_params = all_data["data_params"];
  stateMap = all_data["data_params"]["state_map"];
  // Create a color scale

  //var tv = single.values;
  for (var i = 0; i < dataGeo.features.length; i++) {
    var dma_code = dataGeo.features[i].id;
    if (dma_code in data) {
      for (key in data[dma_code]) {
        dataGeo.features[i].properties[key] = data[dma_code][key];
      }
    } else {
      dataGeo.features[i].properties["value"] = 1;
    }
  }

  var threshold = d3
    .scaleThreshold()
    .domain([0.5, 0.8, 1, 1.2, 1.5, 2])
    .range(["#de425b", "#de7d64", "#e4b08f", "#cbbe8e", "#95a658", "#488f31"]);

  //var color = d3.scaleSequential(d3.interpolateBlues).domain([0, 2]);

  // Draw the map
  g
    .append("g")
    .attr("id", "dma")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", function(d) {
      return color(d.properties.value);
    })
    .attr("d", path)
    .style("stroke", "black")
    .style("stroke-width", 0.4)
    .style("opacity", .7)
    .style("stroke-opacity", .3)
    .on("mouseover", function(d){
      console.log(d)
      d3.select(this)
        .attr("opacity", 1);
      d3.select("#textbox")
        .html("<span>Market:</span> " + d.properties.name)
      })

    .on("mouseout", function(d){
      d3.select(this)
      .attr("opacity", .7)

      d3.select("#textbox")
        .html("")
    });

  g
    .append("g")
    .selectAll("path")
    .data(topojson.feature(stateMap, stateMap.objects.states).features)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("d", path)
    .style("stroke", "black")
    .style("display", (d)=>{
      if (d.properties.name == "Alaska" || d.properties.name == "Hawaii") {
        return "none";
      }
    })
    .style("stroke-width", 1)
    .style("stroke-opacity", .6)
    .attr("pointer-events", "none");

  var legendQuant = g.append("g")
    .attr("class", "legendQuant")
    .attr("transform", "translate(270,140)");

  var legend = d3.legendColor()
      .shapeWidth(50)
      .scale(color)
      .orient('horizontal')
      .labelDelimiter("-");

  svg.select(".legendQuant")
      .call(legend);

  legendQuant.append("text")
    .classed("label-top", true)
    .attr("transform", "translate(0,-4)")
    .text("Fan index");

  d3.selectAll(".label")
      .attr("font-size", 10)

  d3.selectAll(".label-top")
      .attr("font-size", 10)
  var selector_class = selector.slice(1, selector.length);

onResize()
$(window).resize(()=>{
  onResize()
})

function onResize() {
                 
  width = d3.min([$(window).width(), 800])

  height = width * .685

  svg.attr("width", width)

  projection.scale(width)

  if(width<800) {
    g.attr("transform", "translate(" + (-45 * ( 800 - width )/100) + "," + 0 + ")")
    legendQuant.attr("transform", "translate(" + (270 + (5 * ( 800 - width )/100)) + "," + (140 + (.2 * ( 800 - width ))) + ")")
    legend.shapeWidth(63 - 13*(800/width));
  } else {
    legend.shapeWidth(50);
  }
  
  g.selectAll("path")
    .attr("d", path)

  svg.select(".legendQuant")
        .call(legend);

  if(width<410) {
    d3.selectAll(".label")
        .attr("transform",  "translate(17,24)")
        .attr("font-size", 8);
      } else {
    d3.selectAll(".label")
        .attr("font-size", 10);
      }
}

};

