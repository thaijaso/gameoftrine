function Animation(entity, spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.assetManager = AM;
    this.entity = entity;
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
   
   this.elapsedTime = 0;   //used for jumping as well as various other animations

    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function(tick, ctx, canvasX, canvasY) {
    var gameEngine = this.entity.game.getGameEngine();
    var currentCharacter = gameEngine.getCurrentCharacter();
    var wolf = gameEngine.getWolf();

    this.elapsedTime += tick;

    if (currentCharacter.jumping) {
        currentCharacter.jumpElapsedTime += tick;
    }

    if (this.isDone()) {

        if (this.loop) {

            this.elapsedTime = 0; //restart animation

        } else { //go back to idle state from attack animation

            if (currentCharacter.direction === "right") {
                currentCharacter.animationState = "idleRight";  
            } else {
                currentCharacter.animationState = "idleLeft";
            }
  
            gameEngine.keyMap["1"] = false;
            currentCharacter.jumping = false;
            currentCharacter.jumpElapsedTime = 0;
            currentCharacter.attacking = false;
        }
    }

    var frame = this.currentFrame();

    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    //debugging
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(currentCharacter.canvasX, currentCharacter.canvasY, currentCharacter.width, currentCharacter.height);
    //ctx.fillRect(currentCharacter.x, currentCharacter.y, currentCharacter.width, currentCharacter.height);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight, // source from sheet
        this.frameWidth, this.frameHeight,
        canvasX - 16, canvasY - 25, //-16 and -25 to offset the image and draw in correct place
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function() {
    return Math.floor(this.elapsedTime / this.frameDuration);  
}

Animation.prototype.isDone = function() {
    return (this.elapsedTime >= this.totalTime);
}

function Knight(game) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/knightidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/knightwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/knightattackright.png");
    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/knightidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/knightwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/knightattackleft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/knightjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/knightjumpleft.png");

    this.game = game;
    this.ctx = game.ctx;
    this.name = "knight";

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.05, 14, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.015, 14, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 2, 0.1, 14, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 2, 0.015, 14, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationState = "idleRight";
    
    this.direction = "right";
    
    this.x = 34 * 16;
    this.y = 14 * 16;
    
    this.width = 2 * 16;
    this.height = 4 * 16;
    
    this.canvasX = 34 * 16;
    this.canvasY = 14 * 16;
   
    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    
    this.attacking = false;

    this.collidedWith = null;
    
}

//checks for all sides collision
Knight.prototype.collide = function(other) {
    //console.log(this.x < other.x + other.width);
    //console.log(this.x + this.width > other.x);
    //console.log(this.y < other.y + other.height);
    //console.log(this.height + this.y > other.y);

    return this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.height + this.y > other.y
};

Knight.prototype.update = function() {
    var gameEngine = this.game;
    
    if (gameEngine.keyMap["KeyD"]) {
        this.x += 3;
        this.direction = "right";
    } else if (gameEngine.keyMap["KeyA"]) {
        this.x -= 3;
        this.direction = "left";
    } 

    // else if (gameEngine.keyMap["KeyF"]) {
    //     gameEngine.changeCharacter();
    // }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {

            if (this != entity && !this.collide(entity) && this.collidedWith === null && !this.jumping) {
                //console.log('not colliding');
                
            } else if (this != entity && this.collide(entity)){
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

    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkRight";

        } else if (!gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) {

            this.animationState = "idleRight";

        }
    
    } else { //direction is left
        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyA"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;


        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackLeft"; 
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpLeft";
            this.animationJumpLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkLeft";

        } else if (!gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) {

            this.animationState = "idleLeft";

        }
    
    }

    if (this.jumping) {

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
                       
                       //this causes a glitch when jumping to a different height platform
        this.canvasY = this.lastGroundY - this.height - height; 
        this.y = this.canvasY;  
    }
}

Knight.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

         this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY);
    }

      // START LEFT HERE

     else if(this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);
    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 30, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 68, this.canvasY);
    } 
}


//Constructor for mage
function Mage(game) {

    var idleRightAnimationSpriteSheet = AM.getAsset("./img/mageIdleRight.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/mageWalkRight.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/mageAttackRight.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/mageIdleLeft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/mageWalkLeft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/mageAttackLeft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/mageJumpRight.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/magejumpleft.png");


   this.game = game;
    this.ctx = game.ctx;
    this.name = "mage";

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.05, 10, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 3, 0.035, 8, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.015, 17, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 5, 0.1, 10, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 4, 0.07, 8, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 2, 0.015, 17, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 10, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 10, false, 0.5);
    this.animationState = "idleRight";
    
    this.direction = "right";
    
    this.x = 34 * 16;
    this.y = 14 * 16;
    
    this.width = 2 * 16;
    this.height = 4 * 16;
    
    this.canvasX = 34 * 16;
    this.canvasY = 14 * 16;
   
    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    
    this.attacking = false;

    this.collidedWith = null;
}

