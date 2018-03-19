var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
			.append("svg")
			.attr("width", svgWidth)
			.attr("height", svgHeight)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");
var dataPoint = "% diabetic adults"//document.getElementById("#selDataset").value
console.log(dataPoint)

// Append a div to the body to create tooltips, assign it a class
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0); 
 
d3.json("/state_info", function(err, stData) {
  if (err) throw err;
  console.log(stData);
  console.log(Object.keys(stData).length);
  var dataAttr = [];
  var dataMcd = []
  
  for(var prop in stData){
	var state = stData[prop]
	dataMcd.push(state.mcd_per_cap);
	dataAttr.push(state.diabetes);
    /*switch (dataPoint){
		case "% diabetic adults":
			dataAttr.push(+state.diabetes)
		case "% obese adults":
			dataAttr.push(+state.obesity)
		case "% households receiving SNAP benefits":
			dataAttr.push(+state.snap)
		case "% low income population":
			dataAttr.push(+state.pov)
		default:
			dataAttr.push(+state.diabetes)

	}*/
  };
  
  console.log(dataAttr)
  console.log(dataMcd)
  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([0, d3.max(dataMcd)]);
  yLinearScale.domain([0, d3.max(dataAttr)]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-25, -10])
    .html(function(data,index) {
      var stAbbrev = stData[index].state_abbrev;
      var mcdCount = +stData[index].mccount;
      return (stAbbrev + "<hr>McDonalds Count: " + mcdCount + "<br> "+ dataPoint +": " + dataAttr[index]);
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
      .on("click", function(data, index) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text(dataPoint);

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("McDonald's Per Capita");
});
