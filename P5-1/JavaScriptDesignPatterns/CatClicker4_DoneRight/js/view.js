//View for the cat list. This should contain html
//and references to the Controller but NO references to the Model
var CatListView = {

    init: function() {
        this.render()
    },

    render: function() {
        var cats = Controller.getCats();
        var ul = document.getElementById("catList");
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
        var cat = Controller.getCat();
        document.getElementById("catName").innerHTML = cat.name;
        document.getElementById("catClicks").innerHTML = cat.clickCount;
        document.getElementById("catPicture").src = "img/" + cat.img;
    }
};
