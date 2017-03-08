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
    var gameEngine = this.entity.gameEngine.getGameEngine();
    var gameState = this.entity.gameState;
    var currentCharacter = gameState.getCurrentCharacter();


    this.elapsedTime += tick;

    if (currentCharacter) {

        if (currentCharacter.jumping &&
            (this.entity.name === "knight" ||
                this.entity.name === "gunwoman" ||
                this.entity.name === "mage")) {


            currentCharacter.jumpElapsedTime += tick;
        }
    }

    if (this.isDone()) {

        if (this.loop) {

            this.elapsedTime = 0; //restart animation

        } else {


            if (this.entity.name === "knight" ||
                this.entity.name === "gunwoman" ||
                this.entity.name === "mage") {

                if (currentCharacter) {
                    //go back to idle state from attack or jump animation
                    if (currentCharacter.direction === "right") {
                        currentCharacter.animationState = "idleRight";
                    } else {
                        currentCharacter.animationState = "idleLeft";
                    }

                    gameEngine.keyMap["1"] = false;
                    currentCharacter.jumping = false;
                    currentCharacter.attacking = false;
                    // currentCharacter.destroyBox = false;
                }

            }

            if (this.entity.name === "skeleton" || this.entity.name === "skeletonArcher") {


                if (this.entity.direction === "right") {
                    this.entity.animationState = "idleRight";
                } else {
                    this.entity.animationState = "idleLeft";
                }

                this.entity.attacking = false;
                this.entity.attacked = false;
                this.entity.arrowFired = false;
                this.entity.doDamage = false;
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

function EffectAnimation(entity, spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
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

EffectAnimation.prototype.drawFrame = function(tick, ctx, canvasX, canvasY) {
    var gameEngine = this.entity.gameEngine.getGameEngine();
    var gameState = this.entity.gameState;
    var currentCharacter = gameState.getCurrentCharacter();

    this.elapsedTime += tick;

    if (this.isDone()) {

        if (this.loop) {

            this.elapsedTime = 0;

        } else {

            this.entity.impact = false;
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

EffectAnimation.prototype.currentFrame = function() {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

EffectAnimation.prototype.isDone = function() {
    return (this.elapsedTime >= this.totalTime);
}

// END ENEMIES

// no inheritance

var BACKGROUND_ID = 0;

function Background(gameEngine, gameState, spritesheet) {
    this.id = BACKGROUND_ID
    BACKGROUND_ID++;

    this.gameEngine = gameEngine;
    this.gameState = gameState;
    this.ctx = gameEngine.ctx;
    this.spritesheet = spritesheet;
    this.x = 0;
    this.y = 0;
}

Background.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};


Background.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;
    var currentCharacter = this.gameState.getCurrentCharacter();

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.x--;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            if (this.x !== 0) {
                this.x++;
            }

        }
    }

};

function Foreground(gameEngine, gameState, spritesheet) {
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    this.canvasX = 0;
    this.canvasY = 0;
    this.spritesheet = spritesheet;
}

Foreground.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet, this.canvasX, this.canvasY);
};

Foreground.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
}

function Midground(gameEngine, gameState, spritesheet) {
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    this.spritesheet = spritesheet;
    this.x = 0;
    this.y = 0;
}

Midground.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);

}

Midground.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {
            this.x -= 0.8;
        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {
            this.x += 0.8;
        }
    }
}

var PLATFORM_ID = 0;

function Platform(gameEngine, gameState, x, y, width, height) {
    this.id = PLATFORM_ID;
    PLATFORM_ID++;

    this.name = "platform";
    this.gameEngine = gameEngine;
    this.gameState = gameState;
    this.ctx = gameEngine.ctx;

    this.x = x * TILE_SIZE; //game world x and y coordinates
    this.y = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;

    this.initialCanvasX = x * TILE_SIZE;
    this.initialCanvasY = y * TILE_SIZE;

    this.width = width * TILE_SIZE;
    this.height = height * TILE_SIZE;
}

Platform.prototype.draw = function() {
    this.ctx.fillStyle = "#ff0000";
    // this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

Platform.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;
    var currentCharacter = gameState.getCurrentCharacter();

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
}

function Spike(gameEngine, gameState, x, y, width, height) {
    this.name = "spike";
    this.gameEngine = gameEngine;
    this.gameState = gameState;
    this.ctx = gameEngine.ctx;

    this.x = x * TILE_SIZE; //game world x and y coordinates
    this.y = y * TILE_SIZE;

    this.oldX = x * TILE_SIZE;
    this.oldY = y * TILE_SIZE;

    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;
    this.width = width * TILE_SIZE;
    this.height = height * TILE_SIZE;
}

Spike.prototype.draw = function() {
    this.ctx.globalAlpha = 0.2;

    this.ctx.fillStyle = "#0000ff ";
    //console.log(this.canvasX);
    this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    this.ctx.globalAlpha = 1.0;

    //console.log(this.canvasX);
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

Spike.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.currentCharacter;
    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
}


