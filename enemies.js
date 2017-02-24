//Constructor for wolf
function Wolf(game) {
    var idleRightSpriteSheet = AM.getAsset("./img/wolfidleright.png");
    var walkRightSpriteSheet = AM.getAsset("./img/wolfwalkright.png");
    var attackRightSpriteSheet = AM.getAsset("./img/wolfattackright.png");
    // var jumpRightSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");

    this.name = "wolf";

    this.animationCurrent = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, 1);
    this.animationIdleRight = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, 1);
    this.animationWalkRight = new Animation(this, walkRightSpriteSheet, 192, 192, 4, 0.05, 12, true, 1);
    this.animationAttackRight = new Animation(this, attackRightSpriteSheet, 288, 192, 3, 0.04, 12, false, 1);
    // this.animationJumpRight = new Animation(this, jumpRightSpriteSheet, 192, 192, 4, 0.04, 12, false, 1);

    this.state = "idleRight";
    //this.x = 0;
    //this.y = 0;
    this.speed = 100;
    this.game = game;
    this.jumping = false
    this.ctx = game.ctx;

    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, this.game, 0, 400);
}

Wolf.prototype.draw = function() {
    this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Wolf.prototype.update = function() {
    Entity.prototype.update.call(this);
}

function Skeleton(game) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/skeletonidleright.png");
    // var walkRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    // var attackRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackright.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonidleleft.png");
    // var walkLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkleft.png");
    // var attackLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackleft.png");


    // var jumpRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");
    // var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpleft.png");


    this.game = game;
    this.ctx = game.ctx;
    this.name = "skeleton";

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.05, 8, true, 0.5);
    // this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    // this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 4, 0.015, 16, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 0.5);
    // this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    // this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 4, 0.015, 16, false, 0.5);
    // this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    // this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 11, false, 0.5);
    this.animationState = "idleLeft";

    this.direction = "left";

    this.x = 800;
    this.y = 430;

    this.width = 2 * 16;
    this.height = 4 * 16;

    this.canvasX = 800;
    this.canvasY = 430;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;

    this.attacking = false;

    this.collidedWith = null;


}


Skeleton.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY);
    }
};

Skeleton.prototype.update = function(first_argument) {
    var gameEngine = this.game;

    //check for movement/change character
    if (gameEngine.keyMap["KeyD"] && !this.collidedRight) {

        this.direction = "right";
        this.oldX = this.x;
        this.x += 3;

    } else if (gameEngine.keyMap["KeyA"] && !this.collidedLeft) {

        this.direction = "left";
        this.oldX = this.x;
        this.x -= 3;

    }


    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform") {

            if (this != entity && !this.collide(entity) && this.collidedWith === null && !this.jumping) {
                //console.log('not colliding');

            } else if (this != entity && this.collide(entity)) {
                //console.log('colliding');
                this.collidedWith = entity;
                this.lastGroundY = this.collidedWith.y;
            }
        }
    }

    //check if player is no longer colliding with any platforms
    if (this.collidedWith) {
        var stillColliding = false;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.game.entities[i];

            if (entity.name === "platform") {
                if (this != entity && this.collide(entity)) {
                    stillColliding = true;
                }
            }
        }

        if (!stillColliding) {
            this.collidedWith = null;
        }
    } else { //player has not collided therefore fall
        this.canvasY += 5;
        this.y += 5;
    }

};


//checks for all sides collision
Skeleton.prototype.collide = function(other) {
    //console.log(this.x < other.x + other.width);
    //console.log(this.x + this.width > other.x);
    //console.log(this.y < other.y + other.height);
    //console.log(this.height + this.y > other.y);

    return this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.height + this.y > other.y
};



function SkeletonArcher(game, x, y) {
    // var idleRightAnimationSpriteSheet = 
    // var walkRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/skeletonarcherattackright.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonarcheridleleft.png");
    // var walkLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonarcherattackleft.png");


    // var jumpRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");
    // var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpleft.png");


    this.game = game;
    this.ctx = game.ctx;
    this.name = "skeletonArcher";

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    // this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.05, 8, true, 0.5);
    // this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 288, 192, 4, 0.015, 16, true, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 0.5);
    // this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 288, 192, 4, 0.05, 16, true, 0.5);
    // this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    // this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 11, false, 0.5);
    this.animationState = "idleLeft";

    this.direction = "left";
    var currentCharacter = game.getCurrentCharacter();

    this.x = x;
    this.y = y;

    this.width = 2 * 16;
    this.height = 4 * 16;

    this.canvasX = x;
    this.canvasY = y;


    this.attacking = false;

    this.collidedWith = null;

    this.oldX = x;
    this.oldY = y;


}

