var TILE_SIZE = 16;


function jump(character) {
    console.log("jump");


    character.collidedBottom = false;

    //     // this.timeSinceJump = gameEngine.timer.gameTime - this.jumpStartTime;
    //     // var maxJumpTime = .5;
    //     // var minJumpTime = .05;
    //     // var midJumpTime = .2;
    //     // var totalJumpHeight = 150;
    //     // var minJumpHeight = 50;


    var jumpDistance = character.jumpElapsedTime /
        character.animationJumpRight.totalTime;

    var totalHeight = 120;

    if (jumpDistance > 0.5)
        jumpDistance = 1 - jumpDistance;

    var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

    character.oldY = character.y;
    character.canvasY = character.lastGroundY - character.height - height;
    character.y = character.canvasY;

}

function Knight(gameEngine, gameState, progressBar) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/knightidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/knightwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/knightattackright.png");
    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/knightidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/knightwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/knightattackleft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/knightjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/knightjumpleft.png");
    var poofImg = AM.getAsset("./img/poofspritesheet.png");

    this.gameEngine = gameEngine;
    this.gameState = gameState;
    this.ctx = gameEngine.ctx;
    this.name = "knight";

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.05, 14, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.015, 14, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 2, 0.1, 14, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.035, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 2, 0.015, 14, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    
    this.animationPoof = new EffectAnimation(this, poofImg, 512, 512, 3, 0.06, 8, false, 0.3);

    this.animationState = "idleRight";

    this.direction = "right";

    this.x = 34 * TILE_SIZE;
    this.y = 35 * TILE_SIZE;

    this.oldX = 34 * TILE_SIZE;
    this.oldY = 35 * TILE_SIZE;

    this.width = 2 * TILE_SIZE;

    this.height = 4 * TILE_SIZE - 5;

    this.canvasX = 34 * TILE_SIZE;
    this.canvasY = 35 * TILE_SIZE;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;
    this.jumpReleased = false;
    this.jumpTimeHeld = 0;
    this.jumpStartTime = 0;
    this.timeSinceJump = 0;
    this.health = 50;
    this.progressBar = progressBar;
    this.hasFallen = false;
    // this.progressBar.updateHealth(this.health);

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    this.jumpIsDone = false;

    this.attacking = false;
    this.attacked = false;
    this.showPoof = false;

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

