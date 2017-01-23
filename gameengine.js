window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    this.playableCharacters = [];
    this.playableCharacterIndex = 0;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.assetManager = null;
    this.d = false;
    this.a = false;
    this.space = false;
    this.didLeftClick = false;
    this.currentCharacter = null;
}

GameEngine.prototype.init = function(ctx, assetManager) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.assetManager = assetManager;
    this.timer = new Timer();
    this.chars = []; //events aren't being stored in here
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.getGameEngine = function() {
    return this;
}

//sets current character playing
GameEngine.prototype.setCurrentCharacter = function(character) {
    this.currentCharacter = character;
}

//get the current character playing
GameEngine.prototype.getCurrentCharacter = function() {
    return this.currentCharacter;
}

GameEngine.prototype.changeCharacter = function() {
    var oldCharacter = this.getCurrentCharacter();

    //removes the old character from the entities array
    for (var i = 0; i < this.entities.length; i++) {    //perhaps make entities a map to find the old character faster??
        if (oldCharacter === this.entities[i]) {
            this.entities.splice(i, 1);
            //console.log(this.entities);
        }
    }
    
    if (this.playableCharacterIndex >= this.playableCharacters.length - 1) { //if on last character, change to first index
        this.playableCharacterIndex = 0;
    } else {
        this.playableCharacterIndex++;
    }

    var newCharacter = this.playableCharacters[this.playableCharacterIndex];
    this.entities.push(newCharacter);
    this.setCurrentCharacter(newCharacter);
    //console.log(this);
}

GameEngine.prototype.start = function() {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function() {
    console.log('Starting input');

    var getXandY = function(e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

                                    //attack
    this.ctx.canvas.addEventListener("mousedown", function(e) {
        var currentCharacter = that.getCurrentCharacter(); 
        
        that.click = getXandY(e);

        //console.log(e.which);

        if (e.which === 1 && !that.didLeftClick) { //Left Mouse button pressed
            that.didLeftClick = true;
            currentCharacter.setAttackRightAnimation();

        } else if (e.which === 2) { //Middle Mouse button pressed     
            console.log('Middle Mouse button pressed');
        } else if (e.which === 3) { //Right Mouse button pressed
            console.log('Right mouse button pressed');
        } else {
            console.log('Mouse button undetected');
        }
        
        //console.log(e);
        //console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);

    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        var currentCharacter = that.getCurrentCharacter();

        if (e.code === "KeyD" && !that.d  && !that.didLeftClick) {
            that.d = true;

            currentCharacter.setWalkRightAnimation();
            
        } else if (e.code === "KeyF" && !that.didLeftClick) {

                console.log("F pressed");
                that.changeCharacter();

        }

    }, false);

    this.ctx.canvas.addEventListener("keyup", function(e) {
        
        var currentCharacter = that.getCurrentCharacter();

        if (e.code === "KeyD" && !that.didLeftClick) {
            
            that.d = false;
            currentCharacter.setIdleRightAnimation();

        }
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function(e) {
        //console.log(e);
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function(e) {
        console.log(e);
        that.wheel = e;
        console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);


    this.ctx.canvas.addEventListener("keypress", function(e) {
        //console.log(e);
        //console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function(e) {
        that.click = getXandY(e);
        console.log(e);
        console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);


    console.log('Input started');
}

//entities are drawn on the map
GameEngine.prototype.addEntity = function(entity) {
    console.log('added entity');
    this.entities.push(entity);
}


GameEngine.prototype.addPlayableCharacter = function(character) {
    console.log('added character');
    this.playableCharacters.push(character);
}

GameEngine.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function() {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function() {}

Entity.prototype.draw = function(ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function(image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