SkeletonArcher.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();

    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight ) {
        // this.oldX = this.canvasX;
        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft ) {
        // this.oldX = this.canvasX;
        this.canvasX += 3;
    }

    if (currentCharacter.canvasX >= this.canvasX - 800 && !this.attacking) {
        this.animationState = "attackLeft";
        this.attacking = true;
        //  this.oldX = this.canvasX;
        // this.oldY = this.canvasY;

    } 
    // else if (currentCharacter.canvasX <= this.canvasX + 500 && !this.attacking) {
    //     this.animationState = "attackRight";
    //     this.attacking = true;
    // } 

    else if (this.attacking && this.animationAttackLeft.currentFrame() === 11) {
       
        var startTime = this.game.timer.gameTime;
        var newArrow = new Arrow(this.game, this.canvasX, this.canvasY, startTime);
        this.game.addEntity(newArrow);
    }

    if (currentCharacter.canvasX <= this.canvasX - 800) {
        this.attacking = false;
        this.animationState = "idleLeft";
    } else if(currentCharacter.canvasX >= this.canvasX + 300) {
        this.attacking = false;
        this.animationState = "idleLeft";
    }

};

SkeletonArcher.prototype.draw = function() {
    var currentCharacter = this.game.getCurrentCharacter();

    if (this.animationState === "idleLeft") {
        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "attackLeft") {
        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 66, this.canvasY);


        // this.ctx.beginPath();
        // this.ctx.moveTo(this.canvasX, this.canvasY);
        // this.ctx.lineTo(currentCharacter.canvasX, currentCharacter.canvasY);
        // this.ctx.stroke();
    } else if (this.animationState === "attackRight") {
        this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);
    }
};

var id = 0;

function Arrow(game, archerX, archerY, startTime) {
    this.id = id;
    id++;

    var arrowImg = AM.getAsset("./img/arrow.png");

    this.arrow = new Animation(this, arrowImg, 76, 67, 1, 0.1, 1, true, 1);

    // this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.05, 8, true, 0.5);
    this.startTime = startTime;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "arrow";

    this.direction = "left";
    var currentCharacter = game.getCurrentCharacter();

    this.x = archerX;
    this.y = archerY;

    this.width = 2 * 16;
    this.height = 4 * 16;
    this.canvasX = archerX;
    this.canvasY = archerY;
    this.y1 = this.canvasY;
    this.y2 = currentCharacter.canvasY;
    this.x1 = this.canvasX;
    this.x2 = currentCharacter.canvasX;
    this.lastGroundY = null; //y coord of platform last collided with
    // this.slope = (this.y1 - this.y2) / (this.x1 - this.x2);
    // this.b = this.y1 / (this.slope * this.x1);
    // var dist = Math.sqrt(Math.pow((this.x1 - this.x2), 2) + Math.pow((this.y1 - this.y2), 2));

    this.temp = 0;
    this.collidedWith = null;
}


Arrow.prototype.update = function() {

    var currentCharacter = this.game.getCurrentCharacter();

    var gameEngine = this.game;

    // if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight && !this.attacking) {
    //     this.canvasX = this.canvasX;
    // } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft && !this.attacking) {
    //     // this.oldX = this.canvasX;
    //     this.canvasX = this.canvasX;
    // }

    var timeSince = this.game.timer.gameTime - this.startTime;
    this.canvasY = (1 - timeSince) * this.y1 + (timeSince * this.y2);
    this.canvasX = (1 - timeSince) * this.x1 + (timeSince * this.x2);

};


Arrow.prototype.draw = function(first_argument) {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(this.canvasX, this.canvasY, 5, 3);

    // this.arrow.drawFrame(this.game.clockTick, this.ctx, this.canvasX , this.canvasY);
    // var img = new Image();
    // img.src = "/img/arrow.png";

    // img.onload = function(argument) {
    //     this.ctx.drawImage(img, canvasX, canvasY);
    // }
};
