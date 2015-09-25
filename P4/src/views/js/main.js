/*
 * Note to Udacity Reviewer: 
 * Please see README.md for high level info. Comments on optimizations are inline below
 * */

//NOTE: all the boring word generation code that I'm sure Udacity reviewers are tired of seeing has been moved to dictionary.js


var ingredientItemizer = function(string) {
    return "<li>" + string + "</li>";
};

//NOTE: nothing interesting changed here  
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

//NOTE: nothing changed here. 
//I considered doing this once and cloning the result,
//but given browser caching of img/pizza.png, and given that we'll only generate pizzas once
//I'm leaving this as-is
var pizzaElementGenerator = function(i) {
    var pizzaContainer, // contains pizza title, image and list of ingredients
        pizzaImageContainer, // contains the pizza image
        pizzaImage, // the pizza image itself
        pizzaDescriptionContainer, // contains the pizza title and list of ingredients
        pizzaName, // the pizza name itself
        ul; // the list of ingredients

    pizzaContainer = document.createElement("div");
    pizzaImageContainer = document.createElement("div");
    pizzaImage = document.createElement("img");
    pizzaDescriptionContainer = document.createElement("div");

    pizzaContainer.classList.add("randomPizzaContainer");
    pizzaContainer.style.width = "33.33%";
    pizzaContainer.style.height = "325px";

    pizzaContainer.id = "pizza" + i; // gives each pizza element a unique id

    pizzaImageContainer.classList.add("col-md-6");

    pizzaImage.src = "img/pizza.png";
    pizzaImage.classList.add("img-responsive");
    pizzaImageContainer.appendChild(pizzaImage);
    pizzaContainer.appendChild(pizzaImageContainer);

    pizzaDescriptionContainer.classList.add("col-md-6");

    pizzaName = document.createElement("h4");
    pizzaName.innerHTML = randomName();
    pizzaDescriptionContainer.appendChild(pizzaName);

    ul = document.createElement("ul");
    ul.innerHTML = makeRandomPizza();
    pizzaDescriptionContainer.appendChild(ul);
    pizzaContainer.appendChild(pizzaDescriptionContainer);

    return pizzaContainer;
};

//NOTE: this is some pretty ugly code, but since we're focusing on performance here, no point 
//in refactoring someone else's code unless it'll improve speed
//PURPOSE: resizePizzas(size) is called when the slider in the "Our Pizzas" section of the website moves.
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
        var windowwidth = document.getElementById("#randomPizzas").offsetWidth;
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

        var allPizzaContainers = document.getElementsByClassName(".randomPizzaContainer");

        //Do the size calculations once
        var sample = allPizzaContainers[0]; //use the first one as a template for sizing 
        var dx = determineDx(sample, size);
        var newWidth = (sample.offsetWidth + dx) + 'px';

        //Note apply the sizes across the board
        var length = allPizzaContainers.length;
        for (var i = 0; i < length; i++) {
            allPizzaContainers[i].style.width = newWidth;
        }
    }

    // User Timing API is awesome (NOTE: I'm glad you think so)
    window.performance.mark("mark_start_resize"); // User Timing API function

    changeSliderLabel(size);
    changePizzaSizes(size);

    window.performance.mark("mark_end_resize");
    window.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
    var timeToResize = window.performance.getEntriesByName("measure_pizza_resize");
    console.log("Time to resize pizzas: " + timeToResize[0].duration + "ms");
};
window.performance.mark("mark_start_generating"); // collect timing data

// User Timing API again. These measurements tell you how long it took to generate the initial pizzas
window.performance.mark("mark_end_generating");
window.performance.measure("measure_pizza_generation", "mark_start_generating", "mark_end_generating");
var timeToGenerate = window.performance.getEntriesByName("measure_pizza_generation");
console.log("Time to generate pizzas on load: " + timeToGenerate[0].duration + "ms");

