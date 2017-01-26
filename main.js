var AM = new AssetManager();

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
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function(tick, ctx, x, y) {
    var gameEngine = this.entity.game.getGameEngine();
    var currentCharacter = gameEngine.getCurrentCharacter();

    //console.log(this);


    this.elapsedTime += tick;

    if (this.isDone()) {

        if (this.loop) {

            this.elapsedTime = 0; //restart animation

        } else { //go back to idle state

            gameEngine.didLeftClick = false;
            x = 0;
            //console.log('here');
            currentCharacter.setIdleRightAnimation();
            //caution
            currentCharacter.jumping = false;
            gameEngine.space = false;
        }
    }

    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    //console.log(this);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight, // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function() {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function() {
    //console.log(this.elapsedTime + " " + this.totalTime);
    return (this.elapsedTime >= this.totalTime);
}

function Knight(game) {
    var idleRightAnimationSpriteSheet = AM.getAsset("./img/knightidleright.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/knightwalkright.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/knightattackright.png");
    var jumpRightAnimationSpriteSheet = AM.getAsset("./img/knightjumpright.png");

    this.name = "knight";

    this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 1);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 4, 0.1, 14, true, 1);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 4, 0.07, 12, true, 1);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.03, 14, false, 1);
    this.animationJumpRight = new Animation(this, jumpRightAnimationSpriteSheet, 192, 192, 4, 0.04, 12, false, 1);

    this.state = "idleRight";
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;

    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, this.game, 0, 400);
}