//checks for all sides collision
Knight.prototype.collide = function(other) {

    var knightLeft = this.x;
    var knightRight = this.x + this.width;
    var knightTop = this.y;
    var knightBottom = Math.max(this.y + this.height, this.oldY, this.height);

    var otherLeft = other.x;
    var otherRight = other.x + other.width;
    var otherTop = other.y;
    var otherBottom = other.y + other.height;

    if (this.collidedBottomEntity && this.collidedBottomEntity.name === "platform" && other.name === "platform") {

        if (!(knightLeft <= otherRight &&
                knightRight >= otherLeft &&
                knightTop <= otherBottom &&
                knightBottom >= otherTop)) {

            //debugger;
            //knightBottom += 30;
        }

        if (!(knightLeft <= otherRight &&
                knightRight >= otherLeft &&
                knightTop <= otherBottom &&
                knightBottom >= otherTop)) {

            //debugger;
        }
    }

    return knightLeft <= otherRight &&
        knightRight >= otherLeft &&
        knightTop <= otherBottom &&
        knightBottom >= otherTop;
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


    if (other.name === "box") {

        return oldPlayerBoxRight < oldOtherBoxLeft &&
            playerBoxRight >= otherBoxLeft;

    } else {

        return oldPlayerBoxRight < oldOtherBoxLeft + 3 &&
            playerBoxRight >= otherBoxLeft;
    }


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

Knight.prototype.update = function() {
    this.progressBar.updateHealth(this.health);

    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

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

    if (this.attacking) {

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.gameEngine.entities[i];

            if ((entity.name === "skeleton" || entity.name === "skeletonArcher") && !entity.attacked) {

                if (this.direction === "right" && this.collideAttackRight(entity)) {
                    //console.log('landed attack right');

                    if (this.animationAttackRight.currentFrame() === 10) {
                        entity.attacked = true;

                        this.gameState.updateHealth(entity);

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

                        } else { //nothing to knock back into

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
                        this.gameState.updateHealth(entity);

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

                        } else { //nothing to knock back into

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

    //check to see if attack animation is done so that 
    //we can can set all the entity.attacked properties to false.
    //this means that we can safely attack an enemy and decrease their health.
    //the resason we have to do this is because update will get to frame 10 twice
    //but we only want to decrease health once per attack
    if (this.animationAttackRight.isDone()) {
        this.animationAttackRight.elapsedTime = 0;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = gameEngine.entities[i];

            if (entity.name === "skeleton" || entity.name === "skeletonArcher") {
                entity.attacked = false;
            }
        }

    }

    //check if player collided with any platforms, skeletons, or boxes
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.gameEngine.entities[i];
        if (this.collide(entity) && entity.name === "potion") {

            this.gameState.restoreHealth(this);
            gameEngine.removeEntity(entity);

        }


        if (entity.name === "platform" ||
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher" ||
            entity.name === "spike") {


            if (this !== entity && this.collide(entity)) {


                this.collidedWith = entity;
                if (entity.name === "spike") {
                    this.gameState.updateHealth(this);
                }
                if (this.collideBottom(entity) && !this.collideRight(entity)) {

                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.collidedBottomEntity = entity;
                    this.oldY = this.y;
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

                        //console.log(this.y);
                    }
                }
            }
        }
    }

    //check if player is no longer colliding with any platforms, skeletons, or boxes
    if (this.collidedWith) {
        var stillColliding = false;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" ||
                entity.name === "skeleton" ||
                entity.name === "box" ||
                entity.name === "skeletonArcher") {


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
                var entity = this.gameEngine.entities[i];

                if (entity.name === "platform" ||
                    entity.name === "skeleton" ||
                    entity.name === "box" ||
                    entity.name === "skeletonArcher") {

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
                        !this.collide(entity)) {

                        this.collidedTop = false;
                        this.collidedTopEntity = null;

                    } else if (this.collidedBottomEntity === entity &&
                        !this.collide(entity)) {

                        this.collidedBottom = false;
                        this.collidedBottomEntity = null
                    }
                }
            }
        }

    } else if (!this.jumping) { //player has not collided therefore fall

        this.oldY = this.y;
        this.canvasY += 5;
        this.y += 5;

        //console.log(this.y);
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

    }

    if (gameEngine.keyMap["Digit1"] || gameEngine.keyMap["Digit2"] || gameEngine.keyMap["Digit3"]) {
        this.showPoof = true;
    }

    if (this.animationPoof.isDone()) {
        this.showPoof = false;
        this.animationPoof.elapsedTime = 0;
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

Knight.prototype.jump = function(totalHeight, timeSinceJump, maxJumpTime) {

    var jumpDistance = 1 - timeSinceJump / maxJumpTime;

    var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

    this.oldY = this.y;
    this.canvasY = this.lastGroundY - this.height - height;
    this.y = this.canvasY;
};

Knight.prototype.draw = function() {
    this.ctx.fillStyle = "black";
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 48, this.canvasY - 2);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 30, this.canvasY - 2);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 68, this.canvasY - 2);
    }

    if (this.showPoof) {
        this.animationPoof.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 50, this.canvasY - 60);
    }
}

