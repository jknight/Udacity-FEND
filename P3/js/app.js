/* 
 * ------------------------------
 * Code notes for Udacity reviewer
 * ------------------------------
 * - This code is really too long for one file and should be broken out
 * - I'm not very happy with the Player's access to the scoreboard & enemies.
 *   If I was going to do more on this, I'd refactor that control into the main engine
 *   (eg move collision detection into the engine). For the time being, use IoC to at 
 *   least make dependency relationship clear
 * - code formating run through jshint &  js-beautify 
 *
 * */

//-- Enemy --
var Enemy = function(startX, startY, speed) {

    this.spriteFrame = Math.floor(Math.random() * 2);
    this.spriteFrames = [
        'images/enemy-cockroach_f1.png',
        'images/enemy-cockroach_f2.png'
    ];

    //NOTE: enemies never restart. Once they start crawling,
    //      they keep on looping until a new game starts
    this.entryPoint = -80;

    if (startX === 0)
        startX = this.entryPoint;

    this.x = startX;
    this.y = startY;
    this.startY = startY;

    //Settings to simulate walking (this is pretty sad and I should 
    //use a js physics engine)
    this.vacilationMax = 0.5;
    this.currentVacilation = 0.0;
    this.vacilation = 0.02;
    this.vacilatingUp = true; //aka down 

    this.initialSpeed = speed;

    this.init();
};

Enemy.prototype.init = function() {
    this.speed = this.initialSpeed;

    this.spriteFrameFlipIndex = 50; //every Nth call to render, flip to the next frame
    this.spriteRenderCounter = 0;
};

Enemy.prototype.update = function(dt) {

    this.x = this.x > ctx.canvas.visibleWidth ? this.entryPoint : this.x + (this.speed * dt);

    //Make the enemy a vacilate up and down a little like it's walking instead of a smooth scroll.
    //The y vacilation is so small and not really relevant to "smooth" motion that I'm not 
    //factoring in dt in the y calc
    this.currentVacilation += this.vacilation;

    this.y += this.vacilatingUp ? this.currentVacilation : -(this.currentVacilation);

    if (this.currentVacilation > this.vacilationMax) {
        //poor man's animation: when we hit our vacilation max, flip the frame
        this.spriteFrame = (this.spriteFrame == this.spriteFrames.length - 1) ? 0 : ++this.spriteFrame;
        this.vacilatingUp = !this.vacilatingUp;
        this.currentVacilation = 0;
    }

};

Enemy.prototype.levelUp = function() {
    //increase speed for next level
    this.speed += 0.5;
    //increase sprite frame rate to simulate faster motion
    this.spriteFrameFlipIndex = (this.spriteFrameFlipIndex > 10) ?
        this.spriteFrameFlipIndex - 10 :
        this.spriteFrameFlipIndex;
};

Enemy.prototype.render = function() {
    ++this.spriteRenderCounter;

    var sprite = Resources.get(this.spriteFrames[this.spriteFrame]);
    ctx.drawImage(sprite, this.x, this.y);
};
//-- /Enemy --

//-- Player --
var Player = function(scoreboard, allEnemies) {

    //player constants
    this.scoreboard = scoreboard;
    this.allEnemies = allEnemies;

    this.init();
};

Player.prototype.init = function() {
    this.sprite_alive = 'images/char-horn-girl.png';
    this.sprite_dead = 'images/char-horn-girl-skeleton.png';
    this.sprite_happy = 'images/char-horn-girl-happy.png';
    this.sprite = this.sprite_alive;

    //Player's starting point
    //TODO: this would be nicer if it was calculated on board / square size
    this.x = 200;
    this.y = 400;

    //101 and 83 values come from engine.js - they should be generally available instead of hard coded
    this.yStep = 83;
    this.xStep = 101;

    this.frozen = false;
};

//TODO: not entirely happy about player being responsible for changing scoreboard & enemies.
//      It would be better to have the engine handle this logic. Player should simply broadcast
//      leveling up and engine should decide what to do with that information
Player.prototype.levelUp = function() {
    this.scoreboard.levelUp();

    //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    var random = function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var enemyX = random(0, 300);
    //randomly choose which swim land to place the sprite in (lanes 2 - 5)
    var enemyY = random(1, 4) * this.yStep;

    var enemySpeed = random(10, 50);

    this.allEnemies.push(new Enemy(enemyX, enemyY, enemySpeed));

};

