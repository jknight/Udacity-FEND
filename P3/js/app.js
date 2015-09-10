// Enemies our player must avoid
var Enemy = function(startX, startY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = startX;
    this.y = startY;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //TODO: it would be nice if Resources told his the resource dimensions!
    this.x = this.x > ctx.canvas.width ? -171 : this.x + this.speed;;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {

    this.sprite = 'images/char-horn-girl.png';

    //hard code starting point
    this.initialX = 200;
    this.initialY = 400;

    this.x = this.initialX;
    this.y = this.initialY;

};

Player.prototype.update = function() {

    var dead = this.detectCollision();
    if (dead) {
        this.x = this.initialX;
        this.y = this.initialY;
    }
};

Player.prototype.detectCollision = function() {

    var playerLeft = this.x;
    var playerRight = this.x + 101;
    var playerTop = this.y;
    var playerBottom = this.y + 171;

    for (var i = 0; i < allEnemies.length; i++) {

        var e = allEnemies[i];

        if (e.x + 101 > playerLeft 
            && e.x < playerRight 
            && e.y + 171 > playerTop 
            && e.y  < playerBottom) {
            return true;
        }
    }
    return false;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
    var yStep = 90;
    var xStep = 90;
  
    //TODO: in future versions, could do a better job calculating these from sprite sizes.
    switch (direction) {
        case 'left':
          if(this.x > 100)
            this.x -= xStep;
            break;
        case 'right':
            if(this.x + 200 < ctx.canvas.width)
              this.x += xStep;
            break;
        case 'up':
            if(this.y  > 0)
            this.y -= yStep;
            break;
        case 'down':
            if(this.y + 250 < ctx.canvas.height)
              this.y += yStep;
            break;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0, 55, 1),
    new Enemy(100, 135, 2)
    //new Enemy(200, 220, 2)
];

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
