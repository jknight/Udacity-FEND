var map;

function buildMap(locations, images) {

  var iconClickCounter = 0;

  var mapOptions = {
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.querySelector('#map'), mapOptions);

  // Set the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  pinPoster(locations);

  function createMapMarker(placeData, image) {

    // save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();
    var lon = placeData.geometry.location.lng();
    var name = placeData.formatted_address;
    var bounds = window.mapBounds;

    // additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    var infowindow = new google.maps.InfoWindow({
      content: '<h2>Namaste</h2><img class="mapImage" src="' + image + '">'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);

    });

    // given a location object, add pin to the map.
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);

    map.setCenter(bounds.getCenter());
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      //pull images from our array of images and use them for the map popups.
      //they're actually not related to the locations but ... oh well they look nice.
      var image = images[iconClickCounter];
      iconClickCounter = iconClickCounter == images.length - 1 ? 0 : ++iconClickCounter;

      createMapMarker(results[0], image);
    }
  }

  //given an array of locations, fire off Google place searches for each location
  function pinPoster(locations) {

    var service = new google.maps.places.PlacesService(map);

    for (var place in locations) {

      var request = {
        query: locations[place]
      };

      // Searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

}

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});

