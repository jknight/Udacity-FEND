//view.js

view = {
  
  init: function()
  {

  },

  render: function() 
  {
    var locations = document.getElementById("locations");
    for(var i = 0; i < model.locations.length; i++)
    {
      var li = document.createElement("li");
      li.innerHTML = model.locations[i].id;
      locations.appendChild(li);
    } 
  }

};
