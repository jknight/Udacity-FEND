var Map = {
    iconClickCounter: 0,
    callbackCound: 0,

    init: function(koObservableLocations) {

        this.map = new google.maps.Map(document.getElementById("map"), {});

        this.mapBounds = new google.maps.LatLngBounds();

        this.createPins(koObservableLocations);
        
        this.map.fitBounds(this.mapBounds);

        window.addEventListener('resize', function(e) {
            console.log("Resize");
            this.map.fitBounds(this.mapBounds);
        });

    },

    //given an array of locations, fire off Google place searches for each location
    createPins: function(koObservableLocations) {

        var service = new google.maps.places.PlacesService(this.map);

        for (var i = 0; i < koObservableLocations().length; i++) {
            var loc = koObservableLocations()[i];

            var request = {
                query: loc.address
            };

            // Searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            var boundCallback = (function(results, status) {

                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    this.createMapMarker(results[0]);
                }
            }.bind(this));
            service.textSearch(request, boundCallback);
        }
    },

    createMapMarker: function(placeData, status) {

        var name = placeData.formatted_address;

        var marker = new google.maps.Marker({
            map: this.map,
            position: placeData.geometry.location,
            title: placeData.name
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<h2>Namaste</h2><img class="mapImage" src="???">'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(this.map, marker);
        });

        var lat = placeData.geometry.location.lat;
        var lon = placeData.geometry.location.lon;
        this.mapBounds.extend(new google.maps.LatLng(lat, lon));

    },

    updatePinsVisibility: function() {
        console.log("OK");
    }


};
