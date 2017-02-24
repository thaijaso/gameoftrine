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

        } else {


            if (this.entity.name === "knight" || 
                this.entity.name === "gunwoman" || 
                this.entity.name === "mage") {

                //go back to idle state from attack or jump animation
                if (currentCharacter.direction === "right") {
                    currentCharacter.animationState = "idleRight";
                } else {
                    currentCharacter.animationState = "idleLeft";
                }

                gameEngine.keyMap["1"] = false;
                currentCharacter.jumping = false;
                currentCharacter.attacking = false;
            }

            if (this.entity.name === "skeleton") {
                
                if (this.entity.direction === "right") {
                    this.entity.animationState = "idleRight";
                } else {
                    this.entity.animationState = "idleLeft";
                }
                
                this.entity.attacking = false;
                this.entity.attacked = false;
                this.elapsedTime = 0;
            }
        }
    }

    var frame = this.currentFrame();

    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    
  

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
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.035, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 2, 0.015, 14, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationState = "idleRight";

    this.direction = "right";

    this.x = 34 * TILE_SIZE;
    this.y = 27 * TILE_SIZE;

    this.oldX = 34 * TILE_SIZE;
    this.oldY = 27 * TILE_SIZE;

    this.width = 2 * TILE_SIZE;

    this.height = 4 * TILE_SIZE - 5;

    this.canvasX = 34 * TILE_SIZE;
    this.canvasY = 27 * TILE_SIZE;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;
    this.jumpReleased = false;
    this.jumpTimeHeld = 0;
    this.jumpStartTime = 0;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;

    this.attacking = false;
    this.attacked = false;

    this.collidedWith = null; //checks to see which entity the knight collided with LAST

    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false;
    this.collidedBottom = false;
    this.collidedTop = false; 

    this.collidedLeftEntity = null;
    this.collidedRightEntity = null;
    this.collidedTopEntity = null;
    this.collidedBottomEntity = null;
}

