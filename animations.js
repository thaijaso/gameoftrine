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
    this.elapsedTime = 0; //used for jumping as well as various other animations
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
    var currentCharacter = gameEngine.getCurrentCharacter();

    if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {
        this.x -= 0.8;
    } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {
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

