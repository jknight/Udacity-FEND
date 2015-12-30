var viewModel = {

    //Requirement: "Your project should include at least 5 locations and display those locations when the page is loaded"
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

    //main entry point
    init: function() {
        //add a map marker to each location
        this.map = new google.maps.Map(document.getElementById("map"), {});
        this.mapBounds = new google.maps.LatLngBounds();

        this.resolveLocations();

        this.filter.subscribe(function(newValue) {

            //first filter the location list
            this.filteredLocations(this._locations.filter(function(f) {
                return f.name.toUpperCase().indexOf(this.filter().toUpperCase()) != -1
            }, this));

            this.updatePinsVisibility();

        }, this);

        ko.applyBindings(this);
    },

    resolveLocations: function() {

        var service = new google.maps.places.PlacesService(this.map);

        //NOTE that this anonyous function needs to be bound to 'this' and 'i'
        var callback = function(i, results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {

                var placeData = results[0];

                var marker = new google.maps.Marker({
                    map: this.map,
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

                //this.mapBounds.extend(marker.getPosition());
                this.mapBounds.extend(placeData.geometry.location);

                this._locations[i].marker = marker;
            }

            ++this.callbackCount;
            if (this.callbackCount == this._locations.length) {

                console.log("ALL DONE!!", this._locations);

                //this is the last one to call back: now that we have all the pins,
                //size & center the map. If we did this for each callback, or didn't do 
                //it last, then this would be a mess. Note that we can't rely on the 
                //order of callbacks since they're async
                this.map.fitBounds(this.mapBounds);
                this.map.setCenter(this.mapBounds.getCenter());

                //put our list of locations into an observable array ...
                this.filteredLocations(this._locations);
            }
        }

        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            var request = {
                query: location.address
            };

            var boundCallback = callback.bind(this, i);

            service.textSearch(request, boundCallback);
        }
    },

    updatePinsVisibility: function() {

        //clear the map first. In an ideal world, I'd only clear ones that need clearing then add any missing ...
        for (var i = 0; i < this._locations.length; i++) {
            this._locations[i].marker.setMap(null);
        }

        //now add any markers showing up in the knockout observable array of locations (eg not filtered)
        for (var i = 0; i < this.filteredLocations().length; i++) {
            var location = this.filteredLocations()[i];
            location.marker.setMap(this.map);
        }
    },

    //bounce the location marker for 2 seconds
    highlightLocation: function(location) {
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            location.marker.setAnimation(null);
        }, 2000);
    }

};
