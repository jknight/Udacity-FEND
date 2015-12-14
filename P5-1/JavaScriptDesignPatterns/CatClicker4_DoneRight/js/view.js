var AdminView = {

  init: function() 
  {
    var that = this;

    document.getElementById("saveButton").addEventListener('click', this.save.bind(this));

    document.getElementById("cancelButton").addEventListener('click', function(obj) {
      return function() { that.toggleVisibility(false); } 
    }(that));

  },

  render: function() 
  {
    document.getElementById("name").value = Controller.currentCat.name; 
    document.getElementById("img").value = Controller.currentCat.img;
    document.getElementById("clickCount").value = Controller.currentCat.clickCount;  
    document.getElementById("admin").style.display =  visible ? "block" : "none";

  },

  save: function() 
  {
    console.log("SAVE");
    Controller.currentCat.name = document.getElementById("name").value;
    Controller.currentCat.img = document.getElementById("img").value;
    Controller.currentCat.clickCount= document.getElementById("clickCount").value;
    this.toggleVisibility(false);
    CatView.render();
    CatListView.render();
  },

  toggleVisibility: function(visible) 
  {
    console.log(Controller.currentCat);
    }
};

//View for the cat list. This should contain html
//and references to the Controller but NO references to the Model
var CatListView = {

    init: function() {
        this.render()
    },

    render: function() {
        var cats = Controller.getCats();
        var ul = document.getElementById("catList");
        ul.innerHTML = "";
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            var li = document.createElement("li");
            li.innerHTML = cat.name;
            li.addEventListener('click', function(obj) {
                return function() {
                    Controller.setCat(obj);
                    CatView.render();
                }
            }(cat));

            ul.appendChild(li);
        }
    }
};

var CatView = {

    init: function() {
        document.getElementById("catPicture").addEventListener('click', function(obj) {
            console.log(Controller.currentCat);
            ++Controller.currentCat.clickCount;
            document.getElementById("catClicks").innerHTML = Controller.currentCat.clickCount;
        });
    },

    render: function() {
        var cat = Controller.currentCat;
        document.getElementById("catName").innerHTML = cat.name;
        document.getElementById("catClicks").innerHTML = cat.clickCount;
        document.getElementById("catPicture").src = cat.img;
    }
};
