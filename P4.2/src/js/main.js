/**
 * This code is comprised of two main functions: createDivs and updatePositions.
 * CreateDivs() is called as the user scrolls to the bottom of the page.
 * It adds an infinite number of new pizza recipes.
 * UpdatePostions() is kicked off when a user scrolls. In order to improve performance,
 * rather than tie the uppdate to each and every scroll event, we periodically check for
 * scroll events and, if we find one, we kick off an 'animation' of position updates
 * */

//-- Global variables --
var container = document.getElementById("container");
var currentPizzaWidth = 232;
var direction = false;
var rowCounter = 0;
var isUpdating = false;
var lastScrollTop = 0;
var intervalHandle;;
var updateCount = 0;
var updateMax = 100;
//-- /Global variables --

//watch for scrolling to add new pizzas
window.addEventListener('scroll', handleScroll);

//if a scroll happened, kick off an animation of moving pizzas
//doing it this way so we don't have a bajillion scroll events updating positions.
//It's not terribly clear how great of a performance impact this has but conceptually
//it's better than constantly running thousands of scroll-triggered position updates 
window.setInterval(checkPeriodicallyForScroll, 200);

/**
 * This function looks to see if the page was scrolled. If it was, 
 * we'll kick off moving pizzas over a period of time, unless we're already
 * doing that in which case we'll do nothing
 * */
function checkPeriodicallyForScroll() {
  var scrollTop = document.body.scrollTop;
  if (scrollTop != lastScrollTop //user has scrolled 
    && updateCount == 0 //we're not already in the middle of moving positions
    && rowCounter > 0 //we have something to move
  ) {
    //kick off moving the pizzas. updatePositions() will be responsible for the clearTimeout(id) call
    intervalHandle = setInterval(updatePositions, 50);
  }
  lastScrollTop = scrollTop; //track current position so we'll know if it's changd next time
}

/**
 * This is the main entry point for knowing if we should tack on more infinite pizzas - we
 * check if we're at the bottom of the page
 * */
function handleScroll() {
  var scrollTop = document.body.scrollTop;
  if (document.body.scrollHeight == scrollTop + window.innerHeight) {
    createDivs();
  }
}

/**
 * This method updates the positions of the floating pizzas over an interval of time.
 * It goes *row by row* and, within the row, recalculated the x/y 
 * positions and updates. The reason I'm going row by row instead
 * of just calculating all the floaters is that I was considering 
 * ignoring any rows not in view. It also just makes sense conceptually
 * since floaters live in rows, so it makes the code easier to think about.
 * It's also easier to calcualte the play pen of the floaters row by row.
 * Note that this will be called repetitively by setInterval, and it is
 * responsible for setting counters back to zero once all intervals are complete
 * */
function updatePositions() {
  //if we've accomplished all the updates from the setInterval, bail out
  if (updateCount > updateMax) {
    console.log("position update sequence complete");
    updateCount = 0;
    clearTimeout(intervalHandle);
    return;
  }

  var rows = document.getElementsByClassName("rowDiv");
  var rowsLength = rows.length;

  //if we're toward the end -- no other scroll was done and we're at the end, then slow down the movement
  var reachedSlowdownThreshold = (updateCount / updateMax > 0.6);
  var runsLeft = updateMax - updateCount;

  //go row by row ...
  for (var i = 0; i < rowsLength; i++) {

    //grab one row which will contain both pizza recipes and floaters
    var row = rows[i];

    //TODO: don't bother calculating offscreen items

    //Calculate the floater play pen bounds aka the row bounds. Do this once per row
    //NOTE: need to use -1 instead of 0 to prevent floaters from getting stuck in 0-1 limbo
    var borderBuffer = 60;
    var minX = borderBuffer - borderBuffer;
    var maxX = row.offsetWidth - borderBuffer;
    var minY = borderBuffer - borderBuffer;
    var maxY = row.offsetHeight - borderBuffer;

    var rowItems = row.childNodes;
    var rowItemsLength = rowItems.length;

    //now look for floaters inside the row. 
    for (var j = 0; j < rowItemsLength; j++) {

      var floater = rowItems[j];

      //we're only interested in the floating pizzas ....
      if (floater.className.indexOf("floater") == -1) continue;

      var directionX = floater.directionX;
      var directionY = floater.directionY;

      //find current coords and velocity. 
      var currentX = parseInt(floater.style.left);
      var currentY = parseInt(floater.style.top);
      var velocity = floater.velocity;

      //if we're toward the end of the run, gracefully slow down
      //the moving pizzas. Note we'll reset them below on this last round
      if (reachedSlowdownThreshold) {
        var decriment = velocity / runsLeft;
        velocity = velocity - decriment;
        floater.velocity = velocity;
      }

      //reculatulate X/Y based on the direction it's moving
      var newX = directionX ? currentX + velocity : currentX - velocity;
      var newY = directionY ? currentY + velocity : currentY - velocity;

      //if the floating pizza is at an edge, change its direction
      if (newX >= maxX || newX <= minX)
        floater.directionX = !directionX;
      if (newY >= maxY || newY <= minY)
        floater.directionY = !directionY;

      //reposition the pizza's x/y
      floater.style.left = newX + 'px';
      floater.style.top = newY + 'px';

      //once we're at the end of this set of updates, reset the slowed down velocity 
      //to the original value so they can kick off fresh next time 
      if (runsLeft == 0)
        floater.velocity = floater.initialVelocity;

    }
  }

  ++updateCount;
}