Knight.prototype.update = function() {
    var gameEngine = this.game;
    //handle jumping

    if (this.jumping) {

        this.collidedBottom = false;

        // this code is shema working on variable jumping DO NOT DELETE BITCHES

        // var timeSinceJump = gameEngine.timer.gameTime - this.jumpStartTime;
        // var maxJumpTime = .5;
        // var totalJumpHeight = 200;

        // console.log(timeSinceJump);

        // if (!this.jumpReleased && timeSinceJump < maxJumpTime) {
        //     this.jump(totalJumpHeight, timeSinceJump, maxJumpTime);
        // }


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

    if (this.attacking) {

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.game.entities[i];

            if (entity.name === "skeleton") {

                if (this.direction === "right" && this.collideAttackRight(entity)) {
                    console.log('landed attack right');

                    if (this.animationAttackRight.currentFrame() === 10) {

                        //knock back collision
                        var knockBackCollidedWith = null;

                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            var potentialCollision = gameEngine.entities[j];

                            if (potentialCollision !== entity && //can't knock back into itself
                                potentialCollision !== entity.collidedBottomEntity && //cant knock back onto the ground platform
                                potentialCollision !== this) { //cant knockback into the attacker (knight)

                                //console.log('here');

                                if (entity.knockBackRightCollide(potentialCollision)) {
                                    
                                    
                                    if (!knockBackCollidedWith) {
                                        
                                        knockBackCollidedWith = potentialCollision;

                                    } else if (knockBackCollidedWith.x + knockBackCollidedWith.width < 
                                        potentialCollision.x + potentialCollision.width) {

                                        //find the closest thing to knock back into
                                        knockBackCollidedWith = potentialCollision;

                                    }
                                    
                                }
                            }
                        }

                        if (knockBackCollidedWith) {
                            //console.log(knockBackCollidedWith.x + knockBackCollidedWith.width);

                            entity.x = knockBackCollidedWith.x - entity.width;
                            entity.oldX = entity.x;
                            entity.canvasX = knockBackCollidedWith.canvasX - entity.width;
                            entity.attacked = true;

                        } else {    //nothing to knock back into

                            entity.x = entity.x + 30;
                            entity.oldX = entity.x;
                            entity.canvasX = entity.canvasX + 30;
                            entity.attacked = true;

                        }

                        if (entity.direction === "left") {

                            entity.animationState = "idleLeft";

                        } else {

                            entity.animationState = "idleRight";
                        } 

                        entity.animationAttackLeft.elapsedTime = 0;
                        entity.animationAttackRight.elapsedTime = 0;     
                    }
                    

                } else if (this !== entity && this.collideAttackLeft(entity)) { //knight attacks left
                    //console.log('landed attack left');

                    if (this.animationAttackLeft.currentFrame() === 10) {

                        //knock back collision
                        var knockBackCollidedWith = null;

                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            var potentialCollision = gameEngine.entities[j];

                            if (potentialCollision !== entity && //can't knock back into itself
                                potentialCollision !== entity.collidedBottomEntity && //cant knock back onto the ground platform
                                potentialCollision !== this) { //cant knockback into the attacker (knight)

                                //console.log('here');

                                if (entity.knockBackLeftCollide(potentialCollision)) {
                                    
                                    
                                    if (!knockBackCollidedWith) {
                                        
                                        knockBackCollidedWith = potentialCollision;

                                    } else if (knockBackCollidedWith.x + knockBackCollidedWith.width < 
                                        potentialCollision.x + potentialCollision.width) {

                                        //find the closest thing to knock back into
                                        knockBackCollidedWith = potentialCollision;

                                    }  
                                }
                            }
                        }

                        if (knockBackCollidedWith) {

                            entity.x = knockBackCollidedWith.x + knockBackCollidedWith.width;
                            entity.oldX = entity.x;
                            entity.canvasX = knockBackCollidedWith.canvasX + knockBackCollidedWith.width;
                            entity.attacked = true;

                        } else {    //nothing to knock back into

                            entity.x = entity.x - 30;
                            entity.oldX = entity.x;
                            entity.canvasX = entity.canvasX - 30;
                            entity.attacked = true;

                        }
 
                        

                        if (entity.direction === "left") {

                            entity.animationState = "idleLeft";
                        } else {

                            entity.animationState = "idleRight";
                        }

                        entity.animationAttackLeft.elapsedTime = 0;
                        entity.animationAttackRight.elapsedTime = 0; 
                    }
                }
            }
        }
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "skeleton") {

            if (this !== entity && this.collide(entity)) {
                //console.log('colliding');

                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.collidedBottomEntity = entity;
                    this.canvasY = this.collidedBottomEntity.canvasY - this.height;
                    this.y = this.collidedBottomEntity.y - this.height;
                    this.jumping = false;
                    this.jumpReleased = true;
                    this.jumpElapsedTime = 0;

                } else if (this.collideTop(entity)) {

                    this.collidedTop = true;
                    this.collidedTopEntity = entity;
                    this.canvasY += 3;
                    this.y += 3;
                    this.jumping = false;

                } else if (this.collideLeft(entity)) {
                    //fall after colliding left
                    this.collidedLeft = true;
                    this.collidedLeftEntity = entity;

                    if (!this.collidedBottom && !this.jumping) {
                        this.oldY = this.y;
                        this.canvasY += 3;
                        this.y += 3;
                    } 

                } else if (this.collideRight(entity)) {

                    this.collidedRight = true;
                    this.collidedRightEntity = entity;
                    
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

            if (entity.name === "platform" || entity.name === "skeleton") {
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

                if (entity.name === "platform" || entity.name === "skeleton") {
                    //check if still colliding right with a platform we collided right with
                    if (this.collidedRightEntity === entity &&  
                        !this.collide(entity)) {
                        
                        this.collidedRight = false;
                        this.collidedRightEntity = null;

                    } else if (this.collidedLeftEntity === entity &&
                        !this.collide(entity)) {

                        this.collidedLeft = false;
                        this.collidedLeftEntity = null;

                    } else if (this.collidedTopEntity === entity && 
                        !this.collideTop(entity)) {

                        //this.collidedTop = false;
                        //this.collidedTop = null;

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
            this.jumpReleased = false;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;
            this.jumpStartTime = gameEngine.timer.gameTime;
            // this.jumpTimeHeld += gameEngine.timer.tick();
            // startTimer(this.animationJumpRight.elapsedTime);


        } else if (!gameEngine.keyMap["Space"] && this.jumping && !this.collidedBottom) {
            this.jumpReleased = true;
            // this.jumping = false;

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
    var knightOldBoxLeft = this.oldX;
    var knightBoxLeft = this.x;

    var otherOldBoxRight = other.oldX + other.width;
    var otherBoxRight = other.x + other.width;

    if (knightOldBoxLeft > otherOldBoxRight - 3 && //was not colliding
        knightBoxLeft <= otherBoxRight) {

        //console.log('knight collide left');
    }

    return knightOldBoxLeft > otherOldBoxRight - 3 && //was not colliding
        knightBoxLeft <= otherBoxRight;
}

//Returns true if Knight collided on his right 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideRight = function(other) {
    var oldPlayerBoxRight = this.oldX + this.width;
    var playerBoxRight = this.x + this.width;

    var oldOtherBoxLeft = other.oldX;
    var otherBoxLeft = other.x;

    if (oldPlayerBoxRight < oldOtherBoxLeft &&
        playerBoxRight >= otherBoxLeft) {

        //console.log('knight colided right');
    }


    return oldPlayerBoxRight < oldOtherBoxLeft + 3 &&
        playerBoxRight >= otherBoxLeft;
}

//Returns true if Knight collided on his top 
//This function assumes there was a collision
//Should not be called if there was no collision
Knight.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        //console.log('knight colided top');
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

//Checks to see if enemy is within attack range. 
//Returns true if it is, false otherwise
Knight.prototype.collideAttackRight = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 92;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Knight.prototype.collideAttackLeft = function(other) {
    var attackBoxLeft = this.x - 92;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;

}

Knight.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 15;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Knight.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 15;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Knight.prototype.jump = function(totalHeight, timeSinceJump, maxJumpTime) {

    var jumpDistance = 1 - timeSinceJump / maxJumpTime;

    var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

    this.oldY = this.y;
    this.canvasY = this.lastGroundY - this.height - height;
    this.y = this.canvasY;
};

Knight.prototype.draw = function() {
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

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

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 55, this.canvasY);

    } else if (this.animationState === "idleLeft") {

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

            if (this != entity && this.collide(entity)) {
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

    } else if (this.animationState === "idleLeft") { // START LEFT HERE

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

            if (this != entity && this.collide(entity)) {
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

var SKELETON_ID = 0;

// START OF ENEMIES
function Skeleton(game, x, y) {
    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonidleleft.png");
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/skeletonidleright.png"); 
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/skeleton-walk-left.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/skeleton-walk-right.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/skeleton-attack-left.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/skeleton-attack-right.png");

    var knightImpactRightSpriteSheet =  AM.getAsset("./img/knight-impact-right.png");

    this.id = SKELETON_ID;
    SKELETON_ID++;
    
    this.game = game;
    this.ctx = game.ctx;
    this.name = "skeleton";

    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 0.5);
    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.05, 8, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 4, 0.07, 12, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 288, 3, 0.03, 14, false, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 288, 3, 0.03, 14, false, 0.5);
    
    this.animationKnightImpactRight = new Animation(this, knightImpactRightSpriteSheet, 240, 240, 3, 0.05, 6, false, 0.3);

    this.animationState = "idleLeft";
    this.direction = "left";

    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE - 5;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;

    this.attacking = false;
    this.attacked = false;

    this.collidedWith = null;
    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false;
    this.collidedBottom = false;
    this.collidedTop = false; 

    this.collidedLeftEntity = null;
    this.collidedRightEntity = null;
    this.collidedTopEntity = null;
    this.collidedBottomEntity = null;
}

Skeleton.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
}

Skeleton.prototype.collideLeft = function(other) {
    var oldSkeletonBoxLeft = this.oldX;
    var skeletonBoxLeft = this.x;

    var oldOtherBoxRight = other.oldX + other.width;
    var otherBoxRight = other.x + other.width;

    if (oldSkeletonBoxLeft + 3 > oldOtherBoxRight && //was not colliding
        skeletonBoxLeft <= otherBoxRight) {

        //console.log('skeleton collide left');
    }

    return oldSkeletonBoxLeft + 3 > oldOtherBoxRight && //was not colliding
        skeletonBoxLeft <= otherBoxRight;
}

Skeleton.prototype.collideRight = function(other) {
    var skeletonOldBoxRight = this.oldX + this.width;
    var skeletonBoxRight = this.x + this.width;

    var otherOldBoxLeft = other.oldX;
    var otherBoxLeft = other.x;

    if (skeletonOldBoxRight - 3 < otherOldBoxLeft &&
        skeletonBoxRight >= otherBoxLeft) {

        //console.log('skeleton colided right');
    }

    return skeletonOldBoxRight - 3 < otherOldBoxLeft &&
        skeletonBoxRight >= otherBoxLeft;
}

Skeleton.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        //console.log('skeleton colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

Skeleton.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        //console.log('skeleton collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
}

Skeleton.prototype.collideAttackRight = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 92;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}


