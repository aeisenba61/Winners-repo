/////////////////////
// Default
/////////////////////

// Donut


function donut(state_info) {

    var formatSum = d3.format(".1s");
    var padding = 10;
    var radius = d3.scaleSqrt()
        .range([0, 220]);
    var color = d3.scaleOrdinal()
        .range(["#dd1021", "#ffc300"]);

    var pie = d3.pie()
        .sort(null)
        .padAngle(0.02)
        .value(function(d) { return d.population; });

    var arc = d3.arc()
        .padRadius(50);

    Plotly.d3.json("/state_info", function(error, state_info, index) {
        if (error) return console.warn(error);
        var diabetes = [];
        var state_names = []
        for (i in response.otu_ids.slice(0,10)) {
            otu_labs.push(otu[i]);
        }
        var data = [{values: response.sample_values.slice(0,10),
                     labels: response.otu_ids.slice(0,10),
                     text: otu_labs,
                     hoverinfo: 'text + values + labels',
                     textinfo: 'percent',
                     type: 'pie'}];
        var layout = {autosize: false,
                      width: 450,
                      height: 430,
                      margin: {
                        l: 50, r: 50, b: 50, t: 50
                      }
                  };
        Plotly.plot("pie", data, layout);
    })
}




////////////////////////////////////////
// Option changed function
////////////////////////////////////////

function optionChanged(sample) {
    var sampURL = `/samples/${sample}`
    var metaURL = `/metadata/${sample}`
    var wfreqURL = `/wfreq/${sample}`

    // New data - sample values & OTU IDs
    Plotly.d3.json(sampURL, function(error, newdata) {
      if (error) return console.warn(error);
      updateOTU(newdata);
    });

    // New data - wash freq
    Plotly.d3.json(wfreqURL, function(error, newfreq){
        gauge(newfreq);
    });

    // New metadata
    Plotly.d3.json(metaURL, function(error, newmeta){
        metaHTML = ""
        for (key in newmeta) {
            metaHTML += "<b>" + key + ": </b>" + newmeta[key] + "<br>";
        }
        meta.innerHTML = metaHTML;
    });
}




///////////////////////////
// Restyle
///////////////////////////

function updateOTU(newdata){
  Plotly.d3.json("/otu", function(error, otu) {
    if (error) return console.warn(error);
    console.log("otu updated");
    updatePlots(otu, newdata);
  })
}

function updatePlots(otu, newdata) {
  // OTU
  var new_otu = [];
  for (i in newdata.otu_ids) {
        new_otu.push(otu[i]);
  }
  console.log("plots updated");
  // Pie
  var Pie = document.getElementById("pie");
  Plotly.restyle(Pie, "labels", [newdata.otu_ids.slice(0,10)]);
  Plotly.restyle(Pie, "values", [newdata.sample_values.slice(0,10)]);
  Plotly.restyle(Pie, "text", [new_otu.slice(0,10)]);
  // Bub
  var Bub = document.getElementById("bubble");
  Plotly.restyle(Bub, "x", [newdata.otu_ids]);
  Plotly.restyle(Bub, "y", [newdata.sample_values]);
  Plotly.restyle(Bub, "text", [new_otu]);
}


