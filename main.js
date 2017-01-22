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

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
	//console.log('drawFrame');
	//console.log(this);

    this.elapsedTime += tick; 
    if (this.isDone()) {
        if (this.loop) {	//restart animation
        	this.elapsedTime = 0;
        } else {	//go back to idle state
        	console.log(this);
            var curCharacter = this.entity.game.curCharacter;
            if (curCharacter === "knight") {
                this.entity.game.didLeftClick = false;
                x = 0;
                this.elapsedTime = 0;
                this.entity.state = "idleRight";
                this.spriteSheet = this.assetManager.getAsset("./img/knightidleright.png");
                this.frameWidth = 192;
                this.sheetWidth = 4;
                this.frames = 14;
                this.totalTime = this.frameDuration * this.frames;
                this.loop = true;
            } else if (curCharacter === "gunwoman") {
                this.entity.game.didLeftClick = false;
                x = 0;
                this.elapsedTime = 0;
                this.entity.state = "idleRight";
                this.spriteSheet = this.assetManager.getAsset("./img/gunwomanidleright.png");
                this.frameWidth = 192;
                this.sheetWidth = 5;
                this.frames = 22;
                this.totalTime = this.frameDuration * this.frames;
                this.loop = true;
            }
        	
        }

    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Knight(game, spritesheet) {
	this.animation = new Animation(this, spritesheet, 192, 192, 4, 0.10, 14, true, 1);
	this.state = "idleRight";
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Knight.prototype.draw = function() {
	//console.log(this);
	if (this.state === "attackRight") {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - 95, this.y);
	} else {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}
}

Knight.prototype.update = function() {
	//this.x += this.game.clockTick * this.speed;
    //if (this.x > 800) this.x = -230;
    //this.x = 0;
    Entity.prototype.update.call(this);
}

function Gunwoman(game, spritesheet) {
    this.animation = new Animation(this, spritesheet, 192, 192, 5, 0.10, 22, true, 1);
    this.state = "idleRight";
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Gunwoman.prototype.draw = function() {
    if (this.state === "attackRight") {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - 95, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

Gunwoman.prototype.update = function() {
    Entity.prototype.update.call(this);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


var gameWorld = document.getElementById("gameWorld");
gameWorld.width = window.innerWidth;
gameWorld.height = window.innerHeight;

AM.queueDownload("./img/background.jpg");
//knight
AM.queueDownload("./img/knightidleright.png");
AM.queueDownload("./img/knightattackright.png");
AM.queueDownload("./img/knightwalkright.png");
//gunwoman
AM.queueDownload("./img/gunwomanidleright.png");
AM.queueDownload("./img/gunwomanwalkright.png");
AM.queueDownload("./img/gunwomanattackright.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    canvas.focus();
    
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx, AM);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    
    //gameEngine.addEntity(new Knight(gameEngine, AM.getAsset("./img/knightidleright.png")));
    gameEngine.addEntity(new Gunwoman(gameEngine, AM.getAsset("./img/gunwomanidleright.png")));
    
    //gameEngine.curCharacter = "knight";
    gameEngine.curCharacter = "gunwoman";

    console.log("All Done!");
});