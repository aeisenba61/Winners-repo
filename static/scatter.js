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

	/*var dataAttr = [];
    var dataMcd = [];
    var dataAbbr = [];
    var dataCnt = [];

    for(var state in stData) {
    	var state = stData[state];
    	dataMcd.push(state.mcd_per_cap);
    	dataAttr.push(state[selected]);
		dataAbbr.push(state.state_abbrev);
		dataCnt.push(state.mcCount);
    };*/
	
	var stData = Object.values(stData).map(d => ({
	state: d.state_name,
	abbrev: d.state_abbrev,
	mcd_per_cap: d.mcd_per_cap,
	sel_var: d[selected]
    }));

	
    // Create scale functions
    var yLinearScale = d3.scaleLinear()
      .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
      .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([d3.min(stData, function(d) {return d.mcd_per_cap;}) - .000001, d3.max(stData, function(d) {return d.mcd_per_cap;}) + .000001]);
    yLinearScale.domain([0, d3.max(stData, function(d) {return d.sel_var;}) + 2]);
	
	// Format McD per capita
    var formatMcD = d3.format(".7f");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-3, 0])
      .html(function(stData) {
        var stAbbrev = stData.abbrev;
        var mcdCount = formatMcD(stData.mcd_per_cap);
        var sel_prop = stData.sel_var;
        return ("<b><u>" + stAbbrev + "</u></b><br>" + "McDonalds per capita: " + mcdCount + "<br>% "+ all_labels[selected] +": " + sel_prop);
      });

    chart.call(toolTip);

    chart.selectAll("circle")
      .data(stData)
      .enter().append("circle")
        .attr("cx", function(data, index) {
          return xLinearScale(data.mcd_per_cap);
        })
        .attr("cy", function(data, index) {
          return yLinearScale(data.sel_var);
        })
        .attr("r", "10")
        .attr("fill", "#dd1021")
		.attr("stroke","#ffc300")
		.attr("opacity","0.8")
		.on("click", function(data) {
		  toolTip.show(data);
          d3.select(this).style("fill", "#ffc300");
        })
        .on("mouseout", function(data) {
          toolTip.hide(data);
          d3.select(this).style("fill", "#dd1021");
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