//Constructor for mage
function Mage(gameEngine, gameState, progressBar) {

    var idleRightAnimationSpriteSheet = AM.getAsset("./img/mageIdleRight.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/mageWalkRight.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/mageAttackRight.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/mageIdleLeft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/mageWalkLeft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/mageAttackLeft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/mageJumpRight.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/magejumpleft.png");
    
    var boxImpactSpriteSheet = AM.getAsset("./img/mageimpact.png");
    var poofSpriteSheet = AM.getAsset("./img/poofspritesheet.png");


    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    this.name = "mage";
    this.progressBar = progressBar;
    
    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.05, 10, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 3, 0.035, 8, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.015, 17, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 5, 0.1, 10, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 4, 0.07, 8, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 2, 0.015, 17, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 10, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 10, false, 0.5);

    this.animationBoxEffect = new EffectAnimation(this, boxImpactSpriteSheet, 192, 192, 4, 0.02, 11, false, 0.6);
    this.animationPoof = new EffectAnimation(this, poofSpriteSheet, 512, 512, 3, 0.06, 8, false, 0.3);
    
    this.animationState = "idleRight";

    this.direction = "right";
    this.health = 50;
    this.progressBar.updateHealth(this.health);
    
    this.showBoxEffect = false;
    this.showPoof = false;


    //for direction of collision
    this.oldX = 34 * TILE_SIZE;
    this.oldY = 14 * TILE_SIZE;

    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE - 5;

    // this.canvasX = 34 * TILE_SIZE;
    // this.canvasY = 14 * TILE_SIZE;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;
    this.jumpReleased = false;
    this.jumpTimeHeld = 0;
    this.jumpStartTime = 0;
    this.timeSinceJump = 0;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    this.jumpIsDone = false;

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

//checks for all sides collision
Mage.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
};

//Returns true if Knight collided on his left 
//This function assumes there was a collision
//Should not be called if there was no collision
Mage.prototype.collideLeft = function(other) {
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
Mage.prototype.collideRight = function(other) {
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
Mage.prototype.collideTop = function(other) {
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
Mage.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y &&
        this.y + this.height >= other.y) {

        //console.log('collided bottom');
    }

    return this.oldY + this.height < other.y &&
        this.y + this.height >= other.y;
}

//Checks to see if enemy is within attack range. 
//Returns true if it is, false otherwise
Mage.prototype.collideAttackRight = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 92;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Mage.prototype.collideAttackLeft = function(other) {
    var attackBoxLeft = this.x - 92;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Mage.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 15;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Mage.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 15;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Mage.prototype.jump = function(totalHeight, timeSinceJump, maxJumpTime) {

    var jumpDistance = 1 - timeSinceJump / maxJumpTime;

    var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

    this.oldY = this.y;
    this.canvasY = this.lastGroundY - this.height - height;
    this.y = this.canvasY;
};


Mage.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

    //console.log(this.impact);

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

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.gameEngine.entities[i];
        if (this.collide(entity) && entity.name === "potion") {
            // console.log("collided with potion");
            // this.
            this.gameState.restoreHealth(this);
            gameEngine.removeEntity(entity);

        }

        if (entity.name === "platform" ||
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher" ||
            entity.name === "spike") {



            if (this != entity && this.collide(entity)) {
                //console.log('colliding');

                this.collidedWith = entity;

                if (entity.name === "spike") {
                    this.gameState.updateHealth(this);
                }

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
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box" || entity.name === "skeletonArcher") {
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
                var entity = this.gameEngine.entities[i];

                if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box" || entity.name === "skeletonArcher") {
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

    }

    //box effect
    if (this.animationBoxEffect.isDone()) {
        this.showBoxEffect = false;
        this.animationBoxEffect.elapsedTime = 0;
    }

    //poof effect
    if (gameEngine.keyMap["Digit1"] || gameEngine.keyMap["Digit2"] || gameEngine.keyMap["Digit3"]) {
        this.showPoof = true;
    }

    if (this.animationPoof.isDone()) {
        this.showPoof = false;
        this.animationPoof.elapsedTime = 0;
    }

    //handle animation changes and summon box if click pressed
    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.showBoxEffect = true;
            gameEngine.addEntity(box);

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.showBoxEffect = true;
            gameEngine.addEntity(box);

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping

            this.jumping = true;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackRight";
            this.animationAttackRight.elapsedTime = 0;

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.showBoxEffect = true;
            gameEngine.addEntity(box);

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

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.showBoxEffect = true;
            gameEngine.addEntity(box);

        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.impact = true;
            gameEngine.addEntity(box);

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping

            this.jumping = true;
            this.animationState = "jumpLeft";
            this.animationJumpLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

            var box = new Box(gameEngine, gameState, gameEngine.clickX, gameEngine.clickY);
            this.showBoxEffect = true;
            gameEngine.addEntity(box);

        } else if (gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkLeft";

        } else if (!gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) {

            this.animationState = "idleLeft";
        }
    }
}