function Tree(gameEngine, gameState) {
    this.gameEngine = gameEngine;
    this.gameState = gameState;

    var treeSpriteSheet = AM.getAsset("./img/treeleaffall.png");

    this.name = "tree";

    this.animation = new Animation(this, treeSpriteSheet, 190, 183, 5, 0.05, 22, true, 1);

    this.ctx = this.gameEngine.ctx;

    //this.x = 29 * TILE_SIZE;
    //this.y = 25 * TILE_SIZE;

    this.width = 8 * TILE_SIZE;
    this.height = 7 * TILE_SIZE;

    this.canvasX = 12 * TILE_SIZE;
    this.canvasY = 33 * TILE_SIZE;

    this.initialCanvasX = 12 * TILE_SIZE;
    this.initialCanvasY = 33 * TILE_SIZE;
}

Tree.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();

    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;

        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
}

Tree.prototype.draw = function() {
    this.animation.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX + 1.5, this.canvasY - 2.0);
};



function Tooltip(gameEngine, gameState) {
    this.gameEngine = gameEngine;
    this.gameState = gameState;

    this.ctx = gameEngine.ctx;

    this.currentMessage = "Press A and D for movement";

    this.messages = ["Press A and D for movement",
        "Left click to attack",
        "Press spacebar to jump",
        "Press 3 to switch to Mage Mariott",
        "Left click to summon boxes"
    ];

    this.showedMovementTip = false;
    this.showedJumpTip = false;
    this.showedBoxTip = false;

    this.canvasX = 31 * TILE_SIZE;
    this.canvasY = 15 * TILE_SIZE;
    this.width = 7 * TILE_SIZE;
    this.height = 3 * TILE_SIZE;
}

Tooltip.prototype.update = function() {
    var gameEngine = this.gameEngine;

    if ((gameEngine.keyMap["KeyA"] || gameEngine.keyMap["KeyD"]) && !this.showedMovementTip) {

        this.showedMovementTip = true;
        this.currentMessage = this.messages[1];

    } else if (gameEngine.keyMap["1"] && !this.showedAttackTip) {

        this.showedAttackTip = true;
        this.currentMessage = this.messages[2];

    } else if (gameEngine.keyMap["Space"] && !this.showedJumpTip) {

        this.showedJumpTip = true;
        this.currentMessage = this.messages[3];

    } else if (gameEngine.keyMap["Digit3"] && !this.showedBoxTip) {

        this.showedBoxTip = true;
        this.currentMessage = this.messages[4];
    }
}

Tooltip.prototype.draw = function() {
    var gameEngine = this.gameEngine;
    var gameState = this.gameState;
    var currentCharacter = gameState.getCurrentCharacter();

    this.ctx.fillStyle = "black";
    this.ctx.font = "bold 16px Arial";

    if (currentCharacter) {

        if (currentCharacter.x < 655) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "bold 16px Arial";
            this.ctx.fillText(this.currentMessage, this.canvasX, this.canvasY);
        }
    }

    if (gameState.gameIsOver) {
        this.ctx.fillText("Play Again?", this.canvasX, this.canvasY);
        //this.ctx.fillRect(this.canvasX, this.canvasY - 30, this.width, this.height);
    }
}


function Potion(game, gameState, x, y) {
    this.gameEngine = game;
    this.img = AM.getAsset("./img/healthpotion.png");
    this.ctx = game.ctx;
    this.gameState = gameState;
    this.canvasX = x * TILE_SIZE;
    this.canvasY = y * TILE_SIZE;
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;
    this.initialCanvasX = x * TILE_SIZE;
    this.width = 30;
    this.height = 30;

    this.name = "potion";


}

Potion.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();
    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;
        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
};

Potion.prototype.draw = function() {
    // this.ctx.globalAlpha = 0.2;
    this.ctx.drawImage(this.img, this.canvasX, this.canvasY, this.width, this.height);

    // this.ctx.fillStyle = "#00ff00";
    // this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    // this.ctx.globalAlpha = 1.0;
};


function Coin(gameEngine, gameState, entity) {

    this.gameEngine = gameEngine;
    var img = AM.getAsset("./img/coin.png");
    this.animation = new Animation(this, img, 18, 20, 6, 0.05, 6, true, 1);
    this.ctx = gameEngine.ctx;
    this.gameState = gameState;
    this.canvasX = entity.canvasX;
    this.canvasY = entity.canvasY;
    this.x = entity.x;
    this.y = entity.y;
    this.initialCanvasX = this.x;
    this.width = 20;
    this.height = 20;

    this.name = "coin";


}

Coin.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.gameState.getCurrentCharacter();
    if (currentCharacter) {
        if (gameEngine.keyMap["KeyD"] && !currentCharacter.collidedRight) {

            this.canvasX -= 3;
        } else if (gameEngine.keyMap["KeyA"] && !currentCharacter.collidedLeft) {

            this.canvasX += 3;
        }
    }
    // body...
};

Coin.prototype.draw = function() {
    // this.ctx.fillStyle = "blue";
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //     this.ctx.fillStyle = "black";

    // this.ctx.fillRect(this.canvasX, this.canvasY, this.width, this.height);


    this.animation.drawFrame(this.gameEngine.clockTick, this.ctx, this.canvasX + 19.5, this.canvasY + 25);

    // body...
};
