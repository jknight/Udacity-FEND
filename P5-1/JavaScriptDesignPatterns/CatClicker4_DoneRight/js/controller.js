// The controller: links the view (html) with the model (data)

var Controller = {

    currentCat: Model.cats[0],

    init: function() {
        Model.init();
        CatListView.init();
        CatView.init();
    },

    getCats: function() {
        //return array of cats from Model
        return Model.cats;
    },

    getCat: function() {
        return this.currentCat;
    },

    setCat: function(cat) {
        this.currentCat = cat;
    },

    increment: function() {
        ++this.currentCat.clickCount;
    }
};