Mage.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 55, this.canvasY);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 68, this.canvasY);
    }
    
    if (this.showBoxEffect) {
        
        this.animationBoxEffect.drawFrame(this.gameEngine.clockTick, this.ctx, this.gameEngine.clickX - 20, this.gameEngine.clickY);
    }

    if (this.showPoof) {

        this.animationPoof.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 50, this.canvasY - 60);
    }


}

function Box(gameEngine, gameState, x, y) {
    var currentCharacter = gameState.getCurrentCharacter();

    this.name = "box";
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    this.boxImg = AM.getAsset("./img/crate.png");
    this.boxImpactImg = AM.getAsset("./img/mageimpact.png");
    this.impactAnimation = new Animation(this, this.boxImpactImg, 192, 192, 4, 0.02, 11, false, 0.6);

    this.x = (currentCharacter.x - currentCharacter.canvasX) + x;
    this.y = y;

    this.oldX = (currentCharacter.x - currentCharacter.canvasX) + x;

    this.oldY = y;
    this.canvasX = x;
    this.canvasY = y;

    this.initialCanvasX = (currentCharacter.x - currentCharacter.canvasX) + x;

    this.width = 2 * TILE_SIZE;
    this.height = 2 * TILE_SIZE;

    this.jumping = false;

    this.collidedWith = null; //checks to see which entity the knight collided with
    this.collidedLeft = false; //checks to see if knight collided on its left side
    this.collidedRight = false;
    this.collidedBottom = false;

    this.collidedTop = false;
};

//checks for all sides collision
Box.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
};

//Returns true if Knight collided on his bottom 
//This function assumes there was a collision
//Should not be called if there was no collision
Box.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y &&
        this.y + this.height >= other.y) {

        //console.log('box collided bottom');
    }

    return this.oldY + this.height < other.y &&
        this.y + this.height >= other.y;
}

Box.prototype.collideLeft = function(other) {
    if (this.oldX > other.x + other.width && //was not colliding
        this.x <= other.x + other.width) {

        console.log('collide left');
    }

    return this.oldX > other.x + other.width && //was not colliding
        this.x <= other.x + other.width;
}

Box.prototype.collideRight = function(other) {
    if (this.oldX + this.width < other.x &&
        this.x + this.width >= other.x) {

        console.log('colided right');
    }

    return this.oldX + this.width < other.x &&
        this.x + this.width >= other.x;
}

Box.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        console.log('colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}


Box.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();

    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = gameEngine.entities[i];

        if (entity.name === "platform" || entity.name === "box") {

            if (this != entity && this.collide(entity)) {

                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpReleased = true;
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
                        this.y += 5;
                        this.canvasY += 5;
                    }
                }
            }
        }
    }

    if (this.collidedWith) {
        var stillColliding = false;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = gameEngine.entities[i];

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
                var entity = this.gameEngine.entities[i];

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

        //console.log('here');

        this.oldY = this.y;

        this.canvasY += 5;
        this.y += 5;
    }

    if (currentCharacter) {
        
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
}

Box.prototype.draw = function() {
    this.ctx.drawImage(this.boxImg, this.canvasX, this.canvasY, this.width, this.height);
};

//Constructor for gunwoman
function Gunwoman(gameEngine, gameState, progressBar) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackright.png");
    var attackRightUpAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackrightup.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackleft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpleft.png");

    var poofAnimationSpriteSheet = AM.getAsset("./img/poofspritesheet.png");

    this.gameEngine = gameEngine;
    this.gameState = gameState
    this.ctx = gameEngine.ctx;
    this.name = "gunwoman";
    this.progressBar = progressBar;
    this.hasFallen = false;

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 5, 0.05, 22, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 4, 0.015, 23, false, 0.5);
    this.animationAttackRightUp = new Animation(this, attackRightUpAnimationSpriteSheet, 384, 192, 4, .015, 22, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 5, 0.1, 22, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 4, 0.015, 19, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 11, false, 0.5);
    this.animationPoof = new EffectAnimation(this, poofAnimationSpriteSheet, 512, 512, 3, 0.06, 8, false, 0.3);
    
    this.showPoof = false;

    this.animationState = "idleRight";

    this.direction = "right";

    this.oldX = 34 * TILE_SIZE;
    this.oldY = 14 * TILE_SIZE;

    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE - 5;
    this.health = 50;
    this.progressBar.updateHealth(this.health);

    this.canvasX = 34 * TILE_SIZE;
    this.canvasY = 14 * TILE_SIZE;

    this.lastGroundY = null; //y coord of platform last collided with

    this.jumping = false;
    this.jumpReleased = false;
    this.jumpTimeHeld = 0;
    this.jumpStartTime = 0;
    this.timeSinceJump = 0;

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.
    this.jumpElapsedTime = 0;
    this.jumpIsDone = false;

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

