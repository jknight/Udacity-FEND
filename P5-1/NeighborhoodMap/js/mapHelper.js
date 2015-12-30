var MapHelper = {
    iconClickCounter: 0,
    callbackCount: 0,
    locationCount: 0,
    koObservableLocations: [],
    markers: [],

    init: function(koObservableLocations) {

        this.koObservableLocations = koObservableLocations;

        //TODO: consider moving this 'tight coupling' with UI outside of this class
        this.map = new google.maps.Map(document.getElementById("map"), {});

        this.mapBounds = new google.maps.LatLngBounds();

        //this.createPins();

        window.addEventListener('resize', function(e) {
            console.log("Resize");
        });

    },

    createPins: function() {

        var service = new google.maps.places.PlacesService(this.map);
        this.locationCount = this.koObservableLocations().length;
        console.log("SERVICE", service);

        // Searches the Google Maps API for location data and runs the callback
        // function with the search results after each search.
        var boundCallback =
            (function(results, status) {

                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var marker = this.createMapMarker(results[0]);

                    this.mapBounds.extend(marker.getPosition());
                    marker.location = location;

                    this.markers.push(marker);
                }

                ++this.callbackCount;
                if (this.callbackCount == this.locationCount) {
                    //this is the last one to call back: now that we have all the pins,
                    //size & center the map. If we did this for each callback, or didn't do 
                    //it last, then this would be a mess. Note that we can't rely on the 
                    //order of callbacks since they're async
                    this.map.fitBounds(this.mapBounds);
                    this.map.setCenter(this.mapBounds.getCenter());

                    this.updatePinsVisibility();
                }
            }.bind(this));


        for (var i = 0; i < this.koObservableLocations().length; i++) {
            var location = this.koObservableLocations()[i];

            var request = {
                query: location.address,
                data: "hello"
            };

            service.textSearch(request, boundCallback);
        }
    },

    //REFACTOR: this function is doing too many unrelated things
    createMapMarker: function(placeData) {

        console.log("PD", placeData);
        var marker = new google.maps.Marker({
            //map: this.map,
            position: placeData.geometry.location,
            title: placeData.name,
            formatted_address: placeData.formatted_address
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<h2>Namaste</h2><img class="mapImage" src="???">'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(this.map, marker);
        });

        return marker;
    },

    updatePinsVisibility: function() {

        //check all the markers. Show any that appear in the visible list of locations.

        //TODO: correlate !

        for (var i = 0; i < this.markers.length; i++) {

            var marker = this.markers[i];
            var visible = false;
            for (var j = 0; j < this.koObservableLocations().length; j++) {
                var location = this.koObservableLocations()[j];
                //set the corresponding marker to visible
                console.log(marker.formatted_address + "--vs--" + location.name);
                //if (marker.name == location.name) {
                visible = true;
                break;
                //}
            }
            if (visible)
                marker.setMap(this.map);
            else
                marker.setMap(null);
        }
        
    }
};
