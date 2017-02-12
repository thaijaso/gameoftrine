var TILE_SIZE = 16;

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

    if (currentCharacter.jumping && 
        (this.entity.name === "knight" || 
         this.entity.name === "gunwoman" ||
         this.entity.name === "mage")) {
        
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
    //ctx.fillRect(currentCharacter.canvasX, currentCharacter.canvasY, currentCharacter.width, currentCharacter.height);
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
    
    this.x = 34 * TILE_SIZE;
    this.y = 14 * TILE_SIZE;

    this.oldX = 34 * TILE_SIZE;
    this.oldY = 14 * TILE_SIZE;
    
    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE - 5;
    
    this.canvasX = 34 * TILE_SIZE;
    this.canvasY = 14 * TILE_SIZE;
   
    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    
    this.attacking = false;

    this.collidedWith = null; //checks to see which entity the knight collided with LAST

    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false; 
    this.collidedBottom = false;
    this.collidedTop = false; 

    this.collidedLeftPlatform = null;
    this.collidedRightPlatform = null;
    this.collidedTopPlatform = null;


}

//checks for all sides collision
Knight.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
};

//Returns true if Knight collided on his left 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideLeft = function(other) {
    if (this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width) {

        console.log('collide left');
    }

    return this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width;
}

//Returns true if Knight collided on his right 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideRight = function(other) {
    if (this.oldX + this.width < other.x && 
        this.x + this.width >= other.x) {
        
        console.log('colided right');
    }

    return this.oldX + this.width < other.x && 
            this.x + this.width >= other.x;
}

//Returns true if Knight collided on his top 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        console.log('colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

//Returns true if Knight collided on his bottom 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        //console.log('collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
}

Knight.prototype.update = function() {
    var gameEngine = this.game;

    //handle jumping
    if (this.jumping) {

        this.collidedBottom = false;

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
         
        this.oldY = this.y;              
        this.canvasY = this.lastGroundY - this.height - height;
        this.y = this.canvasY;  
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {
     
            if (this != entity && this.collide(entity)){
                //console.log('colliding');

                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpElapsedTime = 0;

                } else if (this.collideTop(entity)) {

                    this.collidedTop = true;
                    this.collidedTopPlatform = entity;
                    //this.oldY = this.y;
                    this.canvasY += 3;
                    this.y += 3;
                    this.jumping = false;

                } else if (this.collideLeft(entity)) {
                    //fall after colliding left
                    this.collidedLeft = true;
                    this.collidedLeftPlatform = entity;

                    if (!this.collidedBottom && !this.jumping) {
                        this.oldY = this.y;
                        this.canvasY += 3;
                        this.y += 3;
                    } 
                    
                
                } else if (this.collideRight(entity)) {

                    this.collidedRight = true;
                    this.collidedRightPlatform = entity;
                    
                    if (!this.collidedBottom && !this.jumping) {
                        this.oldY = this.y;
                        this.y += 3;
                        this.canvasY += 3;
                    }
                }
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
            this.collidedLeft = false;
            this.collidedRight = false;
            this.collidedBottom = false;
            this.collidedTop = false;

        } else { //still colliding

            for (var i = 0; i < gameEngine.entities.length; i++) {
                var entity = this.game.entities[i];

                if (entity.name === "platform") {
                    //check if still colliding right with a platform we collided right with
                    if (this.collidedRightPlatform === entity &&  
                        !this.collideRight(entity)) {
                        
                        this.collidedRight = false;
                    } else if (this.collidedLeftPlatform === entity &&
                        !this.collideLeft(entity)) {

                        this.collidedLeft = false;

                    } else if (this.collidedTopPlatform === entity && 
                        !this.collideTop(entity)) {

                        //this.collidedTop = false;

                    }
                }
            }

        }

    } else if (!this.jumping) { //player has not collided therefore fall
        
        this.oldY = this.y;

        this.canvasY += 5;
        this.y += 5;
    }

    //check for movement/change character
    if (gameEngine.keyMap["KeyD"] && !this.collidedRight) {

        this.direction = "right";
        this.oldX = this.x;
        this.x += 3;

    } else if (gameEngine.keyMap["KeyA"] && !this.collidedLeft) {

        this.direction = "left";
        this.oldX = this.x;
        this.x -= 3;

    } else if (gameEngine.keyMap["KeyF"]) {

        //gameEngine.changeCharacter();
    }

    //handle animation changes
    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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
}