//checks for all sides collision
Gunwoman.prototype.collide = function(other) {
    var gunWomanLeft = this.x;
    var gunWomanRight = this.x + this.width;
    var gunWomanTop = this.y;
    var gunWomanBottom = this.y + this.height

    var otherLeft = other.x;
    var otherRight = other.x + other.width;
    var otherTop = other.y;
    var otherBottom = other.y + other.height;

    return gunWomanLeft <= otherRight &&
        gunWomanRight >= otherLeft &&
        gunWomanTop <= otherBottom &&
        gunWomanBottom >= otherTop;
};

//Returns true if Knight collided on his left 
//This function assumes there was a collision
//Should not be called if there was no collision
Gunwoman.prototype.collideLeft = function(other) {
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
Gunwoman.prototype.collideRight = function(other) {
    var oldPlayerBoxRight = this.oldX + this.width;
    var playerBoxRight = this.x + this.width;

    var oldOtherBoxLeft = other.oldX;
    var otherBoxLeft = other.x;

    if (oldPlayerBoxRight < oldOtherBoxLeft &&
        playerBoxRight >= otherBoxLeft) {

        //console.log('knight colided right');
    }


    if (other.name === "box") {

        return oldPlayerBoxRight < oldOtherBoxLeft &&
            playerBoxRight >= otherBoxLeft;

    } else {

        return oldPlayerBoxRight < oldOtherBoxLeft + 3 &&
            playerBoxRight >= otherBoxLeft;
    }
}

//Returns true if Knight collided on his top 
//This function assumes there was a collision
//Should not be called if there was no collision
Gunwoman.prototype.collideTop = function(other) {
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
Gunwoman.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y &&
        this.y + this.height >= other.y) {

        //console.log('collided bottom');
    }

    return this.oldY + this.height < other.y &&
        this.y + this.height >= other.y;
}

//Checks to see if enemy is within attack range. 
//Returns true if it is, false otherwise
Gunwoman.prototype.collideAttackRight = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 92;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Gunwoman.prototype.collideAttackLeft = function(other) {
    var attackBoxLeft = this.x - 92;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;

}

Gunwoman.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 15;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Gunwoman.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 15;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Gunwoman.prototype.jump = function(totalHeight, timeSinceJump, maxJumpTime) {

    var jumpDistance = 1 - timeSinceJump / maxJumpTime;

    var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

    this.oldY = this.y;
    this.canvasY = this.lastGroundY - this.height - height;
    this.y = this.canvasY;
};