Skeleton.prototype.collideAttackLeft = function(other) {
    var attackBoxLeft = this.x - 92;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

//This function checks to see if there is any entity that
//the skeleton will collide into after getting hit within 30px
//to the left
Skeleton.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 30;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

//This function checks to see if there is any entity that
//the skeleton will collide into after getting hit within 30px
//to the right
Skeleton.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 30;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;

}

Skeleton.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();
    var background = gameEngine.getCurrentBackground();
    var foreground = gameEngine.getCurrentForeground();

    if (this.attacking) {
        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.game.entities[i];

            if (entity.name === "knight") {

                if (this.direction === "right" && this.collideAttackRight(entity)) {
                    //console.log('skeleton landed attack right');

                    var frame = this.animationAttackRight.currentFrame();
                    //console.log(frame);

                    if (this.animationAttackRight.currentFrame() === 10) {

                        //this.attacking = false;

                        var knockBackCollidedWith = null;

                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            var potentialCollision = gameEngine.entities[j];

                            if (potentialCollision !== this && //player can't knock back into this skeleton 
                                potentialCollision !== entity && //player can't knock back into iteself
                                potentialCollision !== entity.collidedBottomEntity) { //cant knock back onto the ground platform

                                if (entity.knockBackRightCollide(potentialCollision)) {

                                    if (potentialCollision.x >= entity.x) { //must be to the right of the knight

                                        if (!knockBackCollidedWith) {

                                            knockBackCollidedWith = potentialCollision;

                                            if (potentialCollision.name === "platform") {
                                                //debugger;
                                            }
                                            
                                        } else {

                                            var currentKnockBackDistance = knockBackCollidedWith.x - (entity.x + entity.width);

                                            //dont knock back into something behind the knight
                                            if (potentialCollision.x + potentialCollision.width < entity.x + entity.width) {

                                                var potentialKnockBackDistance = entity.x - (potentialCollision.x + potentialCollision.width);

                                                console.log('potentialKnockBackDistance: ' + potentialKnockBackDistance);

                                                if (potentialKnockBackDistance < currentKnockBackDistance) { //this collision distance is shorter

                                                    //set new entity to collide into
                                                    knockBackCollidedWith = potentialCollision;

                                                    if (potentialCollision.name === "platform") {
                                                        //debugger;
                                                    }
                                                }
                                            }
                                        }  
                                    }    
                                }
                            }    
                        }

                        if (knockBackCollidedWith) {

                            var distanceFromCollision = Math.abs((entity.x + entity.width) - knockBackCollidedWith.x);
                            console.log(distanceFromCollision);

                            entity.x += distanceFromCollision;
                            entity.oldX = entity.x;
                            foreground.x -= distanceFromCollision;
                            this.canvasX -= distanceFromCollision;

                        } else {

                            //going to have to flip this when doing attacked animation
                            entity.x = entity.x + 15;
                            entity.oldX = entity.x;
                        
                            foreground.x -= 15;
                            this.canvasX -= 15;
                        }

                        entity.attacked = true;
                        
                        //for knockback effect, since hero canvas position stays the same
                        //have everything else move forward relative to the hero to make
                        //it seem like the hero has been knocked back
                        for (var j = 0; j < gameEngine.entities.length; j++) {

                            if (this !== gameEngine.entities[j]) {
                                
                                if (gameEngine.entities[j].name === "platform" || 
                                    gameEngine.entities[j].name === "tree" ||
                                    gameEngine.entities[j].name === "skeleton") {

                                    var other = gameEngine.entities[j];

                                    if (knockBackCollidedWith) {

                                        other.canvasX -= distanceFromCollision;

                                    } else {

                                        other.canvasX -= 15;
                                    }
                                    

                                }
                            }
                        }
                    }
                    

                } else if (this.direction === "left" && this.collideAttackLeft(entity)) {
                    
                    var skeletonAttackFrame = this.animationAttackLeft.currentFrame();

                    if (skeletonAttackFrame === 10) {

                        var knockBackCollidedWith = null;

                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            var potentialCollision = gameEngine.entities[j];

                            if (potentialCollision !== entity &&  //player can't knock back into iteself
                                potentialCollision !== entity.collidedBottomEntity && //cant knock back onto the ground platform
                                potentialCollision !== this) {//player can't knock back into this skeleton 

                                if (entity.knockBackLeftCollide(potentialCollision)) {
                                    
                                    
                                    if (potentialCollision.x + potentialCollision.width <= entity.x) { //must be to the left of the knight

                                        if (!knockBackCollidedWith) {

                                            knockBackCollidedWith = potentialCollision;
                                            
                                        } else {

                                            var currentKnockBackDistance = entity.x - (knockBackCollidedWith.x + knockBackCollidedWith.width);

                                            //dont knock back into something behind the knight
                                            if (potentialCollision.x + potentialCollision.width < entity.x) {

                                                var potentialKnockBackDistance = entity.x - (potentialCollision.x + potentialCollision.width);

                                                console.log('potentialKnockBackDistance: ' + potentialKnockBackDistance);

                                                if (potentialKnockBackDistance < currentKnockBackDistance) { //this collision distance is shorter

                                                    //set new entity to collide into
                                                    knockBackCollidedWith = potentialCollision;
                                                }
                                            }
                                        }  
                                    }
                                }
                            }
                        }

                        //set knock back canvasX
                        if (knockBackCollidedWith) {
   
                            var distanceFromCollision = Math.abs(entity.x - (knockBackCollidedWith.x + knockBackCollidedWith.width));
                            console.log(distanceFromCollision);


                            entity.x -= distanceFromCollision;
                            entity.oldX = entity.x;
                            foreground.x += distanceFromCollision;
                            this.canvasX += distanceFromCollision;

                        } else { //nothing to knock back collide with so knock back full distance

                            entity.x = entity.x - 15;
                            entity.oldX = entity.x;
                            foreground.x += 15;
                            this.canvasX += 15;    
                        }

                        entity.attacked = true;
                        
                        //for knockback effect, since hero canvas position stays the same
                        //have everything else move forward relative to the hero to make
                        //it seem like the hero has been knocked back
                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            
                            if (this !== gameEngine.entities[j]) {
                                
                                if (gameEngine.entities[j].name === "platform" || 
                                    gameEngine.entities[j].name === "tree" ||
                                    gameEngine.entities[j].name === "skeleton") {

                                    //other entities in the game
                                    var other = gameEngine.entities[j];

                                    if (knockBackCollidedWith) {

                                        other.canvasX += distanceFromCollision;

                                    } else {

                                        other.canvasX += 15;
                                    }
                                }
                            }   
                        }
                    }
                }
            }
        }
    }
    
    //check if enemy collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (this !== entity && (entity.name === "platform" || 
            entity.name === "knight" || entity.name === "skeleton")) {

            if (this != entity && this.collide(entity)) {

                this.collidedWith = entity;

                if (this.collideLeft(entity)) {
                    
                    this.collidedLeft = true;
                    this.collidedLeftEntity = entity;
                    
                    //fall after colliding left
                    if (!this.collidedBottom && !this.jumping) {
                        this.oldY = this.y;
                        this.canvasY += 3;
                        this.y += 3;
                    } 

                } else if (this.collideRight(entity)) {

                    this.collidedRight = true;
                    this.collidedRightEntity = entity;

                    if (!this.collidedBottom && !this.jumping) {
                        this.oldY = this.y;
                        this.y += 3;
                        this.canvasY += 3;
                    } 

                } else if (this.collideBottom(entity)) {
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.collidedBottomEntity = entity;

                } else if (this.collideTop(entity)) {

                    this.collidedTop = true;
                    this.collidedTopEntity = entity;
                    this.canvasY += 3;
                    this.y += 3;
                } 
            }
        }
    }

    //check if skeleton is no longer colliding with any platforms
    if (this.collidedWith) {
        var stillColliding = false;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.game.entities[i];

            if (entity.name === "platform" || entity.name === "knight") {
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

                if (this !== entity && 
                    (entity.name === "platform" || 
                    entity.name === "knight" ||
                    entity.name === "skeleton")) {

                    //check if still colliding right with a platform we collided right with
                    if (this.collidedRightEntity === entity &&  
                        !this.collide(entity)) {
                        
                        this.collidedRight = false;
                        this.collidedRightEntity = null;

                    } else if (this.collidedLeftEntity === entity &&
                        !this.collide(entity)) {

                        //console.log('here');

                        this.collidedLeft = false;
                        this.collidedLeftEntity = null;

                    } else if (this.collidedTopEntity === entity && 
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

    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }

    var distanceFromHero = Math.abs(currentCharacter.x - this.x);

    //Skeleton AI
    if (distanceFromHero <= 400) {


        if (distanceFromHero <= 80) {

            
        
            if (!this.attacking) {

                if (this.direction === "right") {

                    this.animationState = "attackRight";

                } else {

                    this.animationState = "attackLeft";
                    
                }
                
                this.attacking = true;
                
            }  

        } else if (currentCharacter.x < this.x && !this.collidedLeft && !this.attacking) {
        
            this.direction = "left";
            this.animationState = "walkLeft";
            this.oldX = this.x;
            this.x -= 2;
            this.canvasX -= 2 ; 
        
        } else if (currentCharacter.x > this.x && !this.collidedRight && !this.attacking) {

            this.direction = "right";
            this.animationState = "walkRight";
            this.oldX = this.x;
            this.x += 2;
            this.canvasX += 2;

        }
        
    }

    if (this.id === 0) {

        if (gameEngine.keyMap["KeyV"]) {

            if (this.direction === "left") {

                this.animationState = "attackLeft";

            } else {

                this.animationState = "attackRight";
            }
            
            this.attacking = true;

        } else if (gameEngine.keyMap["KeyZ"] && !this.collidedLeft && !this.attacking) {

            this.direction = "left";
            this.animationState = "walkLeft";
            this.oldX = this.x;
            this.x -= 2;
            this.canvasX -= 2;
            
        } else if (gameEngine.keyMap["KeyC"] && !this.collidedRight && !this.attacking) {

            this.direction = "right";
            this.animationState = "walkRight";
            this.oldX = this.x;
            this.x += 2;
            this.canvasX += 2;

        }

    } else if (this.id === 1) {

        if (gameEngine.keyMap["KeyM"]) {

            if (this.direction === "left") {

                this.animationState = "attackLeft";

            } else {

                this.animationState = "attackRight";
            }
            

            this.attacking = true;

        } else if (gameEngine.keyMap["ArrowLeft"] && !this.collidedLeft && !this.attacking) {

            this.direction = "left";
            this.animationState = "walkLeft";
            this.oldX = this.x;
            this.x -= 2;
            this.canvasX -= 2;
            
        } else if (gameEngine.keyMap["ArrowRight"] && !this.collidedRight && !this.attacking) {

            this.direction = "right";
            this.animationState = "walkRight";
            this.oldX = this.x;
            this.x += 2;
            this.canvasX += 2;

        }   

    }
};



Skeleton.prototype.draw = function() {
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY - 4);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY - 4);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 20, this.canvasY - 4);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 12, this.canvasY - 4);        

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 115, this.canvasY - 52);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY - 52);
    }

    if (this.attacked) {

        this.animationKnightImpactRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 10, this.canvasY + 15);
    }
};


