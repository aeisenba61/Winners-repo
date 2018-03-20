function optionChanged(new_var) {

// Delete old donut and scatter
    var svgArea = d3.selectAll("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

// Rerun
    donut(new_var);
    renderScatter(new_var);
    choropleth(new_var);

}