Knight.prototype.draw = function() {
   if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "attackRight") {

         this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY - 2);

    } else if(this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 30, this.canvasY - 2);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 68, this.canvasY - 2);
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
    
    this.x = 34 * TILE_SIZE;
    this.y = 14 * TILE_SIZE;

    //for direction of collision
    this.oldX = 34 * TILE_SIZE;
    this.oldY = 14 * TILE_SIZE;
    
    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE;
    
    this.canvasX = 34 * TILE_SIZE;
    this.canvasY = 14 * TILE_SIZE;
   
    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    
    this.attacking = false;

    this.collidedWith = null; //checks to see which entity the knight collided with
    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false; 
    this.collidedBottom = false;
    this.collidedTop = false; 
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
    
    } else if(this.animationState === "idleLeft") {

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
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
};

Mage.prototype.collideLeft = function(other) {
    if (this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width) {

        console.log('collide left');
    }

    return this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width;
}

Mage.prototype.collideRight = function(other) {
    if (this.oldX + this.width < other.x && 
        this.x + this.width >= other.x) {
        
        console.log('colided right');
    }

    return this.oldX + this.width < other.x && 
            this.x + this.width >= other.x;
}

Mage.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        console.log('colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

Mage.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        console.log('collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
}


Mage.prototype.update = function() {
    var gameEngine = this.game;

    //handle jumping
    if (this.jumping) {

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
         
        this.oldY = this.y;              
        this.canvasY = this.lastGroundY - this.height - height;
        this.y = this.canvasY;  
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {
     
            if (this != entity && this.collide(entity)){
                //console.log('colliding');

                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpElapsedTime = 0;

                } else if (this.collideLeft(entity)) {
                    //fall after colliding left
                    this.collidedLeft = true; 
                    this.canvasY += 5;
                    this.y += 5;
                
                } else if (this.collideRight(entity)) {

                    this.collidedRight = true;
                    this.canvasY += 5;
                    this.y += 5;

                } else if (this.collideTop(entity)) {

                    this.collidedTop = true;
                    this.canvasY += 5;
                    this.y += 5;
                    this.jumping = false;

                }
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
            this.collidedLeft = false;
            this.collidedRight = false;
            this.collidedBottom = false;
            this.collidedTop = false;
        }

    } else if (!this.jumping) { //player has not collided therefore fall
        
        this.oldY = this.y;

        this.canvasY += 5;
        this.y += 5;
    }

    //check for movement/change character
    if (gameEngine.keyMap["KeyD"] && !this.collidedRight) {

        this.direction = "right";
        this.oldX = this.x;
        this.x += 3;

    } else if (gameEngine.keyMap["KeyA"] && !this.collidedLeft) {

        this.direction = "left";
        this.oldX = this.x;
        this.x -= 3;

    } else if (gameEngine.keyMap["KeyF"]) {

        //gameEngine.changeCharacter();
    }

    //handle animation changes
    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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
    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false; 
    this.collidedBottom = false;
    this.collidedTop = false; 
}

Gunwoman.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
}

Gunwoman.prototype.collideLeft = function(other) {
    if (this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width) {

        console.log('collide left');
    }

    return this.oldX > other.x + other.width && //was not colliding
           this.x <= other.x + other.width;
}

Gunwoman.prototype.collideRight = function(other) {
    if (this.oldX + this.width < other.x && 
        this.x + this.width >= other.x) {
        
        console.log('colided right');
    }

    return this.oldX + this.width < other.x && 
            this.x + this.width >= other.x;
}

Gunwoman.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        console.log('colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

Gunwoman.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        console.log('collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
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

    } else if(this.animationState === "idleLeft") {  // START LEFT HERE

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);
    
    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);
    
    } else if (this.animationState === "attackLeft") {

         this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 81, this.canvasY);
    } 
}

