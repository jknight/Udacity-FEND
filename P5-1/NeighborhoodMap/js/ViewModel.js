//Udacity Requirement: use Knockout.js

var viewModel = {

    //Udacity Requirement: Your project should include at least 5 locations and display those locations when the page is loaded

    //TODO: these could be in a separate json file, loaded up server side, etc.
    _locations: [{
        name: "Farm",
        address: "96 Targosh Road, Candor NY 13743",
        website: "htp://??"
    }, {
        name: "Library",
        address: "2 Bank Street, Candor NY 13743",
        website: "http://???"
    }, {
        name: "Ice Cream Shop",
        address: "49 Owego Rd, Candor, NY 13743",
        website: "http://???"
    }, {
        name: "Village Psychic",
        address: "100 Main St, Candor, NY 13743",
        website: "http://???"
    }, {
        name: "Elementary School",
        address: "2 Academy St, Candor, NY 13743",
        website: "http://???"
    }],

    map: null,
    mapBounds: null,
    callbackCount: 0,
    filter: ko.observable(""),
    filteredLocations: ko.observableArray([]),

    // Main entry point
    init: function() {

        //Udacity Requirement: call the google map API only once
        this.map = new google.maps.Map(document.getElementById("map"), {});
        this.mapBounds = new google.maps.LatLngBounds();

        this.resolveLocations();

        //Udacity Requirement: implement a filter on the list view
        this.filter.subscribe(function(newValue) {

            //first filter the location list
            this.filteredLocations(this._locations.filter(function(f) {
                return f.name.toUpperCase().indexOf(this.filter().toUpperCase()) != -1
            }, this));

            this.updatePinsVisibility();

        }, this);

        ko.applyBindings(this);
    },


    // Given this._locations, use google's PlaceService API to turn addresses into locations. 
    resolveLocations: function() {

        var service = new google.maps.places.PlacesService(this.map);

        // define the callback function just once, but bind it with what it needs each time we loop
        var callback = function(i, results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {

                var placeData = results[0];

                var marker = new google.maps.Marker({
                    map: this.map,
                    position: placeData.geometry.location,
                    title: placeData.name,
                    formatted_address: placeData.formatted_address
                });

                google.maps.event.addListener(marker, 'click', (function() {
                    var infowindow = this._locations[i].infowindow;
                    var name = this._locations[i].name;

                    // Create the infoWindow only once at the first request.
                    // If a infoWindow is never needed, no point in hitting our 3rd party API 
                    if (infowindow == null) {

                        // pre-set a Loading message in the info window. Once the 3rd party search results 
                        // come back, this will be swapped out
                        infowindow = new google.maps.InfoWindow({
                            content: "<h1>Loading ...</h1>"
                        });

                        flickr.fetch(name, infowindow);

                        this._locations[i].infowindow = infowindow;
                    }
                    infowindow.open(this.map, marker);

                }).bind(this, i));

                this.mapBounds.extend(placeData.geometry.location);

                this._locations[i].marker = marker;
            }

            // Track our callbacks from marker creations and center / fit the map on the last one
            ++this.callbackCount;
            if (this.callbackCount == this._locations.length) {

                // this is the last one to call back: now that we have all the pins,
                // size & center the map. If we did this for each callback, or didn't do 
                // it last, then this would be a mess. Note that we can't rely on the 
                // order of callbacks since they're async
                this.map.fitBounds(this.mapBounds);
                this.map.setCenter(this.mapBounds.getCenter());

                // put our list of locations into an observable array ...
                this.filteredLocations(this._locations);
            }
        }

        // Given the function above, go through each location and run the search, binding it to 'this' and 'i'
        //  for context and tracking of which callback relates to which location
        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            var request = {
                query: location.address
            };

            var boundCallback = callback.bind(this, i);

            service.textSearch(request, boundCallback);
        }
    },

    // When a user filters, toggle the pin visibility. This does *not* hit the API again - it uses the pins from the
    //  initial load and simply shows or hides them depending on the filter
    updatePinsVisibility: function() {

        // clear the map first. In an ideal world, I'd only clear ones that need clearing then add any missing ...
        for (var i = 0; i < this._locations.length; i++) {
            this._locations[i].marker.setMap(null);
        }

        // now add any markers showing up in the knockout observable array of locations (eg not filtered)
        for (var i = 0; i < this.filteredLocations().length; i++) {
            var location = this.filteredLocations()[i];
            location.marker.setMap(this.map);
        }
    },

    // Udacity Requirement: Add additional functionality to animate a map marker when either 
    //                     the list item associated with it or the map marker itself is selected.
    highlightLocation: function(location) {
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            location.marker.setAnimation(null);
        }, 2000);
    }

};
