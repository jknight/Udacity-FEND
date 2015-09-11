var Enemy = function(startX, startY, speed) {
    this.sprite = 'images/enemy-cockroach.png';
    this.x = startX;
    this.y = startY;
    this.speed = speed;
};

Enemy.prototype.update = function(dt) {
    this.x = this.x > ctx.canvas.width ? -171 : this.x + (this.speed * dt);
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function Player() {

    this.sprite_alive = 'images/char-horn-girl.png';
    this.sprite_dead = 'images/char-horn-girl-skeleton.png';
    this.sprite = this.sprite_alive;

    //hard code starting point
    this.initialX = 200;
    this.initialY = 400;

    this.x = this.initialX;
    this.y = this.initialY;
};

Player.prototype.reset = function(o) {
    if (o == null) o = this;
    o.x = o.initialX;
    o.y = o.initialY;

    this.sprite = this.sprite_alive;
    o.frozen = false;
    o.success = false;
};

Player.prototype.update = function() {

    var dead = this.detectCollision();
    if (dead) {
        this.sprite = this.sprite_dead;
        this.frozen = true;
        var that = this;
        setTimeout(function() {
            that.reset(that)
        }, 1500);
    }

};

Player.prototype.detectCollision = function() {

    //collision detection using circles - see
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

    var radius = 35;
    var spriteWidth = 101;
    var spriteHeight = 171;
    var playerCircle = {
        x: (this.x + (spriteWidth / 2)),
        y: (this.y + (spriteHeight / 2))
    };

    for (var i = 0; i < allEnemies.length; i++) {

        var e = allEnemies[i];
        var enemyCircle = {
            x: (e.x + (spriteHeight / 2)),
            y: (e.y + (spriteWidth / 2))
        };

        var dx = playerCircle.x - enemyCircle.x;
        var dy = playerCircle.y - enemyCircle.y;

        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (radius * 2)) {
            return true;
        }
    }

    return false;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (this.success) {
        ctx.drawImage(Resources.get('images/Star.png'), 50, 100);
        ctx.drawImage(Resources.get('images/Star.png'), 200, 100);
        ctx.drawImage(Resources.get('images/Star.png'), 350, 100);

    }

};

Player.prototype.handleInput = function(direction) {
    if (this.frozen)
        return;

    var yStep = 90;
    var xStep = 90;

    //TODO: in future versions, could do a better job calculating these from sprite sizes.
    // (eg Resources could return dimensions)
    switch (direction) {
        case 'left':
            if (this.x > 100)
                this.x -= xStep;
            break;
        case 'right':
            if (this.x + 200 < ctx.canvas.width)
                this.x += xStep;
            break;
        case 'up':
            if (this.y > 0) {
                this.y -= yStep;

                if (this.y == -50) {

                    this.success = true;
                    var that = this;
                    setTimeout(function() {
                        that.reset(that)
                    }, 2000);


                }
            }
            break;
        case 'down':
            if (this.y + 250 < ctx.canvas.height)
                this.y += yStep;
            break;
    }
};


//Create three enemeies, giving them initial x/y coords and speed
var allEnemies = [new Enemy(0, 55, 40),
    new Enemy(100, 135, 60),
    new Enemy(100, 210, 300),
    new Enemy(220, 135, 60),
    new Enemy(200, 225, 100)
];

var player = new Player();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
