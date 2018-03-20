function optionChanged(new_var) {

// Delete old donut and scatter
    var svgArea = d3.selectAll("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

// Rerun donut and scatter
    donut(new_var);
    renderScatter(new_var);

// Rerun choropleth
    choro_vars = {
        diabetes: "stDiabPer",
        obesity: "stObesityPer",
        pov: "st_low_inc_pop_per",
        snap: "st_snap_households_per"
    };

    choropleth(choro_vars[new_var]);

}
