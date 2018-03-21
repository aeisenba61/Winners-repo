
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiaXJvbmJlYXJkIiwiYSI6ImNpbDhqOXdmeTBjc3N2am0yd3JneWo2NDMifQ." +
  "wGNLjMdRNK2PNjMwPtTVDA");

var map = L.map("stateMap", {
      center: [50, -116],
      zoom: 3,
      // noWrap: true,
      // maxBounds: [[90,-180], [-90, 180]],
      layers: [dark],
});
var mcDs_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/clean-data/geojson/mcDs.geojson'
var icon_url = 'https://raw.githubusercontent.com/aeisenba61/Winners-repo/master/images/McDs_Golden_Arches.png'

d3.json(mcDs_url, function(response){
    var mcIcon = L.icon({
      iconUrl: 'tester.png',
      shadowUrl: 'tester.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4 , 62],  // the same for the shadow
      popupAnchor:  [-3,-76] // point from which the popup should open relative to the iconAnchor
    });
    L.geoJSON(response, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {icon: mcIcon});
            // return L.circleMarker(latlng);
        },
        style: {
            color: "yellow",
            fillColor:"yellow"}
        //     ,
        // onEachFeature: function onEachFeature(feature, layer) {
        //     layer.bindPopUp("<h3>McDonalds</h3><hr><p>City:" + feature.properties.city +", " + feature.properties.state)
        // }
    }).addTo(map);
});