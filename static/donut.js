/////////////////////
// Render donut
/////////////////////

function donut(selected) {

// Incorporate selected variable

    var var_n = `${selected}_n`;
    var selected = `${selected}`;

    var all_labels = {diabetes: "diabetic",
                      obesity: "obese",
                      pov: "low income",
                      snap: "receiving SNAP"};


// Format pie

    var formatMcD = d3.format(".7f");

    var radius = d3.scaleSqrt()
        .range([0, 100]);
    var color = d3.scaleOrdinal()
        .range(["#dd1021", "#ffc300"]);

    var pie = d3.pie()
        .sort(null)
        .padAngle(0.02)
        .value(function(d) { return d.n; });

    var arc = d3.arc()
        .padRadius(50);

// JSON call

    d3.json("/state_info", function(error, response) {

        var response = Object.values(response).map(d => ({
            state: d.state_name,
            abbrev: d.state_abbrev,
            mcd_per_cap: d.mcd_per_cap,
            var_n: d[selected],
            sel_var: [{status: `% ${all_labels[selected]}`, n: d[selected]},
                       {status: `% not ${all_labels[selected]}`, n: 100 - d[selected]}]
        }));

// Set domains

        radius.domain([0, d3.max(response, function(d) {return d.mcd_per_cap;})]);
        color.domain([`% ${all_labels[selected]}`, `% not ${all_labels[selected]}`]);

// Create legend

        var legend = d3.select("#donut-legend").append("svg")
                .attr("class", "legend")
                .attr("width", 400)
                .attr("height", 100)
            .selectAll("g")
                .data([`% ${all_labels[selected]}`, `% not ${all_labels[selected]}`])
            .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return d; });

        var svg = d3.select("#donut").selectAll(".pie")
            .data(response.sort(function(a, b) { return b.mcd_per_cap - a.mcd_per_cap; }))
          .enter().append("svg")
            .attr("class", "pie")
            .each(multiple)
          .select("g");

// Add labels for donuts

        var label = svg.append("text")
            .attr("class", "label");

        label.append("tspan")
            .attr("class", "label-name")
            .attr("dx", 0)
            .attr("dy", "-2em")
            .text(function(d) { return d.abbrev; });
        label.append("tspan")
            .attr("class", "label-value")
            .attr("x", 0)
            .attr("dy", "1.7em")
            .text(function(d) { return formatMcD(d.mcd_per_cap); });
        label.append("tspan")
            .attr("class", "label-value")
            .attr("x", 0)
            .attr("dy", "1.1em")
            .text(function(d) { return "McD per capita"; });
        label.append("tspan")
            .attr("class", "label-value")
            .attr("x", 0)
            .attr("dy", "1.7em")
            .text(function(d) { return d.var_n + `% ${all_labels[selected]}`; });

// Add donuts

        function multiple(d) {
            var r = radius(d.mcd_per_cap);

            var svg = d3.select(this)
                .attr("width", r * 2)
                .attr("height", r * 2)
              .append("g")
                .attr("transform", "translate(" + r + "," + r + ")");

            var arcs = svg.selectAll(".arc")
                .data(function(d) { return pie(d.sel_var); })
              .enter().append("path")
                .attr("class", "arc")
                .attr("d", arc.outerRadius(r).innerRadius(r * 0.6))
                .style("fill", function(d) { return color(d.data.status); });

      }
    });
}

/////////////////////
// Default donut is diabetes
/////////////////////

donut("diabetes");