//Udacity Requirement: use Knockout.js

var viewModel = {

    //Udacity Requirement: Your project should include at least 5 locations and display those locations when the page is loaded

    //TODO: this could be in a separate json file, loaded up server side, etc.
    data: [{
        name: "Farm",
        address: "96 Targosh Road, Candor NY 13743"
    }, {
        name: "Library",
        address: "2 Bank Street, Candor NY 13743"
    }, {
        name: "Ice Cream Shop",
        address: "49 Owego Rd, Candor, NY 13743"
    }, {
        name: "Village Psychic",
        address: "100 Main St, Candor, NY 13743"
    }, {
        name: "Elementary School",
        address: "2 Academy St, Candor, NY 13743"
    }, {
        name: "Hunting Lodge",
        address: "188 Tubbs Hill Rd, Candor, NY 13743"
    }],

    // public member variables (view will access these)
    filter: ko.observable(""),
    locations: ko.observableArray(),
    sideBarVisible: ko.observable(false),

    // private member variables 
    map: null,
    mapBounds: null,
    callbackCount: 0,
    infoWindow: null,

    // ** Public methods ** 

    // Main entry point
    // public - called by google maps api callback
    init: function() {

        // Udacity Requirement: call the google map API only once
        this.map = new google.maps.Map(document.getElementById("map"), {});
        this.mapBounds = new google.maps.LatLngBounds();

        // generic info window that we'll recycle for all markers
        this.infoWindow = new google.maps.InfoWindow();

        this.buildLocationPlaces();

        // Udacity Requirement: implement a filter on the list view
        this.filter.subscribe(function() {
            var filter = this.filter();
            this.infoWindow.close();
            this.drawLocations(filter);
        }, this);

        window.addEventListener('resize', (function(e) {
            this.map.fitBounds(this.mapBounds);
            this.map.setCenter(this.mapBounds.getCenter());
        }).bind(this));
    },

    // Udacity Requirement: Add additional functionality to animate a map marker when either 
    //                     the list item associated with it or the map marker itself is selected.
    // Note that this function is used for both marker and list item selection
    // public 
    locationSelected: function(i) {

        this.sideBarVisible(false);

        var marker = this.data[i].marker;

        // bounce the marker around a little
        this.animateMarker(marker);

        var flickrHtml = this.data[i].flickrHtml;
        var name = this.data[i].name;
        var address = this.data[i].address;

        // NOTE: we're hitting the 3rd party API as little as needed: only on demand per item and only
        //      once: box up the results and serve our user heated up leftovers the next time around
        if (flickrHtml) { //PULL FROM CACHE !
            this.infoWindow.setContent(flickrHtml);
            this.infoWindow.open(this.map, marker);
        } else { // Make a trip out to the internets. Do this only once ! (also consider: localStorage)
            this.infoWindow.setContent("<h3>space monkeys fetching bytes ...</h3>");
            flickr.fetch(name, address, (function(i, html) {
                this.infoWindow.setContent(html);
                // cache the result
                this.data[i].flickrHtml = html;
            }).bind(this, i));
        }

        // smoothly move the map so the selected item is in the middle
        this.map.panTo(marker.getPosition());
        // ... and then move down a wee little bit to give the info window some space
        this.map.panBy(0, -200);

        this.infoWindow.open(this.map, marker);
    },


    // public - called via knockout binding
    toggleSideBar: function() {
        this.sideBarVisible(!this.sideBarVisible());
    },

    // ** Private methods **

    // private
    drawLocations: function(filter) {

        // clear out the observable array and re-populate it with just the items that match the filter
        this.locations([]);

        var filterUpper = filter.toUpperCase();

        for (var i = 0; i < this.data.length; i++) {

            var location = this.data[i];
            if (typeof(location.marker) != "undefined")
                location.marker.setVisible(false);

            var name = null;
            if (typeof(filter) == "undefined")
                name = location.name;
            else if (location.name.toUpperCase().indexOf(filterUpper) != -1)
                name = location.name; 

            if (name !== null) { // either this location matches the filter, or there is no filter

                this.locations.push(location);

                if (typeof(location.marker) != "undefined")
                    location.marker.setVisible(true);
            }
        }
    },

    // Given the set of locations (this.data), use google's PlaceService API to turn addresses into locations. 
    // private
    buildLocationPlaces: function() {

        var service = new google.maps.places.PlacesService(this.map);

        // Given the function above, go through each location and run the search, binding it to 'this' and 'i'
        //  for context and tracking of which callback relates to which location
        for (var i = 0; i < this.data.length; i++) {

            var location = this.data[i];
            var request = {
                query: location.address
            };

            var boundCallback = this.buildLocationPlacesCallback.bind(this, i);

            service.textSearch(request, boundCallback);
        }
    },

    // private
    buildLocationPlacesCallback: function(i, results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var placeData = results[0];

            var marker = new google.maps.Marker({
                map: this.map,
                position: placeData.geometry.location,
                title: placeData.name,
                formatted_address: placeData.formatted_address
            });

            google.maps.event.addListener(marker, 'click', this.locationSelected.bind(this, i));

            this.mapBounds.extend(placeData.geometry.location);

            this.data[i].id = i;
            this.data[i].marker = marker;
        }

        // Track our callbacks from marker creations and center / fit the map on the last one. This way we 
        // size the map just once when all the callbacks are in
        ++this.callbackCount;

        if (this.callbackCount == this.data.length) {

            // this is the last one to call back: now that we have all the pins resolved,
            // size & center the map. If we did this for each callback, or didn't do 
            // it last, then this would be a mess. Note that we can't rely on the 
            // order of callbacks since they're async
            this.map.fitBounds(this.mapBounds);
            this.map.setCenter(this.mapBounds.getCenter());

            this.locations(this.data);
            ko.applyBindings(this);
        }
    },

    // private
    animateMarker: function(marker) {

        marker.setAnimation(google.maps.Animation.BOUNCE);

        // .. and stop the bouncing after a couple seconds ...
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);
    }
};
