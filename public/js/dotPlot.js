var dotPlot = function(all_data, selector) {
  var usable_data = all_data["data"]["only_data"]
  var chart_params = all_data["data_params"]
  var margin = { top: 50, right: 40, bottom: 60, left: 120 };

  var factor;

  d3.selectAll(selector + " > *").remove();
  const average = usable_data[0]["non_group_score"]
  //d3.json(url, function(error, all_data) {
  var width = 280 - margin.left - margin.right;

  var height_dot = 240 - margin.top - margin.bottom;

  let tickN = 4;
  if (selector == "#demo-gender") {
    height_dot = 160 - margin.top - margin.bottom;
    tickN = 2
  } else if (selector == "#demo-income") {
    height_dot = 320 - margin.top - margin.bottom;
  }

  var selector_class = selector.slice(1, selector.length);

  var svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height_dot + margin.top + margin.bottom)
    .attr("transform", "translate(" + -24 + "," + 0 + ")");
    
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleBand().range([0, height_dot]).padding(.1);
  
  var widthScale_dot = d3.scaleLinear().range([0, width]);

  var heightScale_dot = d3.scalePoint().rangeRound([0, height_dot]).padding(1); //width - margin. //.ordinal()
  //.paddingInner(0.);
  //.rangeRoundBands([ margin.top, height_dot], 0.1);

  if (average < 1) {
    factor = 100 
  } else {
    factor = 1
  }

  x.domain([d3.min(usable_data, function (d) {
    return d.group_score-0.05;
    }), d3.max(usable_data, function (d) {
    return d.group_score+0.05;
    })])

  
  
  y.domain(usable_data.map(function(entry) { 
    return entry.question; })
  );
  
  g
      .append("text")
      .attr("class", "label")
      .attr("x", -90)
      .attr("y", -25)
      .text((d)=>{
        //let str = selector.split('-')[1]
        let str=chart_params['title']
        return str.charAt(0).toUpperCase() + str.slice(1);
      })
      .attr("font-size", 16)
      .attr("font-weight", 400)
      .attr("fill", "black")
      .attr("text-anchor", "beginning")

  var linesBetween = g
      .append("g")
      .selectAll("g") //selectAll("lines.between")
      .data(usable_data)
      .enter()
      .append("line");

  linesBetween
      .attr("class", "between")
      .attr("x1", function(d) {
        return x(+d.non_group_score);
      })
      .attr("y1", function(d) {
        return y(d.question.trim()) + y.bandwidth()/2; // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("x2", function(d) {
        return x(d.group_score);
      })
      .attr("y2", function(d) {
        return y(d.question.trim()) + y.bandwidth()/2; // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("stroke", "black")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", function(d, i) {
        return 1;
      })
      .attr("stroke-opacity", .3);
  
  var linesGrid = g
      .append("g")
      .selectAll("g") //selectAll("lines.between")
      .data(usable_data)
      .enter()
      .append("line");

  linesGrid
      .attr("class", "grid")
      .attr("x1", function(d) {
        return 0;
      })
      .attr("y1", function(d) {
        return y(d.question.trim()); // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("x2", function(d) {
        if(d.non_group_score>d.group_score ) {
          return x(d.group_score)
        } else {
          return x(d.non_group_score)
        }
      })
      .attr("y2", function(d) {
        return y(d.question.trim()); // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("stroke", "black")
      .attr("stroke-width", function(d, i) {
        return "0.5";
      })
      .attr("stroke-opacity", .2);




    var dots_customer = g
      .append("g")
      .selectAll("g") //.selectAll("circle.y2015")
      .data(usable_data)
      .enter()
      .append("rect");

    dots_customer
      .attr("class", "group")
      .attr("x", function(d) {
        return 0;
      })
      .attr("height", y.bandwidth())
      .attr("y", (d)=>{
        return y(d.question.trim())})
      .attr("width", (d)=>{
        return x(d.group_score)
      })
      .attr("fill", "#5e3c99")

  var linesAverage = g
      .append("g")
      .attr("class", "average")
    
  linesAverage
      .selectAll("line") //selectAll("lines.between")
      .data([average])
      .enter()
      .append("line")
      .attr("x1", function(d) {
        return x(d);
      })
      .attr("y1", function(d) {
        return -8; // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("x2", function(d) {
        return x(d);
      })
      .attr("y2", function(d) {
        return height_dot; // + heightScale_dot.bandwidth();//rangeBand()/2;
      })
      .attr("stroke", "#e66101")
      .attr("stroke-width", function(d, i) {
        return 2;
      });

    linesAverage
      .append("text")
      .attr("class", "label")
      .attr("x", x(average))
      .attr("y", -11)
      .text("AVG")
      .attr("font-size", 12)
      .attr("fill", "#e66101")
      .attr("text-anchor", "middle")

  var xaxis = svg
      .append("g")
      .attr("class", "xaxisdot")
      .attr("transform", "translate(" + margin.left + "," + (height_dot + margin.top) + ")")
      .attr("opacity", "1");

    xaxis.call(d3.axisBottom(x).ticks(tickN).tickFormat(d3.format(".0%")).tickSizeOuter(0));
  
  var yaxis = svg
      .append("g")
      .attr("class", "yaxisdot")
      .attr("transform", "translate(" + margin.left  + "," + margin.top + ")")
      .attr("opacity", "1");

    yaxis.call(d3.axisLeft(y).tickFormat((d)=>{
      if (d == "High school graduate") {
        return "HS graduate"
      } else {
        return d
      }
    }).tickSizeOuter(0).tickSize(0));

};