Gunwoman.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

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
        // jump(this);
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.gameEngine.entities[i];
        if (this.collide(entity) && entity.name === "potion") {
            // console.log("collided with potion");
            // this.
            this.gameState.restoreHealth(this);
            gameEngine.removeEntity(entity);

        }



        if (entity.name === "platform" ||
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher" ||
            entity.name === "spike") {

            if (this != entity && this.collide(entity)) {
                //console.log('colliding');

                this.collidedWith = entity;
                if (entity.name === "spike") {
                    this.gameState.updateHealth(this);
                }
                if (this.collideBottom(entity) && !this.collideRight(entity)) {
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
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box" || entity.name === "skeletonArcher") {
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
                var entity = this.gameEngine.entities[i];

                if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box" || entity.name === "skeletonArcher") {
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

    }

    //Right Mouse button pressed, add wolf
    if (gameEngine.keyMap["3"] && !gameState.wolfSummoned) { 
        gameState.wolfSummoned = true;
        var wolf = new Wolf(gameEngine, gameState);
        gameEngine.addEntity(wolf);
    }

    //poof effect
    if (gameEngine.keyMap["Digit1"] || gameEngine.keyMap["Digit2"] || gameEngine.keyMap["Digit3"]) {
        this.showPoof = true;
    }

    if (this.animationPoof.isDone()) {
        this.showPoof = false;
        this.animationPoof.elapsedTime = 0;
    }

    //handle animation changes
    if (this.direction === "right") {

        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && !this.attacking) {
            if (gameEngine.clickY < this.canvasY - 50) {
                this.attacking = true;
                this.animationState = "attackRightUp";
                this.animationAttackRightUp.elapsedTime = 0;
            } else {
                this.attacking = true;
                this.animationState = "attackRight";
                this.animationAttackRight.elapsedTime = 0;

            }

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);


        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {

            if (gameEngine.clickY < this.canvasY - 50) {
                this.attacking = true;
                this.animationState = "attackRightUp";
                this.animationAttackRightUp.elapsedTime = 0;
            } else {
                this.attacking = true;
                this.animationState = "attackRight";
                this.animationAttackRight.elapsedTime = 0;
            }

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping

            this.jumping = true;
            this.animationState = "jumpRight";
            this.animationJumpRight.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //attack only if not already attacking

            if (gameEngine.clickY < this.canvasY - 50) {
                this.attacking = true;
                this.animationState = "attackRightUp";
                this.animationAttackRightUp.elapsedTime = 0;
            } else {
                this.attacking = true;
                this.animationState = "attackRight";
                this.animationAttackRight.elapsedTime = 0;

            }

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);

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

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);


        } else if (gameEngine.keyMap["1"] && !this.attacking && this.jumping) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);

        } else if (gameEngine.keyMap["Space"] && !this.jumping && this.collidedBottom) { //jump only if not already jumping

            this.jumping = true;
            this.animationState = "jumpLeft";
            this.animationJumpLeft.elapsedTime = 0;

        } else if (gameEngine.keyMap["1"] && !this.attacking && !this.jumping) { //idle left attack

            this.attacking = true;
            this.animationState = "attackLeft";
            this.animationAttackLeft.elapsedTime = 0;

            var bullet = new Bullet(gameEngine, gameState);
            gameEngine.addEntity(bullet);

        } else if (gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkLeft";

        } else if (!gameEngine.keyMap["KeyA"] && !this.jumping && !this.attacking) {

            this.animationState = "idleLeft";

        }
    }
}


Gunwoman.prototype.draw = function() {
    this.ctx.fillStyle = "black";
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

        if (this.gameEngine.clickX > this.canvasX) {

            this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 48, this.canvasY);

        } else {

            this.direction = "left";
            this.animationState = "attackLeft";
        }

    } else if (this.animationState === "idleLeft") { // START LEFT HERE

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        if (this.gameEngine.clickX < this.canvasX) {

            this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 81, this.canvasY);

        } else {

            this.direction = "right";
            this.animationState = "attackRightUp";
        }

    } else if (this.animationState === "attackRightUp") {

        if (this.gameEngine.clickX > this.canvasX) {

            this.animationAttackRightUp.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 48, this.canvasY);

        } else {

            this.direction = "left";
            this.animationState = "attackLeft";
        }
    }

    if (this.showPoof) {

        this.animationPoof.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 50, this.canvasY - 60);
    }
}

function Bullet(gameEngine, gameState) {
    this.gameEngine = gameEngine;
    this.ctx = this.gameEngine.ctx;
    this.gameState = gameState;

    this.currentCharacter = gameState.getCurrentCharacter();

    this.name = "bullet";

    this.x = this.currentCharacter.x;

    this.y = this.currentCharacter.y + 14;

    this.direction = this.currentCharacter.direction;
    this.canvasX = this.currentCharacter.canvasX;
    this.canvasY = this.currentCharacter.canvasY + 14;
    this.targetX = this.gameEngine.clickX;
    this.targetY = this.gameEngine.clickY;
    var impactImg = AM.getAsset("./img/gunimpact.png");
    this.impact = new Animation(this, impactImg, 192, 192, 5, 0.02, 16, false, .7);


    this.dx = this.targetX - this.canvasX;
    this.dy = this.targetY - this.canvasY;
    this.distance = Math.sqrt(this.dy * this.dy + this.dx * this.dx);
    this.angle = Math.atan2(this.dy, this.dx);

    this.speed = 15;
    this.hitSkeleton = false;

    this.b_dy = Math.sin(this.angle) * this.speed;
    this.b_dx = Math.cos(this.angle) * this.speed;
    this.distance = 0;

    this.width = 5;
    this.height = 3;

    this.collidedWith = null;
    this.skeleton = null;
    this.removeFromWorld = false;
}

