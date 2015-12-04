
var Model = {

  cats: [],

  Cat: function(id, name, img) 
  {
    cat = {};
    cat.id = id;
    cat.name = name;
    cat.img = img;
    cat.clickCount = 0;
    return cat;
  },

  init: function() 
  {
    for(var i = 0; i < 5; i++) {
      var cat = this.Cat(i, "kitty #" + i, "img/cat" + (i+1) + ".jpg");
      this.cats.push(cat);
    }
  }
};