Gunwoman.prototype.update = function() {
    var gameEngine = this.game;

    //handle jumping
    if (this.jumping) {

        var jumpDistance = this.jumpElapsedTime /
            this.animationJumpRight.totalTime;

        var totalHeight = 120;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
         
        this.oldY = this.y;              
        this.canvasY = this.lastGroundY - this.height - height;
        this.y = this.canvasY;  
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];
        
        if (entity.name === "platform") {
     
            if (this != entity && this.collide(entity)){
                //console.log('colliding');

                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpElapsedTime = 0;

                } else if (this.collideLeft(entity)) {
                    //fall after colliding left
                    this.collidedLeft = true; 
                    this.canvasY += 5;
                    this.y += 5;
                
                } else if (this.collideRight(entity)) {

                    this.collidedRight = true;
                    this.canvasY += 5;
                    this.y += 5;

                } else if (this.collideTop(entity)) {

                    this.collidedTop = true;
                    this.canvasY += 5;
                    this.y += 5;
                    this.jumping = false;

                }
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
            this.collidedLeft = false;
            this.collidedRight = false;
            this.collidedBottom = false;
            this.collidedTop = false;
        }

    } else if (!this.jumping) { //player has not collided therefore fall
        
        this.oldY = this.y;

        this.canvasY += 5;
        this.y += 5;
    }

    //check for movement/change character
    if (gameEngine.keyMap["KeyD"] && !this.collidedRight) {

        this.direction = "right";
        this.oldX = this.x;
        this.x += 3;

    } else if (gameEngine.keyMap["KeyA"] && !this.collidedLeft) {

        this.direction = "left";
        this.oldX = this.x;
        this.x -= 3;

    } else if (gameEngine.keyMap["KeyF"]) {

        //gameEngine.changeCharacter();
    }

    //handle animation changes
    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {
            
            this.attacking = true;
            this.animationState = "attackRight"; 
            this.animationAttackRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping
        
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

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};


Background.prototype.update = function() {
    var gameEngine = this.game;

    if (gameEngine.keyMap["KeyD"]) {
        this.x = this.x - 1;
    } else if (gameEngine.keyMap["KeyA"]) {
        this.x = this.x + 1;
    }
};

function Foreground(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Foreground.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Foreground.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();

    //console.log(currentCharacter.collidedLeft);

    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {
        this.x -= 3;
        //console.log('here');
    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {
        this.x += 3;
    }
}

function Midground(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Midground.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
}

Midground.prototype.update = function() {
    //console.log(this.x);
    var gameEngine = this.game;
    
    if (gameEngine.keyMap["KeyD"]) {
        this.x -= 0.8;
    } else if (gameEngine.keyMap["KeyA"]) {
        this.x += 0.8;
    }
}

function Platform(game, x, y, width, height) {
    this.name = "platform";
    this.game = game;
    this.ctx = game.ctx;

    this.x = x * TILE_SIZE; //game world x and y coordinates
    this.y = y * TILE_SIZE; 

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;
    this.width = width * TILE_SIZE;
    this.height = height * TILE_SIZE;
}

Platform.prototype.draw = function() {
    this.ctx.fillStyle = "#ff0000";
    //console.log(this.canvasX);
    this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    //console.log(this.canvasX);
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

Platform.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();
    
    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }
}



function Tree(gameEngine) {
    this.game = gameEngine

    var treeSpriteSheet = AM.getAsset("./img/treeleaffall.png");

    this.name = "tree";

    this.animation = new Animation(this, treeSpriteSheet, 190, 183, 5, 0.05, 22, true, 1);

    this.ctx = this.game.ctx;

    this.x = 29 * TILE_SIZE;
    this.y = 25 * TILE_SIZE;

    this.width = 8 * TILE_SIZE;
    this.height = 7 * TILE_SIZE;

    this.canvasX = 29 * TILE_SIZE;
    this.canvasY = 25 * TILE_SIZE;
}

Tree.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.canvasX + 0.5, this.canvasY);
};

Tree.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();
    
    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }
};
