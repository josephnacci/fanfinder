var dmaMap = function dmaMap(all_data, selector, params) {
  var margin = { top: 10, right: 10, bottom: 10, left: 10 };

if ("width" in params) {
    width = params.width - margin.left - margin.right;
} else {
    width = 800 - margin.left - margin.right;
}

if ("height" in params) {
    height = params.height - margin.top - margin.bottom;
} else {
    height = 405 - margin.top - margin.bottom;
}

d3.selectAll(selector + " > *").remove();



// The svg
var svg = d3.select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Map and projection
var projection = d3.geoAlbersUsa().scale(1200)//.translate([487.5, 305])
    //.center([0,20])                // GPS of location to zoom on
    //.scale(99)                       // This is like the zoom
    .translate([ width/2, height/2 ]);

  var defaultFill = "#aaa";

  var colorScale = d3.scaleLinear()
    .domain([0, 2, 10, 25])
    .range(["white", "#abfcff", "#23637a", "#23637a"]);

  console.log(all_data);
  dataGeo = all_data["data_params"]["dataGeo"];
  stateMap = all_data['data_params']['state_map'];
  var single = all_data["data"];

  
  console.log(single);
  var nielsen = dataGeo.objects.nielsen_dma.geometries;

  var tv = Object.keys(single);
  console.log(tv);
  for (var i = 0; i < nielsen.length; i++) {
    var dma_code = nielsen[i].id;
    for (key in tv[dma_code]) {
      nielsen[i].properties[key] = tv[dma_code][key];
    }
  }
  //dataGeo.objects.nielsen_dma.geometries = nielsen;


  
  
  svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#FFE4B5")
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("opacity", 0.4);
/*
  svg
    .append("g")
    .attr("id", "dmas")
    .selectAll("path")
    .data(map_data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .on("mouseover", function(d) {
      d3.select(this).attr("opacity", 1);
      var prop = d.properties;
      var string =
        "<p><strong>Market Area Name</strong>: " + prop.dma1 + "</p>";
      string +=
        "<p><strong>Percent of " +
        brandNames[0].slice(0, brandNames[0].indexOf("(")) +
        " customers</strong>: " +
        prop.value.toFixed(0) +
        "% </p>";
      d3.select("#textbox")
        .html("")
        .append("text")
        .html(string);
    })
    

    .on("mouseout", function(d) {
      d3.select(this);
    })
    .attr("opacity", function(d, i) {
      return 1;
    }) //d.properties["HEB Awareness"]*d.properties["HEB Awareness"];})
    .attr("fill", function(d, i) {
      return colorScale(d.properties.value);
    });
    */
  // via http://stackoverflow.com/a/2901298                                                                                                                                                   \

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
