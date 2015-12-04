// The controller: links the view (html) with the model (data)

var Controller = {

    currentCat: null,

    init: function() {
        Model.init();
        CatListView.init();
        CatView.init();
        this.currentCat = Model.cats[0];
    },

    getCats: function() {
        //return array of cats from Model
        return Model.cats;
    },

    setCat: function(cat) {
        this.currentCat = cat;
    },

    increment: function() {
        ++this.currentCat.clickCount;
    }
};
