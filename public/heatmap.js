var heatmap = (function heatmap(url, selector, params){
        var margin = {top: 80, right: 25, bottom: 450, left: 450}//{top: 50, right: 200, bottom: 60, left: 110};

        if ('width' in params){
            width = params.width - margin.left - margin.right;
        }
        else{
            width = 1000 - margin.left - margin.right;
        }

        if ('height' in params){
            height = params.height - margin.top - margin.bottom;
        }
        else{
            height = 1050 - margin.top - margin.bottom;
        }



        d3.selectAll(selector + " > *").remove();

        var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        d3.json(url, function(error, all_data) {
		
		// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
		console.log(all_data);
		var myGroups = d3.map(all_data, function(d){return d.group;}).keys();
		var myVars = d3.map(all_data, function(d){return d.variable;}).keys();
		console.log(myGroups);
		// Build X scales and axis:
		var x = d3.scaleBand()
		    .range([ 0, width ])
		    .domain(myGroups)
		    .padding(0.05);
		svg.append("g")
		    .style("font-size", 15)
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x).tickSize(0))
		    .selectAll("text")  
		    .style("text-anchor", "end")
		    .attr("dx", "-.8em")
		    .attr("dy", ".15em")
		    .attr("transform", "rotate(-65)")

		    .select(".domain").remove();
		
		// Build Y scales and axis:
		var y = d3.scaleBand()
		    .range([ height, 0 ])
		    .domain(myVars)
		    .padding(0.05);
		svg.append("g")
		    .style("font-size", 15)
		    .call(d3.axisLeft(y).tickSize(0))
		    .select(".domain").remove();
		
		// Build color scale
		var myColor = d3.scaleSequential()
		    .interpolator(d3.interpolateInferno)
		    .domain([0,1]);
		    
		    // create a tooltip
		var tooltip = d3.select(selector)
		    .append("div")
		    .style("opacity", 0)
		    .attr("class", "tooltip")
		    .style("background-color", "white")
		    .style("border", "solid")
		    .style("border-width", "2px")
		    .style("border-radius", "5px")
		    .style("width", "300px")
		    .style("padding", "5px")
		    .style("position", "relative")
		    
		    // Three function that change the tooltip when user hover / move / leave a cell
		    var mouseover = function(d) {
		    tooltip
		    .style("opacity", 1)
		    d3.select(this)
		    .style("stroke", "black")
		    .style("opacity", 1)
		}
		var mousemove = function(d) {
		    tooltip
		    .html((d.variable + " x " + d.group +"<br>correlation: " + (d.value*100).toFixed(1)) + (d.sample>=10? ("<br> with average age: " + d.age.toFixed(0) + "<br> and gender ratio " + (d.gender*100).toFixed(1) + "% male") : ("")))
		    .style("left", (d3.mouse(this)[0]+100) + "px")
		    .style("top", (d3.mouse(this)[1]-1000) + "px")
		}
		var mouseleave = function(d) {
		    tooltip
		    .style("opacity", 0)
		    d3.select(this)
		    .style("stroke", "none")
		    .style("opacity", 0.8)
		}
		
		// add the squares
		svg.selectAll()
		    .data(all_data)//, function(d) {return d.group+':'+d.variable;})
		    .enter()
		    .append("rect")
		    .attr("x", function(d) {return x(d.group) })
		    .attr("y", function(d) {  return y(d.variable) })
		    .attr("rx", 4)
		    .attr("ry", 4)
		    .attr("width", x.bandwidth() )
		    .attr("height", y.bandwidth() )
		    .style("fill", function(d) {  return myColor(d.value)} )
		    .style("stroke-width", 4)
		    .style("stroke", "none")
		    .style("opacity", 0.8)
		    .on("mouseover", mouseover)
		    .on("mousemove", mousemove)
		    .on("mouseleave", mouseleave);
	    })
	
	// Add title to graph
	svg.append("text")
	.attr("x", 0)
	.attr("y", -50)
	.attr("text-anchor", "left")
	.style("font-size", "22px")
	.text("Podcast correlation heatmap");
	/*
	// Add subtitle to graph
	svg.append("text")
	.attr("x", 0)
	.attr("y", -20)
	.attr("text-anchor", "left")
	.style("font-size", "14px")
	.style("fill", "grey")
	.style("max-width", 400)
	.text("A short description of the take-away message of this chart.");*/
    });