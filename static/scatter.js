// Responsive
d3.select(window).on("resize", resize);

function resize() {
  var svgArea = d3.select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    renderScatter("diabetes");
  }
}

// Render default chart
renderScatter("diabetes");

function renderScatter(selected) {

// Incorporate selected variable

  var var_n = `${selected}_n`;
  var selected = `${selected}`;

    var all_labels = {diabetes: "diabetic",
                      obesity: "obese",
                      pov: "low income",
                      snap: "receiving SNAP"};
  
  


// Scatter stuff

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = { top: 20, right: 60, bottom: 85, left: 50 };

  var width = Math.min(1032, svgWidth - margin.left - margin.right);
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
  			.append("svg")
  			.attr("width", svgWidth)
  			.attr("height", svgHeight)
  			.append("g")
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chart = svg.append("g");
  var dataPoint = `% ${all_labels[selected]}`


  // Append a div to the body to create tooltips, assign it a class
  d3.select("#scatter")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.json("/state_info", function(err, stData) {

    if (err) throw err;

	var dataAttr = [];
    var dataMcd = [];
    var dataAbbr = [];
    var dataCnt = [];

    for(var state in stData) {
    	var state = stData[state];
    	dataMcd.push(state.mcd_per_cap);
    	dataAttr.push(state[selected]);
		dataAbbr.push(state.state_abbrev);
		dataCnt.push(state.mcCount);
    };

	
    // Create scale functions
    var yLinearScale = d3.scaleLinear()
      .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
      .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([d3.min(dataMcd) - .000001, d3.max(dataMcd) + .000001]);
    yLinearScale.domain([0, d3.max(dataAttr) + 2]);

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-25, -40])
      .html(function(d,i) {
        var stAbbrev = dataAbbr[i];
        var mcdCount = +dataCnt[i];
		var stAttr = +dataAttr[i]
        return (stAbbrev + "<hr>McDonalds Count: " + mcdCount + "<br> "+ dataPoint +": " + stAttr);
      });

    chart.call(toolTip);

    chart.selectAll("circle")
      .data(dataMcd)
      .enter().append("circle")
        .attr("cx", function(data, index) {
          return xLinearScale(dataMcd[index]);
        })
        .attr("cy", function(data, index) {
          return yLinearScale(dataAttr[index]);
        })
        .attr("r", "10")
        .attr("fill", "#dd1021")
		.attr("stroke","#ffc300")
		.attr("opacity","0.8")
		.on("click", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

    chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-30)"
                });;

    chart.append("g")
      .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text(dataPoint);

  // Append x-axis labels
    chart.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 50) + ")")
      .attr("class", "axisText")
      .text("McDonald's Per Capita");
  });

}



/////////////////////
// Update
/////////////////////

function optionChanged(new_var) {

// Delete old
    var svgArea = d3.selectAll("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

// Rerun
    renderScatter(new_var);
}