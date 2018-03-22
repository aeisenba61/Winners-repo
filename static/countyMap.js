var county_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/countyOut.geojson';
// var county_url_alt = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/produce%20geojson%20files/countyOut.js';

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var map = L.map("countyMap", {
      center: [50, -116],
      zoom: 6,
      // noWrap: true,
      // maxBounds: [[90,-180], [-90, 180]],
      layers: [light],
});

var countyLayer = new L.layerGroup();

// Default map
countyMap("diabetes");

function countyMap(selected){

    // Map HTML selected var to geoJSON var names

    var selected = `${selected}`;

    var choro_vars = {
        diabetes: "diab_per",
        obesity: "obesity_per",
        pov: "low_inc_pop_per",
        snap: "snap_households_per"
    };

    // Label for legend

    var all_labels = {diabetes: "diabetic",
                      obesity: "obese",
                      pov: "low income",
                      snap: "receiving SNAP"};

    var label = all_labels[selected];

    // Change selected to geoJSON var name
    var selected = choro_vars[selected];

    d3.json(county_url, function(error, countyData){

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
          layer.bindPopup("<h4 align='center'><b>" + feature.properties.NAME + "</h4> <hr> <h4 align='center'> Rate: " + feature.properties[selected] + "%<b></h4>");

        }
        geojson = L.geoJson(countyData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(countyLayer)
        countyLayer.addTo(map);

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

        layers(label);
    })
}

/////////////////// 
//McDonalds Markers 
///////////////////
 
var mcDonalds = new L.layerGroup();
var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson';
var icon_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/images/McDs_Golden_Arches.png';

var mcIcon = L.icon({
    iconUrl: icon_url,
    shadowUrl: icon_url,
  
    iconSize:     [50, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  d3.json(mcDs_url, function(response){
    L.geoJSON(response, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {icon: mcIcon});
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
        "McDonalds": mcDonalds
        ,[sel_layer]: countyLayer
        
    };

    var baseMaps = {
        "Light": light,
        "Dark": dark
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);

}