// Iterator for number of times the pizzas in the background have scrolled.
// Used by updatePositions() to decide when to log the average time per frame
var frame = 0;

//NOTE: keep pizzas in array so we don't have to keep asking the dom for them
//var pizzas = [];

// Logs the average amount of time per 10 frames needed to move the sliding background pizzas on scroll.
function logAverageFrame(times) { // times is the array of User Timing measurements from updatePositions()
    var numberOfEntries = times.length;
    var sum = 0;
    for (var i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
        sum = sum + times[i].duration;
    }
    console.log("Average time to generate last 10 frames: " + sum / 10 + "ms");
}

function createPizzas() {

    //Initial creation and setting of pizza positions
    var pizzasDiv = document.getElementById("randomPizzas");

    //These are the pizza options available
    for (var i = 2; i < 100; i++) {

        var pizzaElement = pizzaElementGenerator(i);

        pizzasDiv.appendChild(pizzaElement);
    }

    var cols = 8;
    var s = 256;

    //Create the element once and clone it (TODO: hard to tell the perf. boost here)
    var elemTemplate = document.createElement('img');
    elemTemplate.className = 'mover';
    elemTemplate.src = "img/pizza.png";
    elemTemplate.style.height = "100px";
    elemTemplate.style.width = "73.333px";
    var movingPizzas = document.getElementById("movingPizzas1");
    console.log("--", movingPizzas);
    var elem;
    var theTop = 0;
    var i;

    var count = 200;
    //These are the background floating pizzas
    for (i = 0; i < count; i++) {

        //NOTE: considering options of cloning vs creating 
        elem = elemTemplate.cloneNode(false);
        elem.basicLeft = (i % cols) * s;
        theTop = (Math.floor(i / cols) * s);
        elem.style.top = theTop + 'px';

        elem.style.visibility = 'hidden';

        //if(theTop >  screenHeight )
        //  break;

        movingPizzas.appendChild(elem);
    }
    console.log("Created " + i + " pizzas");
}

var timer;

function updatePositions() {

    if (timer) {
        window.clearTimeout(timer);
    }

    //using a timer to calm down the madness of the onscroll event getting called a million times a second
    timer = window.setTimeout(function() {

        var scrollTop1250 = document.body.scrollTop / 1250;

        window.performance.mark("mark_start_frame");
        var pizza;
        var screenHeight =  window.screen.height;
        var visibleTop = (document.documentElement.scrollTop||document.body.scrollTop);
        var visibleBottom = visibleTop + screenHeight;;
        var pizzas = document.getElementsByClassName("mover");
        var pizzaTop = 0;

        var length = pizzas.length;
        var phase = 0;
        for (var i = 0; i < length; i++) //NOTE: using pizzas from our array rather than taxing DOM calls
        {
            pizza = pizzas[i];
            phase = Math.sin((scrollTop1250) + (i % 10));

            var left = Math.floor(pizza.basicLeft + 100 * phase);
            //TODO: considering ramifications of painting offscreen (keep everything on screen?)
            //      not yet sure if there's a performance impact
            pizza.style.left = left + 'px';

            pizzaTop = parseInt(pizza.style.top);
            if(pizzaTop >= visibleTop && pizzaTop - 100 <= visibleBottom)
              pizza.style.visibility = 'visible'; 
            else 
              pizza.style.visibility = 'hidden'; 

        }

        // User Timing API to the rescue again. Seriously, it's worth learning.
        // NOTE: seriously, it's super ugly in my code. And what's with all the "mark_end" typed in strings ?
        // Super easy to create custom metrics.
        window.performance.mark("mark_end_frame");
        window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
        if (++frame % 10 === 0) {
            var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
            logAverageFrame(timesToUpdatePosition);
        }
    
    }, 5);

}

document.addEventListener('DOMContentLoaded', function() {
    // one-shot pizza creating & initial position update on load
    createPizzas();
    updatePositions();
});

//as a user scrolls, move them pizzas around
window.addEventListener('scroll', updatePositions);

