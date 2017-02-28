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

function Knight(game, gameState, progressBar) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/knightidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/knightwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/knightattackright.png");
    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/knightidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/knightwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/knightattackleft.png");

    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/knightjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/knightjumpleft.png");

    this.game = game;
    this.state = gameState;
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
    var otherTop  = other.y;
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

    var gameEngine = this.game;

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

            if (entity.name === "skeleton" && !entity.attacked) {

                if (this.direction === "right" && this.collideAttackRight(entity)) {
                    //console.log('landed attack right');

                    if (this.animationAttackRight.currentFrame() === 10) {
                        entity.attacked = true;
                        
                        this.state.updateHealth(entity);

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
                        this.state.updateHealth(entity);

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

    //check to see if attack animation is done so that 
    //we can can set all the entity.attacked properties to false.
    //this means that we can safely attack an enemy and decrease their health.
    //the resason we have to do this is because update will get to frame 10 twice
    //but we only want to decrease health once per attack
    if (this.animationAttackRight.isDone()) {
        this.animationAttackRight.elapsedTime = 0;

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = gameEngine.entities[i];
            
            if (entity.name === "skeleton") {
                entity.attacked = false;
            }
        }
        
    }

    //check if player collided with any platforms, skeletons, or boxes
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {

            if (this !== entity && this.collide(entity)) {

                this.collidedWith = entity;

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
            var entity = this.game.entities[i];

            if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

                if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

    // if (this.y >= 1000) {
    //     this.health = 0;
    //     this.hasFallen = true;
    //     this.progressBar.updateHealth(this.health);
    //     this.game.removeEntity(this);
    //     this.game.replaceCharacter();

    // } 

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

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY - 2);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY - 2);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY - 2);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 30, this.canvasY - 2);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 68, this.canvasY - 2);
    }
}


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
        
        console.log('box collided bottom');
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