Mage.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX-10, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "attackRight") {

         this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 55, this.canvasY);
    }

      // START LEFT HERE

     else if(this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY);
    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 68, this.canvasY);
    } 
}

//checks for all sides collision
Mage.prototype.collide = function(other) {
    //console.log(this.x < other.x + other.width);
    //console.log(this.x + this.width > other.x);
    //console.log(this.y < other.y + other.height);
    //console.log(this.height + this.y > other.y);

    return this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.height + this.y > other.y
};


Mage.prototype.update = function() {
    var gameEngine = this.game;
    
    if (gameEngine.keyMap["KeyD"]) {
        this.x += 3;
        this.direction = "right";
    } else if (gameEngine.keyMap["KeyA"]) {
        this.x -= 3;
        this.direction = "left";
    } 

    // else if (gameEngine.keyMap["KeyF"]) {
    //     gameEngine.changeCharacter();
    // }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {

            if (this != entity && !this.collide(entity) && this.collidedWith === null && !this.jumping) {
                //console.log('not colliding');
                
            } else if (this != entity && this.collide(entity)){
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

    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkRight";

        } else if (!gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) {

            this.animationState = "idleRight";

        }
    
    } else { //direction is left
        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyA"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;


        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackLeft"; 
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpLeft";
            this.animationJumpLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkLeft";

        } else if (!gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) {

            this.animationState = "idleLeft";

        }
    
    }

    if (this.jumping) {

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
                       
                       //this causes a glitch when jumping to a different height platform
        this.canvasY = this.lastGroundY - this.height - height; 
        this.y = this.canvasY;  
    }

}

//Constructor for gunwoman
function Gunwoman(game) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackright.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackleft.png");


    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpleft.png");


    this.game = game;
    this.ctx = game.ctx;
    this.name = "gunwoman";

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 5, 0.05, 22, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 4, 0.015, 16, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 5, 0.1, 22, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 4, 0.015, 16, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 11, false, 0.5);
    this.animationState = "idleRight";
    
    this.direction = "right";
    
    this.x = 34 * 16;
    this.y = 14 * 16;
    
    this.width = 2 * 16;
    this.height = 4 * 16;
    
    this.canvasX = 34 * 16;
    this.canvasY = 14 * 16;
   
    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    
    this.attacking = false;

    this.collidedWith = null;

}


Gunwoman.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

         this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY);
    // START LEFT HERE

    } else if(this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);
    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    }

     else if (this.animationState === "attackLeft") {

         this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 81, this.canvasY);
    } 
}

//checks for all sides collision
Gunwoman.prototype.collide = function(other) {
    //console.log(this.x < other.x + other.width);
    //console.log(this.x + this.width > other.x);
    //console.log(this.y < other.y + other.height);
    //console.log(this.height + this.y > other.y);

    return this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.height + this.y > other.y
};

Gunwoman.prototype.update = function() {
    var gameEngine = this.game;
        console.log(this.animationState);

    if (gameEngine.keyMap["KeyD"]) {
        this.x += 3;
        this.direction = "right";
    } else if (gameEngine.keyMap["KeyA"]) {
        this.x -= 3;
        this.direction = "left";
    } 

    // else if (gameEngine.keyMap["KeyF"]) {
    //     gameEngine.changeCharacter();
    // }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {

            if (this != entity && !this.collide(entity) && this.collidedWith === null && !this.jumping) {
                //console.log('not colliding');
                
            } else if (this != entity && this.collide(entity)){
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

    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkRight";

        } else if (!gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) {

            this.animationState = "idleRight";

        }
    
    } else { //direction is left
        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyA"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;


        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackLeft"; 
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping) { //jump only if not already jumping
        
            this.jumping = true;
            this.animationState = "jumpLeft";
            this.animationJumpLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkLeft";

        } else if (!gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) {

            this.animationState = "idleLeft";

        }
    }

    if (this.jumping) {

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
                       
                       //this causes a glitch when jumping to a different height platform
        this.canvasY = this.lastGroundY - this.height - height; 
        this.y = this.canvasY;  
    }
}


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