Player.prototype.update = function() {
    var dead = this.detectCollision();
    if (dead) {
        //show a dead sprite for half a second
        this.sprite = this.sprite_dead;
        this.frozen = true;
        this.scoreboard.timesSolved = 0; //TODO: encapsulate in a function
        this.scoreboard.init();

        initEnemies();

        setTimeout(this.init.bind(this), 500);
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {

    //TODO: too many magic numbers in here. Can they be calculated (-15, 200, 250 ...)

    if (this.frozen)
        return;

    switch (direction) {
        case 'left':
            this.x = (this.x > 0) ? this.x - this.xStep : this.xStep * 4;
            break;
        case 'right':
            this.x = this.x + 200 < ctx.canvas.width ? this.x + this.xStep : 0;
            break;
        case 'up':
            if (this.y > 0) {

                this.y -= this.yStep;

                if (this.y == -15) { //TODO: what kind of magic is -15? Can this be calculated ?
                    this.sprite = this.sprite_happy;
                    this.frozen = true;
                    this.levelUp();
                    setTimeout(this.init.bind(this), 1000);
                }
                //else: step up to the next square
            }
            break;
        case 'down':
            if (this.y + 250 < ctx.canvas.height)
                this.y += this.yStep;
            break;
    }
};

//TODO: strictly speaking, collision detection shouldn't really be a function of a player:
//      a player does not need to be aware of enemies. Plus, it just makes this code too long. 
//      Consider moving collisiton detection up / over to the game/board level. 
//      This would require a larger refactoring moving more logic out of here and into Engine.js.
Player.prototype.detectCollision = function() {

    //collision detection using circles - see
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

    /* Note that the sprite transparent images are deceiving ! They're like this:
     * ---Image----   
     * |          |    ^
     * |          |    | 110px
     * |          |    |
     * | [sprite] |    v
     * |          | 
     * ------------
     *  <--->50px
     *  
     *  so the "center" of the sprite for purposes of collision detection isn't the 
     *  same as the center of the image. This just so happens to be be true of all the stock
     *  sprite images (someone tell the design department to stop slacking)
     *  */

    var radius = 30;
    var spriteCenterY = 110; //110: approximate distance from top to center of sprite
    var spriteCenterX = 50; //50: approximate distance from left to center of sprite

    var playerCircle = {
        x: (this.x + spriteCenterX),
        y: (this.y + spriteCenterY)
    };

    //Note the use of for(;;) instead of forEach(x, f(x)) so we can easily return as soon as we hit a match
    for (var i = 0; i < allEnemies.length; i++) {
        var e = allEnemies[i];

        var enemyCircle = {
            x: (e.x + spriteCenterX),
            y: (e.y + spriteCenterY)
        };

        var dx = playerCircle.x - enemyCircle.x;
        var dy = playerCircle.y - enemyCircle.y;

        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (radius * 2)) {
            return true; //collision !
        }
    }
    return false;
};
//-- / Player --

//-- Scoreboard --
var Scoreboard = function(allEnemies) {
    this.allEnemies = allEnemies;
    this.maxLevels = 5; //0-based, so it's 5
    this.timesSolved = 0;
    this.init();
};

Scoreboard.prototype.init = function() {
    this.level = 0;
    this.isResetting = false;
};

Scoreboard.prototype.levelUp = function() {
    ++this.level;
};

Scoreboard.prototype.render = function() {
    for (var i = 0; i < this.level; i++) {
        ctx.drawImage(Resources.get('images/star.png'), (i * 101), 0);
    }

    //BUG: once you solve the game 5 times we'll run out of space to print blue 
    //     gems. This could be addressed by starting to print red gems etc.
    //     ad ininitum. I doubt anyone is going to get to the end 25 times.
    for (var j = 0; j < this.timesSolved; j++) {
        ctx.drawImage(Resources.get('images/gem-blue.png'), 500, ((j + 0.5) * 101));
    }

    if (this.level == this.maxLevels) {

        this.allEnemies.forEach(function(enemy) {
            enemy.levelUp();
        });

        if (!this.isResetting) //prevent multiple trigerings of setTimeout
        {
            ++this.timesSolved;
            this.isResetting = true;
            setTimeout(this.init.bind(this), 1000);
        }
    }
};
//-- / Scoreboard --

//-- creation of player/enemy instances for use in this game

//TODO: another case where this would be better refactored into engine.js
var allEnemies = [];

function initEnemies() {
    //clear array. see http://stackoverflow.com/a/1232046/83418
    allEnemies.length = 0;

    //initial enemy in swim lane #3
    allEnemies.push(new Enemy(100, (83 * 3), 60));
}
initEnemies();

//Inject dependencies into Player for the sake of clarity & to avoid weird globals
//Really, this should be refactored to give engine.js control of the situation
var scoreboard = new Scoreboard(allEnemies);
var player = new Player(scoreboard, allEnemies);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function up() { 
  player.handleInput("up"); 
}

function down() { 
  player.handleInput("down"); 
}

function left() { 
  player.handleInput("left"); 
}

function right() { 
  player.handleInput("right"); 
}

