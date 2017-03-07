var HEALTH = 3



var SKELETON_ID = 0;

// START OF ENEMIES
function Skeleton(gameEngine, gameState, x, y) {
    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonidleleft.png");
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/skeletonidleright.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/skeleton-walk-left.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/skeleton-walk-right.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/skeleton-attack-left.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/skeleton-attack-right.png");

    var knightImpactRightSpriteSheet = AM.getAsset("./img/knight-impact-right.png");

    this.id = SKELETON_ID;

    SKELETON_ID++;

    this.name = "skeleton";
    this.gameEngine = gameEngine;
    this.gameState = gameState;
    this.ctx = gameEngine.ctx;

    this.health = HEALTH;

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

    this.initialX = x * TILE_SIZE;
    this.initialY = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE - 5;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;

    this.initialCanvasX = x * TILE_SIZE;
    this.initialCanvasXY = y * TILE_SIZE;

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
    this.random = 0;
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
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;
    var currentCharacter = gameState.getCurrentCharacter();
    var background = gameEngine.getCurrentBackground();
    var foreground = gameState.getCurrentForeground();

    if (this.attacking) {
        for (var i = 0; i < gameEngine.entities.length; i++) {
            var entity = this.gameEngine.entities[i];

            if (entity.name === "knight" || 
                entity.name === "gunwoman" || 
                entity.name === "mage" || 
                entity.name === "wolf") {
                
                if (this.direction === "right" && this.collideAttackRight(entity)) {

                    var frame = this.animationAttackRight.currentFrame();
                    

                    if (this.animationAttackRight.currentFrame() === 10 && !this.doDamage) {

                        this.doDamage = true;

                        console.log('here');

                        this.gameState.updateHealth(entity);

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

                            //bug where touching wall but distanceFromCollision is not 0 ?? - 1 fixes it thooo 
                            var distanceFromCollision = Math.abs((entity.x + entity.width - 1) - knockBackCollidedWith.x);
                            //console.log(distanceFromCollision);

                            entity.x += distanceFromCollision;
                            entity.oldX = entity.x;
                            foreground.canvasX -= distanceFromCollision;
                            this.canvasX -= distanceFromCollision;

                        } else {

                            //going to have to flip this when doing attacked animation
                            entity.x = entity.x + 15;
                            entity.oldX = entity.x;

                            foreground.canvasX -= 15;
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
                                    gameEngine.entities[j].name === "skeleton" ||
                                    gameEngine.entities[j].name === "box") {

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

                    if (skeletonAttackFrame === 10 && !this.doDamage) {

                        this.doDamage = true;

                        this.gameState.updateHealth(entity);

                        var knockBackCollidedWith = null;

                        for (var j = 0; j < gameEngine.entities.length; j++) {
                            var potentialCollision = gameEngine.entities[j];

                            if (potentialCollision !== entity && //player can't knock back into iteself
                                potentialCollision !== entity.collidedBottomEntity && //cant knock back onto the ground platform
                                potentialCollision !== this) { //player can't knock back into this skeleton 

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
                            //console.log(distanceFromCollision);


                            entity.x -= distanceFromCollision;
                            entity.oldX = entity.x;
                            foreground.x += distanceFromCollision;
                            this.canvasX += distanceFromCollision;

                        } else { //nothing to knock back collide with so knock back full distance

                            entity.x = entity.x - 15;
                            entity.oldX = entity.x;
                            foreground.canvasX += 15;
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
                                    gameEngine.entities[j].name === "skeleton" ||
                                    gameEngine.entities[j].name === "box") {

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
        var entity = this.gameEngine.entities[i];

        if (this !== entity && 
            (entity.name === "platform" || 
            entity.name === "knight" ||
            entity.name === "gunwoman" ||
            entity.name === "mage" || 
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher")) {

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
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" ||
                entity.name === "knight" ||
                entity.name === "gunwoman" ||
                entity.name === "mage" ||
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

                if (this !== entity && 
                    (entity.name === "platform" || 
                    entity.name === "knight" ||
                    entity.name === "gunwoman" ||
                    entity.name === "mage" ||
                    entity.name === "skeleton" ||
                    entity.name === "box" ||
                    entity.name === "skeletonArcher")) {

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

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }

    var distanceFromHero = Math.min()

    if (currentCharacter) {
        var distanceFromHero = Math.abs(currentCharacter.x - this.x);
    }

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

            var colidEntity = this.collidedBottomEntity;


            this.direction = "left";
            this.animationState = "walkLeft";
            if (colidEntity !== null && this.x / 16 > colidEntity.x / 16) {
                //console.log("come here");
                this.oldX = this.x;
                this.x -= 2;
                this.canvasX -= 2;
            }


        } else if (currentCharacter.x > this.x && !this.collidedRight && !this.attacking) {


            var colidEntity = this.collidedBottomEntity;

            if (colidEntity !== null) {
                var colidX = colidEntity.x / 16 + colidEntity.width / 16;
            }


            this.direction = "right";
            this.animationState = "walkRight";

            if (this.x / 16 + 2 < colidX) {

                this.oldX = this.x;
                this.x += 2;
                this.canvasX += 2;
            }

        }

    } else {
        //console.log("come here");
        // var random = Math.floor((Math.random() * 40) + 1);

        if (this.direction === "right") {
            var colidEntity = this.collidedBottomEntity;

            this.direction = "right";
            this.animationState = "walkRight";
            if (colidEntity !== null) {
                var colidX = colidEntity.x + colidEntity.width;
            }

            if (colidEntity !== null && this.x + 32 < colidX) {

                this.oldX = this.x;
                this.x += 2;
                this.canvasX += 2;
            } else {
                this.direction = "left";
                this.oldX = this.x;
                // this.x += 3;
                // this.canvasX += 3;
            }

        } else {
            var colidEntity = this.collidedBottomEntity;

            this.direction = "left";
            this.animationState = "walkLeft";
            if (colidEntity !== null && this.x > colidEntity.x) {
                //console.log("come here");
                this.oldX = this.x;
                this.x -= 2;
                this.canvasX -= 2;
            } else {
                this.direction = "right";
            }
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

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY - 4);

    } else if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY - 4);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY - 4);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 12, this.canvasY - 4);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 115, this.canvasY - 52);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY - 52);
    }

    if (this.attacked) {

        this.animationKnightImpactRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY + 15);
    }
};

var ARCHER_ID = 0;

function SkeletonArcher(gameEngine, gameState, x, y) { 
    var currentCharacter = gameState.getCurrentCharacter();

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonarcheridleleft.png");
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/skeleton-archer-idle-right.png"); 
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/skeletonarcherattackright.png"); 
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/skeletonarcherattackleft.png");

    this.id = ARCHER_ID;
    ARCHER_ID++;

    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    
    this.name = "skeletonArcher";

    this.health = HEALTH;

    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 0.5);
    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 0.5);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 288, 192, 4, 0.05, 16, false, 0.5);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 288, 192, 4, 0.05, 16, false, 0.5);

    this.animationState = "idleLeft";

    this.direction = "left";
    
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;

    this.initialX = x * TILE_SIZE;
    this.initialY = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.width = 2 * TILE_SIZE;
    this.height = 4 * TILE_SIZE;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;

    this.initialCanvasX = x * TILE_SIZE;
    this.initialCanvasY = x * TILE_SIZE;

    this.attacking = false;
    this.arrowFired = false;

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

