function optionChanged(new_var) {

// Delete old donut and scatter
    var svgArea = d3.selectAll("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

// Rerun
    donut(new_var);
    renderScatter(new_var);
    document.getElementById('countyMap').contentWindow.analyzeCounty(new_var);
    document.getElementById('stateMap').contentWindow.analyzeState(new_var);

}