// END ENEMIES

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
    var currentCharacter = gameEngine.getCurrentCharacter();

    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {
        this.x = this.x - 1;
    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {
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

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

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

    //this.x = 29 * TILE_SIZE;
    //this.y = 25 * TILE_SIZE;

    this.width = 8 * TILE_SIZE;
    this.height = 7 * TILE_SIZE;

    this.canvasX = 29 * TILE_SIZE;
    this.canvasY = 25 * TILE_SIZE;
}

Tree.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.canvasX + 1.5, this.canvasY - 2.0);
};

Tree.prototype.update = function() {
    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();
    
    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }
}

// GRAPPLE
function Grapple(gameEngine, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.d2Theta1 = 0;
    this.d2Theta2 = 0;
    this.dTheta1 = 0;
    this.dTheta2 = 0;
    this.Theta1 = 0 * (Math.PI) / 2;
    this.Theta2 = 2.3 * (Math.PI) / 2;
    this.m1 = 10;
    this.m2 = 20;
    this.l1 = 100;
    this.l2 = 100;
    this.X0 = 350;
    this.Y0 = 60;
    this.g = 9.8;
    this.time = 0.05;
}

Grapple.prototype.drawCircle = function(myCircle, context) {
    context.beginPath();
    context.arc(myCircle.x, myCircle.y, myCircle.mass, 0, 2 * Math.PI, false);
    context.fillStyle = '#000';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.stroke();
};