SkeletonArcher.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;    
}

SkeletonArcher.prototype.collideLeft = function(other) {
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

SkeletonArcher.prototype.collideRight = function(other) {
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

SkeletonArcher.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        //console.log('skeleton colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

SkeletonArcher.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        //console.log('skeleton collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
}

SkeletonArcher.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 30;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

SkeletonArcher.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 30;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;    
}

SkeletonArcher.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

    var currentCharacter = gameState.getCurrentCharacter();

    if (this.attacking) {

        if (this.direction === "left") {

            var frame = this.animationAttackLeft.currentFrame();

            if (frame === 10 && !this.arrowFired && currentCharacter) {
                
                var arrow = new Arrow(gameEngine, gameState, this);
                gameEngine.addEntity(arrow);
                this.arrowFired = true;
                
            }

        } else if (this.direction === "right") {

            var frame = this.animationAttackRight.currentFrame();

            if (frame === 10 && !this.arrowFired && currentCharacter) {

                var arrow = new Arrow(gameEngine, gameState, this);
                gameEngine.addEntity(arrow);
                this.arrowFired = true;
            }
        }
    }

    //check if enemy collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.gameEngine.entities[i];

        if (this !== entity && 
            (entity.name === "platform" || 
            entity.name === "knight" ||
            entity.name === "gunwoman" ||
            entity.name === "mage" || 
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher")) {

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
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" || 
                entity.name === "knight" || 
                entity.name === "gunwoman" ||
                entity.name === "mage" ||
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

                if (this !== entity && 
                    (entity.name === "platform" || 
                    entity.name === "knight" ||
                    entity.name === "gunwoman" ||
                    entity.name === "mage" ||
                    entity.name === "skeleton" ||
                    entity.name === "box" ||
                    entity.name === "skeletonArcher")) {

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

    if (currentCharacter) {
        
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }    
    }

    var distanceFromHero = Math.min();

    if (currentCharacter) {
        distanceFromHero = Math.abs(currentCharacter.x - this.x);
    }

    //Archer AI
    if (distanceFromHero <= 800 && currentCharacter) {

        if (this.x > currentCharacter.x) {

            this.attacking = true;
            this.animationState = "attackLeft";
            this.direction = "left";
          
        } else if (this.x < currentCharacter.x) {

            this.attacking = true;
            this.animationState = "attackRight"
            this.direction = "right";
        }
    
    }

    if (!currentCharacter) {

        this.attacking = false;

        if (this.direction === "left") {

            this.animationState = "idleLeft";

        } else {

            this.animationState = "idleRight";
        }
    }

    // if (this.id === 0) {

    //     if (gameEngine.keyMap["KeyV"]) {

    //         if (!this.attacking && this.direction === "left") {

    //             this.animationState = "attackLeft";

    //                 this.attacking = true;
                                       
                     
    //         }

    //     } else if (gameEngine.keyMap["KeyZ"] && !this.collidedLeft && !this.attacking) {

    //         this.direction = "left";
    //         this.animationState = "walkLeft";
    //         this.oldX = this.x;
    //         this.x -= 2;
    //         this.canvasX -= 2;
            
    //     } else if (gameEngine.keyMap["KeyC"] && !this.collidedRight && !this.attacking) {

    //         this.direction = "right";
    //         this.animationState = "walkRight";
    //         this.oldX = this.x;
    //         this.x += 2;
    //         this.canvasX += 2;

    //     }
    // }

};

SkeletonArcher.prototype.draw = function() {
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    var currentCharacter = this.gameState.getCurrentCharacter();

    if (this.animationState === "idleLeft") {
        
        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 20, this.canvasY);

    } else if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 10, this.canvasY);

    } else if (this.animationState === "attackLeft") {
        
        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 66, this.canvasY);

    } else if (this.animationState === "attackRight") {
        
        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX - 15, this.canvasY);
    }
};

