var states_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/stateOut.geojson';

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var map = L.map("stateMap", {
      center: [50, -116],
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
                opacity: 1,
                // color: 'white',
                fillOpacity: 0.5
            };
        }

        function onEachFeature(feature, layer) {
        // Set mouse events to change map styling
          layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9,
                fillColor: getColor(feature.properties[selected])
              });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity:  0.5,
                fillColor: getColor(feature.properties[selected])
              });
            },
            // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
            click: function(event) {
              map.fitBounds(event.target.getBounds());
            }
          });
          // Giving each feature a pop-up with information pertinent to it
          layer.bindPopup("<h4 align='center'><b>" + feature.properties.name + "</h4> <hr> <h4 align='center'> Rate: " + Math.round(feature.properties[selected]).toFixed(1) + "%<b></h4>");

        }
        geojson = L.geoJson(stateData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(statesLayer)
        statesLayer.addTo(map);

        function createControl() {
            customControl = L.control({position: 'bottomright'});
            customControl.onAdd = function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom toggleContainer info legend');
                    grades = [0, 5, 10, 15, 20, 25, 30, 35, 40],
                    labels = [];

                    for (var i = 0; i < grades.length; i++) {
                        div.innerHTML +=
                            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                    }
                    return container;
            };
        customControl.addTo(map); 
        }

        var menuControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom menuControl info legend');
                container.onclick = function() {
                    if (menuControlActive === true) {
                        this.style.backgroundImage = 'url(/images/close.png)'
                        createControl()
                        menuControlActive = false
                    } else {
                        this.style.backgroundImage = 'url(/images/open.png)'
                        map.removeControl(customControl);
                        menuControlActive = true
                    }
                }
                return container;
            }
        });
        layers(label);
    })
}

/////////////////// 
//McDonalds Markers 
///////////////////

var mcDonalds = new L.layerGroup();
var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson'
var icon_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/images/McDs_Golden_Arches.png'

d3.json(mcDs_url, function(response){
    L.geoJSON(response, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        }
        ,
        style: {
            color: "black",
            fillColor:"black",
            radius: 1,
            opacity: .5},
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup("<h4>McDonalds</h4><hr><p>City: " + feature.properties.city +", " + feature.properties.state)
        }
    }).addTo(mcDonalds);
    mcDonalds.addTo(map)
});

///////////////////////////////////////
// Layers
///////////////////////////////////////

function layers(selected) {

    var sel_layer = `% ${selected}`;

    var overlayMaps = {
        [sel_layer]: statesLayer
        ,
        "McDonalds": mcDonalds
    };

    var baseMaps = {
        "Light": light,
        "Dark": dark
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);

}

