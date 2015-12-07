var viewModel = {

    filter: ko.observable(""),

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

    filteredLocations: ko.observableArray([]),
    map: null,

    //main entry point
    init: function() {
      this.map = new Map().build(this.filteredLocations);

      this.filteredLocations(this._locations);

      this.filter.subscribe(function(newValue) {
        console.log(this);

        //first filter the location list
        this.filteredLocations(this._locations.filter(function(f) { 
          console.log("FILTER", this.filter()); 
          return f.name.indexOf(this.filter()) != -1  }, this));

        //then filter the map location points

      }, this);


      ko.applyBindings(viewModel);
    }

};

viewModel.highlightLocation = function(loc) {
  console.log("Hightlight", loc);
};

/*
//Developer note: this needs to be outside of our object declation in order to get the context right
viewModel.filteredLocations = ko.computed(function() {
    var filter = this.filter();
    if (!filter)
        return this._locations;

    var filteredList = ko.utils.arrayFilter(this._locations, function(location) {
        return location.name.indexOf(filter) != -1;
    });

    console.log(filteredList);
    return filteredList;

}, viewModel);
*/
