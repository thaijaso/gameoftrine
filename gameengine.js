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
    this.currentBackground = null;
    this.currentForeground = null;
    this.currentMidground = null;
    this.currentCharacter = null;
    //this.wolf = new Wolf(this);
    this.wolfAttack = false;
    this.entities = [];
    this.playableCharacters = [];
    this.playableCharacterIndex = 0;
    this.ctx = null;
    this.keyMap = {};
    this.assetManager = null;
    this.clickX = 0;
    this.clickY = 0;
    this.drawWolf = false;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
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

    // event listeners are  here

    //attack
    var rightClickCount = 0;
    this.ctx.canvas.addEventListener("mousedown", function(e) {
        var currentCharacter = that.getCurrentCharacter();
		 console.log(e);


        that.click = getXandY(e);
        that.keyMap[e.which] = true;

        // get x and y coordinates
        var rect = that.ctx.canvas.getBoundingClientRect();
        that.clickX = e.clientX - rect.left;
        that.clickY = e.clientY - rect.top;

		if (e.which === 3 && currentCharacter.name === "gunwoman" && rightClickCount === 0) { //Right Mouse button pressed, add wolf
             console.log('Right Mouse Button Pressed');
             rightClickCount++;
             that.drawWolf = true;
			 var wolf = new Wolf(that);
			 that.addEntity(wolf);
        } else if (e.which == 3 && currentCharacter.name === "gunwoman" && rightClickCount >= 1) {

            rightClickCount++;

           if (rightClickCount === 2) {
                that.wolfAttack = true;
                that.wolfIsRight = true;
             } else if (rightClickCount >= 2) {
                 rightClickCount = 1;
             }
		}

    }, false);

    this.ctx.canvas.addEventListener("mouseup", function(e) {

    }, false);

     this.ctx.canvas.addEventListener("click", function (e) {
		 
        var charac = that.currentCharacter;
        if(charac.name === "mage"){
            var box = new Box(that, e.clientX, e.clientY);
            that.addEntity(box);
        }

        var theX = (charac.x - charac.canvasX) + e.clientX;
        //console.log("the x = " + theX/16);
        //console.log("the y = " + e.clientY/16);


    }, false);

    this.ctx.canvas.addEventListener("keydown", function(e) {

        that.keyMap[e.code] = true;

        for (var i = 0; i < that.playableCharacters.length; i++) {
            var newX = that.currentCharacter.x;
            var newY = that.currentCharacter.y;

            var oldX = that.currentCharacter.oldX;
            var oldY = that.currentCharacter.oldY;

            var newCanvasX = that.currentCharacter.canvasX;
            var newCanvasY = that.currentCharacter.canvasY;

            var collidedTop = that.currentCharacter.collidedTop;
            var collidedBottom = that.currentCharacter.collidedBottom;
            var collidedLeft = that.currentCharacter.collidedLeft;
            var collidedRight = that.currentCharacter.collidedRight;

            var collidedTopEntity = that.currentCharacter.collidedTopEntity;
            var collidedBottomEntity = that.currentCharacter.collidedBottomEntity;
            var collidedLeftEntity = that.currentCharacter.collidedLeftEntity;
            var collidedRightEntity = that.currentCharacter.collidedRightEntity;

            var lastGroundY = that.currentCharacter.lastGroundY;


            if (e.code === "Digit1" && that.playableCharacters[i].name === "knight") {


                that.changeCharacter(that.playableCharacters[i]); 



            } else if (e.code === "Digit2" && that.playableCharacters[i].name === "gunwoman") {


                that.changeCharacter(that.playableCharacters[i]); 



            } else if (e.code === "Digit3" && that.playableCharacters[i].name === "mage") {



                that.changeCharacter(that.playableCharacters[i]); 



            }

            that.currentCharacter.x = newX;
            that.currentCharacter.y = newY;

            that.currentCharacter.oldX = oldX;
            that.currentCharacter.oldY = oldY;

            that.currentCharacter.canvasX = newCanvasX;
            that.currentCharacter.canvasY = newCanvasY;

            that.currentCharacter.collidedTop = collidedTop;
            that.currentCharacter.collidedBottom = collidedBottom;
            that.currentCharacter.collidedLeft = collidedLeft;
            that.currentCharacter.collidedRight = collidedRight;

            that.currentCharacter.collidedTopEntity = collidedTopEntity;
            that.currentCharacter.collidedBottomEntity = collidedBottomEntity;
            that.currentCharacter.collidedLeftEntity = collidedLeftEntity;
            that.currentCharacter.collidedRightEntity = collidedRightEntity;

            that.currentCharacter.lastGroundY = lastGroundY;

        }

    }, false);

    this.ctx.canvas.addEventListener("keyup", function(e) {

        that.keyMap[e.code] = false;

    }, false);

    this.ctx.canvas.addEventListener("mousemove", function(e) {
        //console.log(e);
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function(e) {
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);


    this.ctx.canvas.addEventListener("keypress", function(e) {
        //console.log(e);
        //console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function(e) {
        that.click = getXandY(e);
        //console.log(e);
        //console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    console.log('Input started');
}

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

GameEngine.prototype.removeEntity = function(info) {
    var entitiesCount = this.entities.length;
    var temp = null;

    for (var i = 0; i < this.entities.length; i++) {
        var e = this.entities[i];
        if (e.id === info) {
            temp = this.entities.splice(i, 1);
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

        if (entitiesCount != this.entities.length) {
            //console.log('bullet added');
            i++;
        }
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
    //get the wolf
GameEngine.prototype.getWolf = function() {
    return this.wolf;
};


GameEngine.prototype.changeCharacter = function(newCharacter) {
    var oldCharacter = this.getCurrentCharacter()

    //removes the old character from the entities array
    for (var i = 0; i < this.entities.length; i++) { //perhaps make entities a map to find the old character faster??
        if (oldCharacter === this.entities[i]) {
            this.entities.splice(i, 1);
            //console.log(this.entities);
        }
    }

    // if (this.playableCharacterIndex >= this.playableCharacters.length - 1) { //if on last character, change to first index
    //     this.playableCharacterIndex = 0;
    // } else {
    //     this.playableCharacterIndex++;
    // }

    // var newCharacter = this.playableCharacters[this.playableCharacterIndex];
    this.entities.unshift(newCharacter);
    this.setCurrentCharacter(newCharacter);
    //console.log(this);
}

GameEngine.prototype.replaceCharacter = function() {
    var oldCharacter = this.getCurrentCharacter();

    if (oldCharacter.health === 0) {
        for (var i = 0; i < this.playableCharacters.length; i++) {
            if (this.playableCharacters[i] === oldCharacter) {
                this.playableCharacters.splice(i, 1);
            }
        }

        var newCharacter = this.playableCharacters[0];


        // if (oldCharacter.hasFallen) {
        //     var x = oldCharacter.x;
        //     if (x >= 0 || x <= 110) {
        //         newCharacter.canvasX = 109;
        //         newCharacter.canvasY = 31;
        //         newCharacter.x = 100;
        //         newCharacter.y = 31;
        //     }

        // } else {
            newCharacter.canvasX = oldCharacter.canvasX;
            newCharacter.canvasY = oldCharacter.canvasY;

            newCharacter.x = oldCharacter.x;
            newCharacter.y = oldCharacter.y;

        // }



        this.entities.unshift(newCharacter);
        this.setCurrentCharacter(newCharacter);
        this.removeEntity(oldCharacter.id);
    }
};

GameEngine.prototype.addWolf = function(theWolf) {
    this.wolf = theWolf;
};


//entities are drawn on the map
GameEngine.prototype.addEntity = function(entity) {

    if (entity.name === "box" || entity.name === "bullet" || entity.name === "arrow" || entity.name === "wolf") {

        this.entities.splice(1, 0, entity); //add entity after knight index, ie index 1

    } else {
        this.entities.push(entity);
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
										