Grapple.prototype.drawLine = function(myLine, context) {
    context.beginPath();
    context.moveTo(myLine.x0, myLine.y0);
    context.lineTo(myLine.x, myLine.y);
    context.strokeStyle = 'red';
    context.stroke();
};

Grapple.prototype.animate = function(myCircle1, myCircle2, myLine1, myLine2, canvasX, canvasY, context) {

    mu = 1 + this.m1 / this.m2;

    this.d2Theta1 = (this.g * (Math.sin(this.Theta2) * Math.cos(this.Theta1 - this.Theta2) - mu *
        Math.sin(this.Theta1)) - (this.l2 * this.dTheta2 * this.dTheta2 + this.l1 * this.dTheta1 * this.dTheta1 *
        Math.cos(this.Theta1 - this.Theta2)) * Math.sin(this.Theta1 - this.Theta2)) / (this.l1 * (mu - Math.cos(this.Theta1 - this.Theta2) *
        Math.cos(this.Theta1 - this.Theta2)));

    this.d2Theta2 = (mu * this.g * (Math.sin(this.Theta1) * Math.cos(this.Theta1 - this.Theta2) - Math.sin(this.Theta2)) +
        (mu * this.l1 * this.dTheta1 * this.dTheta1 + this.l2 * this.dTheta2 * this.dTheta2 * Math.cos(this.Theta1 -
            this.Theta2)) * Math.sin(this.Theta1 - this.Theta2)) / (this.l2 * (mu - Math.cos(this.Theta1 - this.Theta2) *
        Math.cos(this.Theta1 - this.Theta2)));
    this.dTheta1 += this.d2Theta1 * this.time;
    this.dTheta2 += this.d2Theta2 * this.time;
    this.Theta1 += this.dTheta1 * this.time;
    this.Theta2 += this.dTheta2 * this.time;

    myCircle1.x = this.X0 + this.l1 * Math.sin(this.Theta1);
    myCircle1.y = this.Y0 + this.l1 * Math.cos(this.Theta1);
    myCircle2.x = this.X0 + this.l1 * Math.sin(this.Theta1) + this.l2 * Math.sin(this.Theta2);
    myCircle2.y = this.Y0 + this.l1 * Math.cos(this.Theta1) + this.l2 * Math.cos(this.Theta2);

    myLine1.x = myCircle1.x;
    myLine1.y = myCircle1.y;
    myLine2.x0 = myCircle1.x;
    myLine2.y0 = myCircle1.y;
    myLine2.x = myCircle2.x;
    myLine2.y = myCircle2.y;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawLine(myLine1, context);
    this.drawLine(myLine2, context);
    // this.drawCircle(myCircle1, context);
    this.drawCircle(myCircle2, context);
};

Grapple.prototype.update = function() {
    this.run(this.ctx);
};

var init = {};

Grapple.prototype.run = function(context) {
    var that = this;
    var myLine1 = { x0: this.X0, y0: this.Y0, x: 0, y: 0 };
    var myLine2 = { x0: 0, y0: 0, x: 0, y: 0 };
    var myCircle1 = {
        x: this.X0 + this.l1 * Math.sin(this.Theta1),
        y: this.Y0 + this.l1 *
            Math.cos(this.Theta1),
        mass: this.m1
    };
    var myCircle2 = {
        x: this.X0 + this.l1 * Math.sin(this.Theta1) + this.l2 *
            Math.sin(this.Theta2),
        y: this.Y0 + this.l1 * Math.cos(this.Theta1) + this.l2 *
            Math.cos(this.Theta2),
        mass: this.m2
    };

    clearInterval(init);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    init = setInterval(function() {
        that.animate(myCircle1, myCircle2, myLine1, myLine2, this.canvasX, this.canvasY, context);
    }, 10);
};