Bullet.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
}

Bullet.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

    this.x += this.b_dx;
    this.y += this.b_dy;
    this.canvasX += this.b_dx;
    this.canvasY += this.b_dy;
    this.distance++;

    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = gameEngine.entities[i];

        if (this !== entity && this.collide(entity) && !this.collidedWith) {

            if (entity.name === "skeleton" || entity.name === "skeletonArcher") {
                this.skeleton = entity;
                this.hitSkeleton = true;
                this.collidedWith = entity;
                gameState.updateHealth(entity);
                console.log('hit skeleton');

            } else if (entity.name === "platform") {

                this.collidedWith = entity;
                console.log('hit platform')
            }
        }
    }
};

Bullet.prototype.draw = function() {
    //only draw if it hasn't collided with anything
    if (!this.collidedWith) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        //this.ctx.fillStyle = "red";
        //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    if (this.hitSkeleton) {
        this.impact.drawFrame(this.gameEngine.clockTick, this.ctx, this.skeleton.canvasX - 20, this.skeleton.canvasY - 10);

        // this.ctx.drawFrame(this.impact, this.canvasX, this.canvasY);

    }

};

//Constructor for wolf
function Wolf(gameEngine, gameState) {
    var idleRightSpriteSheet = AM.getAsset("./img/wolfidleright.png");
    var walkRightSpriteSheet = AM.getAsset("./img/wolfwalkright.png");
    var attackRightSpriteSheet = AM.getAsset("./img/wolfattackright.png");
    var walkLeftSpriteSheet = AM.getAsset("./img/wolf-walk-left.png");
    var idleLeftSpriteSheet = AM.getAsset("./img/wolf-idle-left.png");
    var attackLeftSpriteSheet = AM.getAsset("./img/wolf-attack-left.png");

    this.name = "wolf";
    this.gameState = gameState;

    this.animationIdleRight = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, .55);
    this.animationWalkRight = new Animation(this, walkRightSpriteSheet, 192, 192, 4, 0.05, 12, true, .55);
    this.animationAttackRight = new Animation(this, attackRightSpriteSheet, 288, 192, 3, 0.04, 12, true, .55);
    this.animationIdleLeft = new Animation(this, idleLeftSpriteSheet, 192, 192, 4, 0.1, 12, true, .55);
    this.animationWalkLeft = new Animation(this, walkLeftSpriteSheet, 192, 192, 4, 0.1, 12, true, .55);
    this.animationAttackLeft = new Animation(this, attackLeftSpriteSheet, 288, 192, 3, 0.04, 12, true, .55);


    this.currentCharacter = gameState.getCurrentCharacter();
    this.animationState = "idleRight";
    this.direction = "right";

    this.x = this.currentCharacter.x;
    this.y = this.currentCharacter.y;
    this.canvasX = this.currentCharacter.canvasX;
    this.canvasY = this.currentCharacter.canvasY;
    this.speed = 100;
    this.health = 1;
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.attacking = false;
    this.oldY = this.currentCharacter.y;
    this.lastGroundY = null;
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

Wolf.prototype.draw = function() {
    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 50, this.canvasY);
    }
}