Knight.prototype.draw = function() {
    //console.log(this);
    if (this.state === "attackRight") {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x - 95, this.y);
    } else {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

Knight.prototype.update = function() {
    //this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    //this.x = 0;
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        //console.log(this.animationCurrent.elapsedTime + " " + this.animationCurrent.totalTime);
        // if (this.animationCurrent.isDone()) {
        //     console.log('here');
        //     this.animationCurrent.elapsedTime = 0;
        //     this.jumping = false;
        // }

        var jumpDistance = this.animationCurrent.elapsedTime / this.animationCurrent.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

//set current animation properties to idle right animation values
Knight.prototype.setIdleRightAnimation = function() {
    console.log('setIdleRight');

    var idleRightSpriteSheet = this.animationIdleRight.spriteSheet;
    var frameWidth = this.animationIdleRight.frameWidth;
    var frameDuration = this.animationIdleRight.frameDuration;
    var frameHeight = this.animationIdleRight.frameHeight;
    var sheetWidth = this.animationIdleRight.sheetWidth;
    var frames = this.animationIdleRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "idleRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = idleRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

Knight.prototype.setWalkRightAnimation = function() {
    console.log("set walk right");

    var walkRightSpriteSheet = this.animationWalkRight.spriteSheet;
    var frameWidth = this.animationWalkRight.frameWidth;
    var frameDuration = this.animationWalkRight.frameDuration;
    var frameHeight = this.animationWalkRight.frameHeight;
    var sheetWidth = this.animationWalkRight.sheetWidth;
    var frames = this.animationWalkRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "walkRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = walkRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

//set current animation properties to attack right animation values
Knight.prototype.setAttackRightAnimation = function() {
    //console.log('setAttackRight');

    //get attack right animation property values
    var attackRightSpriteSheet = this.animationAttackRight.spriteSheet;
    var frameWidth = this.animationAttackRight.frameWidth;
    var frameDuration = this.animationAttackRight.frameDuration;
    var frameHeight = this.animationAttackRight.frameHeight;
    var sheetWidth = this.animationAttackRight.sheetWidth;
    var frames = this.animationAttackRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = false;
    var scale = 1;

    this.state = "attackRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = attackRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;

    //console.log(this);
}

Knight.prototype.setJumpRightAnimation = function() {
    console.log('jump right');

    var jumpRightSpriteSheet = this.animationJumpRight.spriteSheet;
    var frameWidth = this.animationJumpRight.frameWidth;
    var frameDuration = this.animationJumpRight.frameDuration;
    var frameHeight = this.animationJumpRight.frameHeight;
    var sheetWidth = this.animationJumpRight.sheetWidth;
    var frames = this.animationJumpRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = false;
    var scale = 1;

    this.state = "jumpRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = jumpRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}



//Constructor for mage
function Mage(game) {

    var idleRightAnimationSpriteSheet = AM.getAsset("./img/mageIdleRight.png");
    var walkRightAnimationSpriteSheet = AM.getAsset("./img/mageWalkRight.png");
    var attackRightAnimationSpriteSheet = AM.getAsset("./img/mageAttackRight.png");

    this.name = "mage";

    this.animationCurrent = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 1);

    this.animationIdleRight = new Animation(this, idleRightAnimationSpriteSheet, 192, 192, 3, 0.1, 8, true, 1);
    this.animationWalkRight = new Animation(this, walkRightAnimationSpriteSheet, 192, 192, 3, 0.07, 8, true, 1);
    this.animationAttackRight = new Animation(this, attackRightAnimationSpriteSheet, 384, 192, 3, 0.03, 17, false, 1);

    this.state = "idleRight";
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Mage.prototype.draw = function() {
    if (this.state === "attackRight") {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x - 95, this.y);
    } else {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

Mage.prototype.update = function() {
    Entity.prototype.update.call(this);
}

//set current animation properties to idle right animation values
Mage.prototype.setIdleRightAnimation = function() {
    console.log("set idle right");

    var idleRightSpriteSheet = this.animationIdleRight.spriteSheet;
    var frameWidth = this.animationIdleRight.frameWidth;
    var frameDuration = this.animationIdleRight.frameDuration;
    var frameHeight = this.animationIdleRight.frameHeight;
    var sheetWidth = this.animationIdleRight.sheetWidth;
    var frames = this.animationIdleRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "idleRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = idleRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

Mage.prototype.setWalkRightAnimation = function() {
    console.log("set walk right");

    var walkRightSpriteSheet = this.animationWalkRight.spriteSheet;
    var frameWidth = this.animationWalkRight.frameWidth;
    var frameDuration = this.animationWalkRight.frameDuration;
    var frameHeight = this.animationWalkRight.frameHeight;
    var sheetWidth = this.animationWalkRight.sheetWidth;
    var frames = this.animationWalkRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "walkRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = walkRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

//set current animation properties to attack right animation values
Mage.prototype.setAttackRightAnimation = function() {
        //console.log('setAttackRight');

        //get attack right animation property values
        var attackRightSpriteSheet = this.animationAttackRight.spriteSheet;
        var frameWidth = this.animationAttackRight.frameWidth;
        var frameDuration = this.animationAttackRight.frameDuration;
        var frameHeight = this.animationAttackRight.frameHeight;
        var sheetWidth = this.animationAttackRight.sheetWidth;
        var frames = this.animationAttackRight.frames;
        var totalTime = frameDuration * frames;
        var elapsedTime = 0;
        var loop = false;
        var scale = 1;

        this.state = "attackRight";

        //set current animation property values
        this.animationCurrent.spriteSheet = attackRightSpriteSheet;
        this.animationCurrent.frameWidth = frameWidth;
        this.animationCurrent.frameDuration = frameDuration;
        this.animationCurrent.frameHeight = frameHeight;
        this.animationCurrent.sheetWidth = sheetWidth;
        this.animationCurrent.frames = frames;
        this.animationCurrent.totalTime = totalTime;
        this.animationCurrent.elapsedTime = elapsedTime;
        this.animationCurrent.loop = loop;
        this.animationCurrent.scale = scale;

        //console.log(this);
    }
    /*
        live versian 
        branch:gh-page

    */

//Constructor for gunwoman
function Gunwoman(game) {
    var idleRightSpriteSheet = AM.getAsset("./img/gunwomanidleright.png");
    var walkRightSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightSpriteSheet = AM.getAsset("./img/gunwomanattackright.png");
    var jumpRightSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");

    // var wolf = new Wolf();
    // var wolfidleright = AM.getAsset("./img/wolfidleright.png");

    this.name = "gunwoman";

    this.animationCurrent = new Animation(this, idleRightSpriteSheet, 192, 192, 5, 0.1, 22, true, 1);
    this.animationIdleRight = new Animation(this, idleRightSpriteSheet, 192, 192, 5, 0.1, 22, true, 1);
    this.animationWalkRight = new Animation(this, walkRightSpriteSheet, 192, 192, 4, 0.05, 14, true, 1);
    this.animationAttackRight = new Animation(this, attackRightSpriteSheet, 384, 192, 4, 0.04, 23, false, 1);
    this.animationJumpRight = new Animation(this, jumpRightSpriteSheet, 192, 192, 4, 0.04, 12, false, 1);
    // this.animationWolfidleRight = new Animation(this, wolfidleright, 192, 192, 4, 0.1, 12, false, .5);

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

Gunwoman.prototype.update = function() {
    // 
    // console.log(this);

    // console.log("drawWolf " + this.wolf);

    // if(this.game.drawWolf) {
    //     this.game.addEntity(this.wolf);
    // }  
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        //console.log(this.animationCurrent.elapsedTime + " " + this.animationCurrent.totalTime);
        // if (this.animationCurrent.isDone()) {
        //     console.log('here');
        //     this.animationCurrent.elapsedTime = 0;
        //     this.jumping = false;
        // }

        var jumpDistance = this.animationCurrent.elapsedTime / this.animationCurrent.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}


Gunwoman.prototype.draw = function() {
    var that = this;
    if (this.state === "attackRight") {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x - 95, this.y);
    } else {
        this.animationCurrent.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}




//set current animation properties to idle right animation values
Gunwoman.prototype.setIdleRightAnimation = function() {
    console.log("set idle right");

    var idleRightSpriteSheet = this.animationIdleRight.spriteSheet;
    var frameWidth = this.animationIdleRight.frameWidth;
    var frameDuration = this.animationIdleRight.frameDuration;
    var frameHeight = this.animationIdleRight.frameHeight;
    var sheetWidth = this.animationIdleRight.sheetWidth;
    var frames = this.animationIdleRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "idleRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = idleRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

Gunwoman.prototype.setWalkRightAnimation = function() {
    console.log("set walk right");

    var walkRightSpriteSheet = this.animationWalkRight.spriteSheet;
    var frameWidth = this.animationWalkRight.frameWidth;
    var frameDuration = this.animationWalkRight.frameDuration;
    var frameHeight = this.animationWalkRight.frameHeight;
    var sheetWidth = this.animationWalkRight.sheetWidth;
    var frames = this.animationWalkRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "walkRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = walkRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

Gunwoman.prototype.setAttackRightAnimation = function() {
    console.log('setAttackRight');

    //get attack right animation property values
    var attackRightSpriteSheet = this.animationAttackRight.spriteSheet;
    var frameWidth = this.animationAttackRight.frameWidth;
    var frameDuration = this.animationAttackRight.frameDuration;
    var frameHeight = this.animationAttackRight.frameHeight;
    var sheetWidth = this.animationAttackRight.sheetWidth;
    var frames = this.animationAttackRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = false;
    var scale = 1;

    this.state = "attackRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = attackRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;

    //console.log(this);
}

Gunwoman.prototype.setJumpRightAnimation = function() {
    console.log('jump right');

    var jumpRightSpriteSheet = this.animationJumpRight.spriteSheet;
    var frameWidth = this.animationJumpRight.frameWidth;
    var frameDuration = this.animationJumpRight.frameDuration;
    var frameHeight = this.animationJumpRight.frameHeight;
    var sheetWidth = this.animationJumpRight.sheetWidth;
    var frames = this.animationJumpRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = false;
    var scale = 1;

    this.state = "jumpRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = jumpRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

//Constructor for wolf
function Wolf(game) {
    var idleRightSpriteSheet = AM.getAsset("./img/wolfidleright.png");
    // var walkRightSpriteSheet = AM.getAsset("./img/gunwomanwalkright.png");
    var attackRightSpriteSheet = AM.getAsset("./img/wolfattackright.png");
    // var jumpRightSpriteSheet = AM.getAsset("./img/gunwomanjumpright.png");

    this.name = "wolf";

    this.animationCurrent = new Animation(this, idleRightSpriteSheet, 192, 192, 4, 0.1, 12, true, 1);
    this.animationIdleRight = new Animation(this, idleRightSpriteSheet, 192, 192, 5, 0.1, 22, true, 1);
    // this.animationWalkRight = new Animation(this, walkRightSpriteSheet, 192, 192, 4, 0.05, 14, true, 1);
    this.animationAttackRight = new Animation(this, attackRightSpriteSheet, 288, 192, 3, 0.04, 15, false, 1);
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

//set current animation properties to idle right animation values
Wolf.prototype.setIdleRightAnimation = function() {
    console.log("set idle right");

    var idleRightSpriteSheet = this.animationIdleRight.spriteSheet;
    var frameWidth = this.animationIdleRight.frameWidth;
    var frameDuration = this.animationIdleRight.frameDuration;
    var frameHeight = this.animationIdleRight.frameHeight;
    var sheetWidth = this.animationIdleRight.sheetWidth;
    var frames = this.animationIdleRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = true;
    var scale = 1;

    this.state = "idleRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = idleRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
}

Wolf.prototype.setAttackRightAnimation = function(first_argument) {
    console.log('setAttackRight');

    //get attack right animation property values
    var attackRightSpriteSheet = this.animationAttackRight.spriteSheet;
    var frameWidth = this.animationAttackRight.frameWidth;
    var frameDuration = this.animationAttackRight.frameDuration;
    var frameHeight = this.animationAttackRight.frameHeight;
    var sheetWidth = this.animationAttackRight.sheetWidth;
    var frames = this.animationAttackRight.frames;
    var totalTime = frameDuration * frames;
    var elapsedTime = 0;
    var loop = false;
    var scale = 1;

    this.state = "attackRight";

    //set current animation property values
    this.animationCurrent.spriteSheet = attackRightSpriteSheet;
    this.animationCurrent.frameWidth = frameWidth;
    this.animationCurrent.frameDuration = frameDuration;
    this.animationCurrent.frameHeight = frameHeight;
    this.animationCurrent.sheetWidth = sheetWidth;
    this.animationCurrent.frames = frames;
    this.animationCurrent.totalTime = totalTime;
    this.animationCurrent.elapsedTime = elapsedTime;
    this.animationCurrent.loop = loop;
    this.animationCurrent.scale = scale;
};

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};

Background.prototype.update = function() {
    this.x--;
};


var gameWorld = document.getElementById("gameWorld");
gameWorld.width = window.innerWidth;
gameWorld.height = window.innerHeight;

AM.queueDownload("./img/background.jpg");

//knight
AM.queueDownload("./img/knightidleright.png");
AM.queueDownload("./img/knightattackright.png");
AM.queueDownload("./img/knightwalkright.png");
AM.queueDownload("./img/knightjumpright.png");

//gunwoman
AM.queueDownload("./img/gunwomanidleright.png");
AM.queueDownload("./img/gunwomanwalkright.png");
AM.queueDownload("./img/gunwomanattackright.png");
AM.queueDownload("./img/gunwomanjumpright.png");

//wolf
AM.queueDownload("./img/wolfidleright.png");
AM.queueDownload("./img/wolfattackright.png");


//mage
AM.queueDownload("./img/mageWalkRight.png");
AM.queueDownload("./img/mageIdleRight.png");
AM.queueDownload("./img/mageAttackRight.png");


AM.downloadAll(function() {
    var canvas = document.getElementById("gameWorld");
    canvas.focus();

    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx, AM);
    gameEngine.start();

    var background = new Background(gameEngine, AM.getAsset("./img/background.jpg"));
    var knight = new Knight(gameEngine);
    var gunwoman = new Gunwoman(gameEngine);
    var mage = new Mage(gameEngine);
    var wolf = new Wolf(gameEngine);

    //an entity is any element drawn on the map
    gameEngine.addEntity(background);
    gameEngine.addEntity(knight);
    gameEngine.addPlayableCharacter(knight);
    gameEngine.addPlayableCharacter(gunwoman);
    gameEngine.addPlayableCharacter(mage);

    gameEngine.addWolf(wolf);

    gameEngine.setCurrentCharacter(knight);




    console.log("All Done!");
});