function Arrow(gameEngine, gameState, archer) {
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;

    var currentCharacter = gameState.getCurrentCharacter();

    this.name = "arrow";

    this.arrowImage = AM.getAsset("./img/arrow.png");

    this.x = archer.x;
    this.y = archer.y;

    this.startX = archer.x;
    this.startY = archer.y;

    this.endX = currentCharacter.x + 20;
    this.endY = currentCharacter.y + 20;

    this.canvasX = archer.canvasX;
    this.canvasY = archer.canvasY;

    this.startCanvasX = archer.canvasX;
    this.startCanvasY = archer.canvasY;

    this.endCanvasX = currentCharacter.canvasX + 20; //offset to hit center of character
    this.endCanvasY = currentCharacter.canvasY + 20;

    this.dx = this.endCanvasX - this.startCanvasX;
    this.dy = this.endCanvasY - this.startCanvasY;

    this.distance = Math.sqrt(this.dy * this.dy + this.dx * this.dx);
    this.angle = Math.atan2(this.dy, this.dx);

    this.speed = 5;

    this.b_dx = Math.cos(this.angle) * this.speed;
    this.b_dy = Math.sin(this.angle) * this.speed;

    this.width = 5;
    this.height = 3;

    this.collidedWith = null;
}

Arrow.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
}

Arrow.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;

    var currentCharacter = gameState.getCurrentCharacter();

    this.x += this.b_dx;
    this.y += this.b_dy;

    this.canvasX += this.b_dx;
    this.canvasY += this.b_dy;

    //check for collisions
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = gameEngine.entities[i];

        if (this !== entity && this.collide(entity) && !this.collidedWith) {

            if (entity.name === "knight" || entity.name === "gunwoman" || entity.name === "mage") {

                this.collidedWith = entity;
                gameState.updateHealth(entity);
                //console.log('archer hit player');

            } else if (entity.name === "platform" || entity.name === "box") {

                this.collidedWith = entity;
                //console.log('hit object');
            }
        }
    }    

    //offset bullet when walking
    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }    
    }
}

Arrow.prototype.draw = function() {
    //this.ctx.fillRect(this.x, this.y, 5, 3);
    
    if (!this.collidedWith) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.canvasX, this.canvasY, 20, 3);
        //this.ctx.drawImage(this.arrowImage, this.canvasX - 30, this.canvasY, 100, 16);
    }
};




// BIG BOSS