Wolf.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

    var currentCharacter = this.gameState.getCurrentCharacter();
    //this.canvasX = this.currentCharacter.canvasX;
    //this.canvasY = this.currentCharacter.canvasY;

    if (currentCharacter) {

        this.x = currentCharacter.x;
        this.y = currentCharacter.y;

        var entityArr = this.gameEngine.entities;

        var enemyInRange = false;

        for (var i = 0; i < entityArr.length; i++) {

            if (entityArr[i].name === "skeleton") {
                var range = Math.abs(this.x - entityArr[i].x);

                if (range < 300 && this.x < entityArr[i].x && this.y === entityArr[i].y) {
                    this.animationState = "attackRight";
                    this.direction = "right";
                    enemyInRange = true;
                    this.attacking = true;
                }

                if (range < 300 && this.x > entityArr[i].x && this.y === entityArr[i].y) {
                    this.animationState = "attackLeft";
                    this.direction = "left";
                    enemyInRange = true;
                    this.attacking = true;
                }

            }
        }

        if (!enemyInRange) {
            this.animationState = this.currentCharacter.animationState;
            this.attacking = false;
            this.direction = this.currentCharacter.direction;
        }

        if (currentCharacter.animationState === "attackLeft" && !enemyInRange) {
            this.animationState = "idleLeft";
            this.attacking = false;
            this.direction = "left";
        } else if (currentCharacter.animationState === "attackRight" && !enemyInRange) {
            this.animationState = "idleRight";
            this.attacking = false;
            this.direction = "right";
        } else if (currentCharacter.animationState === "attackRightUp" && !enemyInRange) {
            this.animationState = "idleRight";
            this.attacking = false;
            this.direction = "right";
        }

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
            this.canvasX -= 3;

        } else if (gameEngine.keyMap["ArrowRight"] && !this.collidedRight && !this.attacking) {

            this.direction = "right";
            this.animationState = "walkRight";
            this.oldX = this.x;
            this.x += 2;
            this.canvasX += 3;

        }
    }
}


//checks for all sides collision
Wolf.prototype.collide = function(other) {

    var knightLeft = this.x;
    var knightRight = this.x + this.width;
    var knightTop = this.y;
    var knightBottom = Math.max(this.y + this.height, this.oldY, this.height);

    var otherLeft = other.x;
    var otherRight = other.x + other.width;
    var otherTop = other.y;
    var otherBottom = other.y + other.height;

    if (this.collidedBottomEntity && this.collidedBottomEntity.name === "platform" && other.name === "platform") {

        if (!(knightLeft <= otherRight &&
                knightRight >= otherLeft &&
                knightTop <= otherBottom &&
                knightBottom >= otherTop)) {

            //debugger;
            //knightBottom += 30;
        }

        if (!(knightLeft <= otherRight &&
                knightRight >= otherLeft &&
                knightTop <= otherBottom &&
                knightBottom >= otherTop)) {

            //debugger;
        }
    }

    return knightLeft <= otherRight &&
        knightRight >= otherLeft &&
        knightTop <= otherBottom &&
        knightBottom >= otherTop;
};

//Returns true if Knight collided on his left 
//This function assumes there was a collision
//Should not be called if there was no collision
Wolf.prototype.collideLeft = function(other) {
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
Wolf.prototype.collideRight = function(other) {
    var oldPlayerBoxRight = this.oldX + this.width;
    var playerBoxRight = this.x + this.width;

    var oldOtherBoxLeft = other.oldX;
    var otherBoxLeft = other.x;

    if (oldPlayerBoxRight < oldOtherBoxLeft &&
        playerBoxRight >= otherBoxLeft) {

        //console.log('knight colided right');
    }


    if (other.name === "box") {

        return oldPlayerBoxRight < oldOtherBoxLeft &&
            playerBoxRight >= otherBoxLeft;

    } else {

        return oldPlayerBoxRight < oldOtherBoxLeft + 3 &&
            playerBoxRight >= otherBoxLeft;
    }


}

//Returns true if Knight collided on his top 
//This function assumes there was a collision
//Should not be called if there was no collision
Wolf.prototype.collideTop = function(other) {
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
Wolf.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y &&
        this.y + this.height >= other.y) {

        //console.log('collided bottom');
    }

    return this.oldY + this.height < other.y &&
        this.y + this.height >= other.y;
}

//Checks to see if enemy is within attack range. 
//Returns true if it is, false otherwise
Wolf.prototype.collideAttackRight = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 92;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Wolf.prototype.collideAttackLeft = function(other) {
    var attackBoxLeft = this.x - 92;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;

}

Wolf.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 15;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Wolf.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 15;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}
