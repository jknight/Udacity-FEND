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
    }, {
        name: "Ice Cream Shop",
        address: "49 Owego Rd, Candor, NY 13743",
    }, {
        name: "Village Psychic",
        address: "100 Main St, Candor, NY 13743",
    }, {
        name: "Elementary School",
        address: "2 Academy St, Candor, NY 13743",
    }, {
        name: "Hunting Lodge",
        address: "188 Tubbs Hill Rd, Candor, NY 13743",
    }],

    // public member variables (view will access these)
    filter: ko.observable(""),
    locations: ko.observableArray(),
    sideBarVisible: ko.observable(false),

    // private member variables 
    _map: null,
    _mapBounds: null,
    _callbackCount: 0,
    _infoWindow: null,

    // ** Public methods ** 

    // Main entry point
    // public - called by google maps api callback
    init: function() {

        // Udacity Requirement: call the google map API only once
        this._map = new google.maps.Map(document.getElementById("map"), {});
        this._mapBounds = new google.maps.LatLngBounds();

        // generic info window that we'll recycle for all markers
        this._infoWindow = new google.maps.InfoWindow();

        this._buildLocationPlaces();

        // Udacity Requirement: implement a filter on the list view
        this.filter.subscribe(function() {
            var filter = this.filter();
            this._drawLocations(filter);
        }, this);

        window.addEventListener('resize', (function(e) {
            this._map.fitBounds(this._mapBounds);
            this._map.setCenter(this._mapBounds.getCenter());
        }).bind(this));
    },

    // public - called via knockout binding
    locationClicked: function(index) {
      this._locationClicked(index);
    },

    // public - called via knockout binding
    toggleSideBar: function() {
      this.sideBarVisible(!this.sideBarVisible());
    }, 

    // ** Private methods **

    // private
    _drawLocations: function(filter) {

        // clear out the observable array and re-populate it with just the items that match the filter
        this.locations([]);

        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            if (typeof(location.marker) != "undefined")
                location.marker.setMap(null);

            //TODO: this could be cleaner
            var name = null;
            if (typeof(filter) == "undefined")
                name = location.name;
            else if (location.name.indexOf(filter) != -1)
                name = location.name; //.replace(filter, "<b>" + filter + "</b>");

            if (name !== null) { // this location matches the filter, or there is no filter

                //$("#l" + i).on("click", this._locationClicked.bind(this, i));
                this.locations.push(location);

                if (typeof(location.marker) != "undefined")
                    location.marker.setMap(this._map);
            }
        }
    },

    // Given the set of locations (this._locations), use google's PlaceService API to turn addresses into locations. 
    // private
    _buildLocationPlaces: function() {

        var service = new google.maps.places.PlacesService(this._map);

        // Given the function above, go through each location and run the search, binding it to 'this' and 'i'
        //  for context and tracking of which callback relates to which location
        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            var request = {
                query: location.address
            };

            var boundCallback = this._buildLocationPlacesCallback.bind(this, i);

            service.textSearch(request, boundCallback);
        }
    },

    // private
    _buildLocationPlacesCallback: function(i, results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var placeData = results[0];

            var marker = new google.maps.Marker({
                map: this._map,
                position: placeData.geometry.location,
                title: placeData.name,
                formatted_address: placeData.formatted_address
            });

            google.maps.event.addListener(marker, 'click', this._locationClicked.bind(this, i));

            this._mapBounds.extend(placeData.geometry.location);

            this._locations[i].id = i;
            this._locations[i].marker = marker;
        }

        // Track our callbacks from marker creations and center / fit the map on the last one. This way we 
        // size the map just once when all the callbacks are in
        ++this._callbackCount;

        if (this._callbackCount == this._locations.length) {

            // this is the last one to call back: now that we have all the pins resolved,
            // size & center the map. If we did this for each callback, or didn't do 
            // it last, then this would be a mess. Note that we can't rely on the 
            // order of callbacks since they're async
            this._map.fitBounds(this._mapBounds);
            this._map.setCenter(this._mapBounds.getCenter());

            this.locations(this._locations);
            ko.applyBindings(this);
        }

    },

    // Udacity Requirement: Add additional functionality to animate a map marker when either 
    //                     the list item associated with it or the map marker itself is selected.
    // Note that this function is used for both marker and list item selection
    // private
    _locationClicked: function(i) {

        this.sideBarVisible(false);

        var marker = this._locations[i].marker;

        // bounce the marker around a little
        this._animateMarker(marker);

        var flickrHtml = this._locations[i].flickrHtml;
        var name = this._locations[i].name;
        var address = this._locations[i].address;

        //NOTE: we're hitting the 3rd party API as little as needed: only on demand per item and only
        //      once: box up the results and serve our user heated up leftovers the next time around
        if (flickrHtml) { //PULL FROM CACHE !
            //console.log("Pulling flicker html from cache for " + name + " **  not making another trip **");
            this._infoWindow.setContent(flickrHtml);
            this._infoWindow.open(this._map, marker);
        } else { //Make a trip out to the internets. Do this only once !
            this._infoWindow.setContent("<h1>Loading ...</h1>");
            flickr.fetch(name, address, (function(i, html) {
                this._infoWindow.setContent(html);
                //cache the result
                this._locations[i].flickrHtml = html;
            }).bind(this, i));
        }

        // smoothly move the map so the selected item is in the middle
        this._map.panTo(marker.getPosition());
        // ... and then move down a wee little bit to give the info window some space
        this._map.panBy(0, -200);

        this._infoWindow.open(this._map, marker);
    },

    // private
    _animateMarker: function(marker) {

        window.setTimeout(function() { //kick to background thread to smooth out the display
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }, 0);

        // .. and stop the bouncing after a couple seconds ...
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);
    }
};