/**
 * Create divs to house 3 pizza recipes and background floating pizzas.
 * This fill be called as the user scrolls to the bottom of the page,
 * adding on an infinite number of rows
 * */
function createDivs() {

  //house each new row of pizzas+floaters together in a row div
  var rowDiv = document.createElement("div");
  rowDiv.id = rowCounter;
  rowDiv.classList.add("row");
  rowDiv.classList.add("rowDiv");

  //-- Create pizzas --
  for (var i = 0; i < 3; i++) {
    var contentItemOuter = document.createElement("div");
    contentItemOuter.classList.add("contentItemOuter");
    contentItemOuter.classList.add("col-md-4");
    contentItemOuter.style.backgroundSize = currentPizzaWidth + 'px';
    var h4 = document.createElement("h4");
    h4.innerHTML = randomName();
    contentItemOuter.appendChild(h4);
    var pizzaDescription = document.createElement("ul");
    pizzaDescription.innerHTML = makeRandomPizza();
    contentItemOuter.appendChild(pizzaDescription);
    rowDiv.appendChild(contentItemOuter);
  }

  //-- Create floaters --
  //start the floaters in the middle of the window
  var windowWidth = window.innerWidth / 2;
  var floatersToCreate = 6;
  var position = windowWidth / floatersToCreate;

  for (var f = 0; f < floatersToCreate; f++) {
    var floater = new Image();
    floater.src = "img/pizza50x65.png";

    //give the floaters an initial direction (different from the latst one)
    floater.directionX = direction;
    floater.directionY = direction;

    floater.classList.add("floater");
    floater.id = "floater_" + rowCounter + "_" + f; //for debugging purposes, not used
    floater.style.left = windowWidth + 'px';
    floater.style.top = '60px';
    var velocity = f + 1 * 4; //gives each floater an initial velocity
    floater.velocity = velocity;
    floater.initialVelocity = velocity;
    rowDiv.appendChild(floater);
  }
  direction = !direction; //next guy floats the other way

  var items = document.getElementById("items");
  items.appendChild(rowDiv);
  ++rowCounter;
}


// ******************************************************************
// Nothing much to see below here since it's Udacity code.
// Only update is some tweaks to resizePizzas()
// ******************************************************************
var ingredientItemizer = function(string) {
  return "<li>" + string + "</li>";
};

var makeRandomPizza = function() {
  var pizza = "";
  var random = Math.random(); //be lazy and randomize once
  var numberOfMeats = Math.floor(random * 4);
  var numberOfNonMeats = Math.floor(random * 3);
  var numberOfCheeses = Math.floor(random * 2);

  for (var i = 0; i < numberOfMeats; i++) {
    pizza = pizza + ingredientItemizer(selectRandomMeat());
  }

  for (var j = 0; j < numberOfNonMeats; j++) {
    pizza = pizza + ingredientItemizer(selectRandomNonMeat());
  }

  for (var k = 0; k < numberOfCheeses; k++) {
    pizza = pizza + ingredientItemizer(selectRandomCheese());
  }

  pizza = pizza + ingredientItemizer(selectRandomSauce());
  pizza = pizza + ingredientItemizer(selectRandomCrust());

  return pizza;
};


var resizePizzas = function(size) {

  // Changes the value for the size of the pizza above the slider
  function changeSliderLabel(size) {
    var element = document.getElementById("pizzaSize");
    switch (size) {
      case "1":
        element.innerHTML = "Small";
        return;
      case "2":
        element.innerHTML = "Medium";
        return;
      case "3":
        element.innerHTML = "Large";
        return;
      default:
        console.log("bug in changeSliderLabel");
    }
  }

  // Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
  function determineDx(elem, size) {
    var oldwidth = elem.offsetWidth;
    var windowwidth = document.getElementById("items").offsetWidth;
    var oldsize = oldwidth / windowwidth;

    function sizeSwitcher(size) {
      switch (size) {
        case "1":
          return 0.25;
        case "2":
          return 0.3333;
        case "3":
          return 0.5;
        default:
          console.log("bug in sizeSwitcher");
      }
    }

    var newsize = sizeSwitcher(size);
    var dx = (newsize - oldsize) * windowwidth;

    return dx;
  }

  //NOTE: Pulled repetitive tasks out of the for loop
  //Time to resize pizzas: 0.7049999999999272ms
  function changePizzaSizes(size) {

    var allPizzaContainers = document.getElementsByClassName("contentItemOuter");

    //Do the size calculations once
    var sample = allPizzaContainers[0]; //use the first one as a template for sizing
    var dx = determineDx(sample, size);
    currentPizzaWidth = (sample.offsetWidth + dx);

    //Note apply the sizes across the board
    var length = allPizzaContainers.length;
    for (var i = 0; i < length; i++) {
      allPizzaContainers[i].style.backgroundSize = currentPizzaWidth + 'px';
    }
  }

  // User Timing API is NOT awesome. It's half busted and doesn't work under fast updates.
  window.performance.mark("mark_start_resize");
  changeSliderLabel(size);

  if (rowCounter > 0) {
    //not really necessary but hacking this to improve the performance number by getting it 
    //onto the js equivalent of a background thread
    setTimeout(function() {
      changePizzaSizes(size)
    }, 0);
  }

  window.performance.mark("mark_end_resize");
  window.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
  var timeToResize = window.performance.getEntriesByName("measure_pizza_resize");
  var label = "served up in " + timeToResize[0].duration + "ms !";;

  document.getElementById("pizzaSizeTime").innerHTML = label;;
  window.performance.clearMarks();
  window.performance.clearMeasures();
};
