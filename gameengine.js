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
    this.gameState = null;
    this.currentBackground = null;
    this.currentForeground = null;
    this.currentMidground = null;
    this.currentCharacter = null;
    this.entities = [];
    this.ctx = null;
    this.keyMap = {};
    this.assetManager = null;
    this.clickX = 0;
    this.clickY = 0;
    this.mouseHoverX = 0;
    this.mouseHoverY = 0;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.startMenu = true;
}

GameEngine.prototype.init = function(ctx, assetManager, gameState) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.gameState = gameState;
    this.assetManager = assetManager;
    this.timer = new Timer();
    this.startInput();
    console.log('Game Engine Initialized');
}


GameEngine.prototype.start = function() {
    console.log("Starting Game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function() {
    console.log('Starting Input');

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
    
    this.ctx.canvas.addEventListener("mousedown", function(e) {
        var currentCharacter = that.gameState.getCurrentCharacter();

        that.click = getXandY(e);
        that.keyMap[e.which] = true;

        // get x and y coordinates
        var rect = that.ctx.canvas.getBoundingClientRect();
        that.clickX = e.clientX - rect.left;
        that.clickY = e.clientY - rect.top;

        //console.log(that.clickX + " " + that.clickY);
        var event = e;
        if (event.which === 3) {
            console.log('Right Mouse button pressed.');
            var mouseX = e.clientX;
            var mouseY = e.clientY;

            // var currentCharacter = game.getCurrentCharacter();
            mouseX = (currentCharacter.x - currentCharacter.canvasX) + mouseX;

            for (var i = that.entities.length - 1; i >= 0; i--) {
                var entity = that.entities[i];

                console.log("The name is " + entity.name);   
                // var canX = that.entities[i].canvasX;
                if(entity.name === "box") {
                    var entityX = (currentCharacter.x - currentCharacter.canvasX) + entity.canvasX;
                    var entityY = entity.canvasY;
                    if(mouseX >= entityX && mouseX <= entityX + 32 
                        && mouseY >= entityY && mouseY <= entityY + 32){
                        that.entities.splice(i, 1);
                        console.log("this is the box");
                    }
                }
            }
            // console.log("New X is = " + newX + " The new Y is = " + newY);

        }

    }, false);

    this.ctx.canvas.addEventListener("mouseup", function(e) {

    }, false);
    
    this.ctx.canvas.addEventListener("mousemove", function(e) {
        that.mouseHoverX = e.clientX;
        that.mouseHoverY = e.clientY;
    })

   


    this.ctx.canvas.addEventListener("click", function (e) {
        var charac = that.gameState.getCurrentCharacter();
       
        if(charac != null) {
            var theX = (charac.x - charac.canvasX) + e.clientX;
            //console.log("the x = " + theX/16);
            //console.log("the y = " + e.clientY/16);
        }

    }, false);

    this.ctx.canvas.addEventListener("keydown", function(e) {

        that.keyMap[e.code] = true;

    }, false);

    this.ctx.canvas.addEventListener("keyup", function(e) {

        that.keyMap[e.code] = false;

    }, false);

    this.ctx.canvas.addEventListener("mousemove", function(e) {
       
        that.mouse = getXandY(e);
    
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function(e) {
        
        that.wheel = e;
        
    }, false);


    this.ctx.canvas.addEventListener("keypress", function(e) {
        
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function(e) {
        
        that.click = getXandY(e);
        e.preventDefault();

    }, false);

    console.log('Input started');
}

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

GameEngine.prototype.removeEntity = function(entity) {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < this.entities.length; i++) {
  
        if (this.entities[i] === entity) {
            this.entities.splice(i, 1);
            break;
        }
    }
};

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 2000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

GameEngine.prototype.update = function() {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];

        entity.update();
    }

    this.gameState.update();
}

GameEngine.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();

    for (var i = this.entities.length - 1; i >= 0; i--) {
        var entity = this.entities[i];

        entity.draw(this.ctx);
    }

    this.ctx.restore();
}


GameEngine.prototype.getGameEngine = function() {
    return this;
}

GameEngine.prototype.setCurrentBackground = function(background) {
    this.currentBackground = background;
}

GameEngine.prototype.getCurrentBackground = function() {
    return this.setCurrentBackground;
}

GameEngine.prototype.setCurrentForeground = function(foreground) {
    this.currentForeground = foreground;
}

GameEngine.prototype.getCurrentForeground = function() {
    return this.currentForeground;
}

GameEngine.prototype.setCurrentMidground = function(midground) {
    this.currentMidground = midground;
}

//sets current character playing
GameEngine.prototype.setCurrentCharacter = function(character) {
    this.currentCharacter = character;
}

GameEngine.prototype.setCurrentPortrait = function(ctx, image) {
    ctx.drawImage(image, 0, 0);
}

//get the current character playing
GameEngine.prototype.getCurrentCharacter = function() {

    return this.currentCharacter;
}

//entities are drawn on the map
GameEngine.prototype.addEntity = function(entity) {
    
    if (entity.name === "knight" ||
        entity.name === "gunwoman" ||
        entity.name === "mage") {

        this.entities.unshift(entity); //add to begging of list
    
    } else if (entity.name === "box" || 
        entity.name === "bullet" || 
        entity.name === "arrow" || 
        entity.name === "wolf" || 
        entity.name === "skeletonArcher" ||
        entity.name === "skeleton" ||
        entity.name === "coin") {

        this.entities.splice(1, 0, entity); //add entity after hero index, ie index 1

    } else {

        this.entities.push(entity); //add to end of list
    }


}

GameEngine.prototype.addPlayableCharacter = function(character) {
    console.log('Added Character ' + character.name);
    this.playableCharacters.push(character);
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
