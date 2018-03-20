var states_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/stateOut.geojson';

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var map = L.map("stateMap", {
      center: [37.8, -96],
      zoom: 3,
      // noWrap: true,
      // maxBounds: [[90,-180], [-90, 180]],
      layers: [light],
});

var statesLayer = new L.layerGroup();


// Default map
stateMap("diabetes");

function stateMap(selected){

    // Map HTML selected var to geoJSON var names

    var selected = `${selected}`;

    var choro_vars = {
        diabetes: "stDiabPer",
        obesity: "stObesityPer",
        pov: "st_low_inc_pop_per",
        snap: "st_snap_households_per"
    };

    // Label for legend

    var all_labels = {diabetes: "diabetic",
                      obesity: "obese",
                      pov: "low income",
                      snap: "receiving SNAP"};

    var label = all_labels[selected];

    // Change selected to geoJSON var name
    var selected = choro_vars[selected];

    d3.json(states_url, function(error, stateData){

        if (error) throw error;

        var geojson;

        function getColor(d) {
            return  d > 40 ? 'red' :
                    d > 35 ? 'orange' :
                    d > 30 ? 'yellow' :
                    d > 25 ? 'green' :
                    d > 20 ? 'blue' :
                    d > 15 ? 'lightsteelgray' :
                    d > 10 ? 'purple' :
                             'white';
        }
        function style(feature) {
            return {
                fillColor: getColor(feature.properties[selected]),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.9
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        geojson = L.geoJson(stateData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(statesLayer)
        statesLayer.addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
            this._div.innerHTML = '<h5><b>% ' + label + '</b></h5>' +  (props ?
                '<b>' + props.name + '</b><br />' + props[selected] + ' %'
                : 'Hover over a state');
        };

        info.addTo(map);

        function highlightFeature(e) {
            info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            info.update();
        }

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 30, 40],
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

        layers(label);
    })
}



// //////////////// McDonalds Markers ///////////////

// var mcDonalds = new L.layerGroup();
// var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson'
// var icon_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/images/McDs_Golden_Arches.png'


// var mcIcon = L.icon({
//   iconUrl: icon_url,
//   iconSize: [10, 10],
//   iconAnchor: [5, 5]
// });

// d3.json(mcDs_url, function(mcData){
//     var markers = L.geoJSON(mcData, {
//     pointToLayer: function(feature, latlng) {
//         return L.marker(latlng, {icon: mcIcon});
//     }, onEachFeature: onEachFeature
//     }).addTo(map);
// });

// function onEachFeature(feature, layer) {
//     layer.bindPopUp("<h3>McDonalds</h3><hr><p>City:" + feature.properties.city +", " + feature.properties.state)
// }

///////////////////////////////////////
// Layers
///////////////////////////////////////

function layers(selected) {

    var sel_layer = `% ${selected}`;

    var overlayMaps = {
        [sel_layer]: statesLayer
        // ,
        // "McDonalds": mcDonalds
    };

    var baseMaps = {
        "Light": light,
        "Satellite": satellitemap
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);

}