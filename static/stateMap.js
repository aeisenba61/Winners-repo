var state_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/stateOut.geojson';

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson';

map = L.map("stateMap", {
    center: [50, -116],
    zoom: 3,
    layers: [light],
});

// var stateLayer = new L.layerGroup();

analyzeState("diabetes");

function analyzeState(selected_var) {

    console.log(selected_var);

    var selected_var = selected_var;

    d3.queue()
        .defer(d3.json, state_url)
        .defer(d3.json, mcDs_url)
        .await(stateMap);

    function stateMap(error, stateData, mcDonalds) {

        var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
        "wGNLjMdRNK2PNjMwPtTVDA");

        var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
        "wGNLjMdRNK2PNjMwPtTVDA");

        var stateLayer;
        var mcDonaldsLayer;


        var choro_vars = {
            diabetes: "stDiabPer",
            obesity: "stObesityPer",
            pov: "st_low_inc_pop_per",
            snap: "st_snap_households_per"
        };

        var selected = choro_vars[selected_var];

        // Label for legend

        var all_labels = {diabetes: "Diabetic",
                        obesity: "Obese",
                        pov: "Low income",
                        snap: "Receiving SNAP"};

        var label = all_labels[selected_var];

        function getColor(d) {
            return  d > 40 ? '#dd1021' :
                    d > 35 ? '#e63a19' :
                    d > 30 ? '#ee550e' :
                    d > 25 ? '#f46d00' :
                    d > 20 ? '#f98400' :
                    d > 15 ? '#fc9900' :
                    d > 10 ? '#feae00' :
                    d > 5  ? '#ffc300' :
                            'white';
        }

        function style(feature) {
            return {
                fillColor: getColor(feature.properties[selected]),
                weight: .5,
                opacity: .5,
                color: '#dd1021',
                fillOpacity: 0.5
            };
        }

        function onEachFeature(feature, layer) {
        // Set mouse events to change map styling
            layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's   opacity changes to 90% so that it stands out
                mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity: 0.9
                    ,fillColor: getColor(feature.properties[selected])
                });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the   feature's opacity reverts back to 50%
                mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity:  0.5
                    ,fillColor: getColor(feature.properties[selected])
                });
                },
                // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                click: function(event) {
                map.fitBounds(event.target.getBounds());
                }
            });
            // Giving each feature a pop-up with information pertinent to it
            var formatVar = d3.format(".1f");
            var formatMcD = d3.format(".0f");
            layer.bindPopup("<h4 align='center'><b>" + feature.properties.name + "</b></h4> <hr><h4>"
                + label + ": " + formatVar(feature.properties[selected]) + "%<br>McDonalds locations: " + formatMcD(feature.properties.mcCount) + "</h4>");
        }

        if (stateLayer) {stateLayer.remove();};

        stateLayer = L.geoJson(stateData, {
            style: style,
            onEachFeature: onEachFeature
        });
        stateLayer.addTo(map);
        //layers(label);

    ///////////////////
    // McDonalds Markers
    ///////////////////

        mcDonaldsLayer = L.geoJSON(mcDonalds, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng);
            },
                style: {
                color: "black",
                fillColor:"black",
                radius: .25,
                opacity: .25
            },
            onEachFeature: function onEachFeature(feature, layer) {
                layer.bindPopup("<h4>McDonalds</h4><hr><p>City: " + feature.properties.city +", " + feature.properties.state)
            }
        });
        mcDonaldsLayer.addTo(map);
    ///////////////////////////////////////
    // Layers
    ///////////////////////////////////////

// I thought some variety of using this would work, but.... no.
// if (legend) {legend.remove();};



        var overlayMaps = {
            [label]: stateLayer,
            McDonalds: mcDonaldsLayer
        };

        var baseMaps = {
            "Light": light,
            "Dark": dark
        };


        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);

        var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 5, 10, 15, 20, 25, 30, 35, 40],
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }

                return div;
            };

            legend.addTo(map);

    }
}