//Constructor for mage
function Mage(game, state, progressBar) {

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
    this.state = state;
    this.progressBar = progressBar;

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
    this.health = 50;
    this.progressBar.updateHealth(this.health);

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

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {

            if (this != entity && this.collide(entity)) {
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

            if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

                if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

Box.prototype.update = function() {

    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();

    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "box") {

            if (this != entity && this.collide(entity)) {
                //console.log('colliding');


                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpReleased = true;
                    this.jumpElapsedTime = 0;

                }  else if (this.collideTop(entity)) {

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
            var entity = this.game.entities[i];

            if (entity.name === "platform" || entity.name === "box") {
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

                if (entity.name === "platform" || entity.name === "box") {
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
    if (gameEngine.keyMap["KeyD"]  && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }
}

function Box(game, x, y) {
    this.radius = 10;
    this.name = "box";
    this.game = game;
    this.ctx = game.ctx;
    // this.colors = ["Green", "Green", "Blue", "Red"];
    // this.setNotIt();
    // x = Math.random();
    // console.log("random = " + x);
    // Entity.call(this, game, this.radius + .5 * (255 - this.radius * 2), this.radius + .5 * (1 - this.radius * 2));
    
    // this.direction = "right";
    
    // this.x = 26 * TILE_SIZE;
    // this.y = 14 * TILE_SIZE;
    
    // this.width = .78 * TILE_SIZE;
    // this.height = .78 * TILE_SIZE;
    
    // this.canvasX = 26 * TILE_SIZE;
    // this.canvasY = 14 * TILE_SIZE;
   
    // this.lastGroundY = null; //y coord of platform last collided with


    // var currentCharacter = that.getCurrentCharacter();

    // var rect = that.ctx.canvas.getBoundingClientRect();
    // var xCord = x;
    // var yCord = y;
    // console.log("The x: " + xCord + " and y: " + yCord);

    // this.canvasX = xCord/TILE_SIZE;
    // this.canvasY = yCord/TILE_SIZE;

    // this.width = 2;
    // this.height = 2;

    // this.gameEngine = that;

    // this.x = (currentCharacter.x - currentCharacter.canvasX) + xCord;
    // this.y = yCord/TILE_SIZE;

    // var platformBox = new Platform(this.gameEngine, this.canvasX, this.canvasY, 2, 2);
  
    /*platformBox.x = this.x;
    // console.log(platformBox); 
    this.gameEngine.addEntity(platformBox);*/
    // var gameEngine = new GameEngine();
    

    //this property is used for jumping.
    //Each animation shares this property 
    //to do jump + attack, etc.

    var currentCharacter = game.getCurrentCharacter();
    this.x = (currentCharacter.x - currentCharacter.canvasX) + x;

    this.oldX = (currentCharacter.x - currentCharacter.canvasX) + x;

    // this.x = x  ; //game world x and y coordinates
    this.y = y ;
    this.oldY = y;

    this.canvasX = x;
    this.canvasY = y;

    this.width = 2 * TILE_SIZE;
    this.height = 2 * TILE_SIZE;


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

    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();

    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "box") {

            if (this != entity && this.collide(entity)) {
                //console.log('colliding');


                this.collidedWith = entity;

                if (this.collideBottom(entity)) {
                    this.collidedBottom = true;
                    this.lastGroundY = this.collidedWith.y;
                    this.jumping = false;
                    this.jumpReleased = true;
                    this.jumpElapsedTime = 0;

                }  else if (this.collideTop(entity)) {

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
    if (gameEngine.keyMap["KeyD"]  && !currentCharacter.collidedRight) {

        this.canvasX -= 3;

    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

        this.canvasX += 3;
    }
}

Box.prototype.draw = function() {
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);

};

//Constructor for gunwoman
function Gunwoman(game, state, progressBar) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackright.png");
    var attackRightUpAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackrightup.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanattackleft.png");


    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");
    var jumpLeftAnimationSpriteSheet = AM.getAsset("./img/gunwomanjumpleft.png");


    this.game = game;
    this.ctx = game.ctx;
    this.name = "gunwoman";
    this.progressBar = progressBar;
    this.hasFallen = false;
    this.id = 2;

    //this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 0.5);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 5, 0.05, 22, true, 0.5);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 4, 0.015, 23, false, 0.5);
    this.animationAttackRightUp = new Animation(this, attackRightUpAnimationSpriteSheet, 384, 192, 4, .015, 22, false, 0.5);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 5, 0.1, 22, true, 0.5);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 384, 192, 4, 0.015, 19, false, 0.5);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 0.5);
    this.animationJumpLeft = new Animation(this, jumpLeftAnimationSpriteSheet, 192, 192, 4, 0.04, 11, false, 0.5);
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
    var otherTop  = other.y;
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
        // jump(this);
    }

    //check if player collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.game.entities[i];

        if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {

            if (this != entity && this.collide(entity)) {
                //console.log('colliding');

                this.collidedWith = entity;

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
            var entity = this.game.entities[i];

            if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

                if (entity.name === "platform" || entity.name === "skeleton" || entity.name === "box") {
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

    if (gameEngine.keyMap["1"] && this.animationAttackRight.currentFrame() === 8 ||
        gameEngine.keyMap["1"] && this.animationAttackRightUp.currentFrame() === 9 ||
        gameEngine.keyMap["1"] && this.animationAttackLeft.currentFrame() === 8) {

        var newBullet = new Bullet(gameEngine);
        gameEngine.addEntity(newBullet);


    } else if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyD"] && this.animationAttackRight.currentFrame() === 8) {

        var newBullet = new Bullet(gameEngine);
        gameEngine.addEntity(newBullet);

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

        } else if (gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) { //only walk if not jumping

            this.animationState = "walkRight";

        } else if (!gameEngine.keyMap["KeyD"] && !this.jumping && !this.attacking) {

            this.animationState = "idleRight";

        }

    } else { //direction is left
        if (gameEngine.keyMap["1"] && gameEngine.keyMap["KeyA"] && !this.attacking) {
            console.log("here");
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


Gunwoman.prototype.draw = function() {
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "jumpRight") {

        this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

        if (this.game.clickX > this.canvasX) {

            this.animationAttackRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY);
        
        } else {

            this.direction = "left";
            this.animationState = "attackLeft";
        }

    } else if (this.animationState === "idleLeft") { // START LEFT HERE

        this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "jumpLeft") {

        this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 33, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        if (this.game.clickX < this.canvasX) {

            this.animationAttackLeft.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 81, this.canvasY);
        
        } else {

            this.direction = "right";
            this.animationState = "attackRightUp";
        }

    } else if (this.animationState === "attackRightUp") {

        if (this.game.clickX > this.canvasX) {

            this.animationAttackRightUp.drawFrame(this.game.clockTick, this.ctx, this.canvasX - 48, this.canvasY);

        } else {

            this.direction = "left";
            this.animationState = "attackLeft";
        }
    }
}

var id = 0;


function Bullet(gameEngine) {
    this.id = id;
    id++;
    this.game = gameEngine;
    this.currentCharacter = gameEngine.getCurrentCharacter();
    this.ctx = this.game.ctx;
    this.name = "bullet";

    this.x = this.currentCharacter.canvasX;
    this.y = this.currentCharacter.canvasY + 14;
    this.direction = this.currentCharacter.direction;
    this.canvasX = this.currentCharacter.canvasX;
    this.canvasY = this.currentCharacter.canvasY + 14;
    this.targetX = this.game.clickX;
    this.targetY = this.game.clickY;

    this.dx = this.targetX - this.canvasX;
    this.dy = this.targetY - this.canvasY ;
    this.distance = Math.sqrt(this.dy * this.dy + this.dx * this.dx);
    this.angle = Math.atan2(this.dy, this.dx);

    this.speed = 10;

    this.b_dy = Math.sin(this.angle) * this.speed;
    this.b_dx = Math.cos(this.angle) * this.speed;
    this.distance = 0;

    this.width = 5;
    this.height = 3;


}


Bullet.prototype.update = function() {

    this.canvasY += this.b_dy;
    this.canvasX += this.b_dx;
    this.distance++;

    if(this.distance >= 200) {
        distance = 0;
        this.game.removeEntity(this.id);
    }

};

Bullet.prototype.draw = function() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

};



//Constructor for wolf
function Wolf(game) {
    var idleRightSpriteSheet = AM.getAsset("./img/wolfidleright.png");
    var walkRightSpriteSheet = AM.getAsset("./img/wolfwalkright.png");
    var attackRightSpriteSheet = AM.getAsset("./img/wolfattackright.png");
	//var idleLeftSpriteSheet = AM.getAsset("./img/wolfidleright.png");

    // var jumpRightSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");

    this.name = "wolf";

  //  this.animationCurrent = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, .5);
    this.animationIdleRight = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, .5);
    this.animationWalkRight = new Animation(this, walkRightSpriteSheet, 192, 192, 4, 0.05, 12, true, .5);
    this.animationAttackRight = new Animation(this, attackRightSpriteSheet, 288, 192, 3, 0.04, 12, false, .5);
	this.animationIdleLeft = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, .5);

    // this.animationJumpRight = new Animation(this, jumpRightSpriteSheet, 192, 192, 4, 0.04, 12, false, 1);
	
	this.currChar = game.getCurrentCharacter();
	this.animationState = "idleRight";

    this.state = "idleRight";
    this.x = this.currChar.x;
    this.y = this.currChar.y;
	this.canvasX = this.currChar.canvasX;
	this.canvasY = this.currChar.canvasY;
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
	var gunwomanState = this.currChar.animationState;
	if(gunwomanState === "idleRight") {
		this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);
	} else if(gunwomanState === "walkRight") {
		this.animationWalkRight.drawFrame(this.game.clockTick, this.ctx, this.canvasX, this.canvasY);
	} else if(gunwomanState=== "idleLeft") {
		this.animayion
	}
}

Wolf.prototype.update = function() {
	
    Entity.prototype.update.call(this);
}