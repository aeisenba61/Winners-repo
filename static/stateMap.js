

var states_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/stateOut.geojson';
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +   "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
        "T6YbdDixkOBWH_k9GbS8JQ");
var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYmJhbGVzMTEiLCJhIjoiY2plYmptdmFwMGRydzJybzdpdzBxazk1aiJ9.ASSE0faIpkFAu87MR5RM0g");

var statesLayer = new L.layerGroup();

var map = L.map("stateMap", {
      center: [37.8, -96],
      zoom: 3,
      // noWrap: true,
      maxBounds: [[90,-180], [-90, 180]],
      layers: [outdoors]     
});

//////////////// state borders ///////////////

d3.json(states_url, function(error, statesData){
    if (error) throw error;
    console.log(statesData);
    // var map = L.map('stateMap').setView([37.8, -96], 3);

    // L.tileLayer(
    //     "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    //     "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    //     "T6YbdDixkOBWH_k9GbS8JQ"
    // );

    var geojson;

    function getColor(d) {
        return d > 70   ? '#800026' :
            d > 60      ? '#BD0026' :
            d > 50      ? '#E31A1C' :
            d > 40      ? '#FC4E2A' :
            d > 30      ? '#FD8D3C' :
            d > 20      ? '#FEB24C' :
            d > 10      ? '#FED976' :
                          '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.stDiabPer),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
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

       /* if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }*/
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    L.geoJson(statesData, {
        style: style,
        onEachFeature: function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
    }).addTo(statesLayer)
    statesLayer.addto(map)
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Diabetes Rate</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.diab_per + ' %'
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
    function getColor(d) {
    return d > 70   ? '#800026' :
        d > 60      ? '#BD0026' :
        d > 50      ? '#E31A1C' :
        d > 40      ? '#FC4E2A' :
        d > 30      ? '#FD8D3C' :
        d > 20      ? '#FEB24C' :
        d > 10      ? '#FED976' :
                      '#FFEDA0';
    }

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70],
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

//////////////// McDonalds Markers ///////////////

var mcDonalds = new L.layerGroup();
var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson'
var icon_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/images/McDs_Golden_Arches.png'

// d3.json(mcDs_url, function(mcData){
//     createFeatures(data.features)
// });


var mcIcon = L.icon({
  iconUrl: icon_url,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

d3.json(mcDs_url, function(mcData){
    var markers = L.geoJSON(mcData, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: mcIcon});
    }, onEachFeature: onEachFeature
    }).addTo(map);
});

function onEachFeature(feature, layer) {
    layer.bindPopUp("<h3>McDonalds</h3><hr><p>City:" + feature.properties.city +", " + feature.properties.state)
}


// function createFeatures()
//     function onEachFeature(feature, layer) {
//     layer.bindPopUp("<h3>McDonalds</h3><hr><p>City:" + feature.properties.city +", " + feature.properties.state)
//     }
//     var mcIcon = L.icon({
//         iconUrl: icon_url,
//         iconSize: [10, 10],
//         iconAnchor: [5, 5]
//     });
//     var markers = L.geoJSON(mcData, {
//         pointToLayer: function(feature, latlng) {
//         return L.marker(latlng, {icon: mcIcon});
//         }, onEachFeature: onEachFeature
//     });

//     createMap(markers)
// }

// function createIcon() {

///////////////////////////////////////
// Layers
///////////////////////////////////////

var overlayMaps = {
    "States": statesLayer,
    "McDonalds": mcDonalds
};

var baseMaps = {
    "Outdoor": outdoors,
    "Satellite": satMap
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);