function Robot(gameEngine, gameState, x, y) {
    var idleRightAnimationSpriteSheet =  AM.getAsset("./img/robotidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/robotwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/robotattackright.png");

    var idleLeftAnimationSpriteSheet = AM.getAsset("./img/robotidleleft.png");
    var walkLeftAnimationSpriteSheet = AM.getAsset("./img/robotwalkleft.png");
    var attackLeftAnimationSpriteSheet = AM.getAsset("./img/robotattackleft.png");

    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    
    this.name = "robot";
   
    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.05, 8, true, 1);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.035, 12, true, 1);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 288, 192, 4, 0.015, 16, true, 1);
    this.animationIdleLeft = new Animation(this, idleLeftAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 1);
    this.animationWalkLeft = new Animation(this, walkLeftAnimationSpriteSheet, 192, 192, 2, 0.07, 12, true, 1);
    this.animationAttackLeft = new Animation(this, attackLeftAnimationSpriteSheet, 288, 192, 4, 0.05, 16, true, 1);

    this.animationState = "idleLeft";

    this.direction = "left";
    // var currentCharacter = game.getCurrentCharacter();

    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;

    this.initialX = x * TILE_SIZE;
    this.initialY = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.width = 10 * TILE_SIZE;
    this.height = 10.5 * TILE_SIZE;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;

    this.initialCanvasX = x * TILE_SIZE;
    this.initialCanvasY = y * TILE_SIZE;

    this.attacking = false;

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

Robot.prototype.collide = function(other) {
    return this.x <= other.x + other.width &&
        this.x + this.width >= other.x &&
        this.y <= other.y + other.height &&
        this.height + this.y >= other.y;
}

Robot.prototype.collideLeft = function(other) {
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

Robot.prototype.collideRight = function(other) {
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

Robot.prototype.collideTop = function(other) {
    if (this.oldY > other.y + other.height &&
        this.y <= other.y + other.height) {

        //console.log('skeleton colided top');
    }

    return this.oldY > other.y + other.height &&
        this.y <= other.y + other.height;
}

Robot.prototype.collideBottom = function(other) {
    if (this.oldY + this.height < other.y && 
        this.y + this.height >= other.y) {
        
        //console.log('skeleton collided bottom');
    }

    return this.oldY + this.height < other.y && 
        this.y + this.height >= other.y;
}

Robot.prototype.knockBackLeftCollide = function(other) {
    var attackBoxLeft = this.x - 30;
    var attackBoxRight = this.x;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxRight >= other.x &&
        attackBoxLeft <= other.x + other.width &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;
}

Robot.prototype.knockBackRightCollide = function(other) {
    var attackBoxLeft = this.x + this.width;
    var attackBoxRight = attackBoxLeft + 30;
    var attackBoxTop = this.y;
    var attackBoxBottom = this.y + this.height;

    return attackBoxLeft <= other.x + other.width &&
        attackBoxRight >= other.x &&
        attackBoxTop <= other.y + other.height &&
        attackBoxBottom >= other.y;    
}

Robot.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();

     //check if enemy collided with any platforms
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var entity = this.gameEngine.entities[i];

        if (this !== entity && 
            (entity.name === "platform" || 
            entity.name === "knight" ||
            entity.name === "gunwoman" ||
            entity.name === "mage" || 
            entity.name === "skeleton" ||
            entity.name === "box" ||
            entity.name === "skeletonArcher")) {

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
            var entity = this.gameEngine.entities[i];

            if (entity.name === "platform" || 
                entity.name === "knight" || 
                entity.name === "gunwoman" ||
                entity.name === "mage" ||
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

                if (this !== entity && 
                    (entity.name === "platform" || 
                    entity.name === "knight" ||
                    entity.name === "gunwoman" ||
                    entity.name === "mage" ||
                    entity.name === "skeleton" ||
                    entity.name === "box" ||
                    entity.name === "skeletonArcher")) {

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

    if (currentCharacter) {
        
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }    
    }

    var distanceFromHero = Math.min();

    if (currentCharacter) {

        distanceFromHero = Math.abs(currentCharacter.x - this.x);
    }

    if (distanceFromHero <= 600) {


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

            var colidEntity = this.collidedBottomEntity;


            this.direction = "left";
            this.animationState = "walkLeft";
            if (colidEntity !== null && this.x / 16 > colidEntity.x / 16) {
                //console.log("come here");
                this.oldX = this.x;
                this.x -= 2;
                this.canvasX -= 2;
            }


        } else if (currentCharacter.x > this.x && !this.collidedRight && !this.attacking) {


            var colidEntity = this.collidedBottomEntity;

            if (colidEntity !== null) {
                var colidX = colidEntity.x / 16 + colidEntity.width / 16;
            }


            this.direction = "right";
            this.animationState = "walkRight";

            if (this.x / 16 + 2 < colidX) {

                this.oldX = this.x;
                this.x += 2;
                this.canvasX += 2;
            }

        }

    }

};

Robot.prototype.draw = function() {
    this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);

    if (this.animationState === "idleLeft") {

        this.animationIdleLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY + 15);

    } else if (this.animationState === "idleRight") {

        this.animationIdleRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkLeft") {

        this.animationWalkLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "walkRight") {

        this.animationWalkRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackLeft") {

        this.animationAttackLeft.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);

    } else if (this.animationState === "attackRight") {

        this.animationAttackRight.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX, this.canvasY);
    }

};
