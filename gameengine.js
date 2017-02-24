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
    this.currentCharacter = null;
    this.wolf = null;
    this.entities = [];
    this.playableCharacters = [];
    this.playableCharacterIndex = 0;
    this.ctx = null;
    this.keyMap = {};
    this.assetManager = null;
    this.d = false;
    this.a = false;
    this.f = false;
    this.clickX = 0;
    this.clickY = 0;

    this.right = true;

    this.space = false;
    this.drawWolf = false;
    this.wolfAttack = false;
    this.wolfIsRight = true;
    this.didLeftClick = false;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.space = false;
}

GameEngine.prototype.init = function(ctx, assetManager) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
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


        that.click = getXandY(e);
        that.keyMap[e.which] = true;

        // get x and y coordinates
        var rect = that.ctx.canvas.getBoundingClientRect();
        that.clickX = e.clientX - rect.left;
        that.clickY = e.clientY - rect.top;
        // console.log("x: " + x + " y: " + y);


        //  if (e.which === 1 && !that.didLeftClick) { //Left Mouse button pressed
        //      that.didLeftClick = true;

        //  } else if (e.which === 2) { //Middle Mouse button pressed  

        //      console.log('Middle Mouse Button Pressed');

        // } else if (e.which === 3 && currentCharacter.name === "gunwoman" && rightClickCount === 0) { //Right Mouse button pressed, add wolf
        //      console.log('Right Mouse Button Pressed');
        //      rightClickCount++;
        //      that.drawWolf = true;
        //      that.addEntity(that.wolf);
        //  } else if (e.which == 3 && currentCharacter.name === "gunwoman" && rightClickCount >= 1) {

        //      rightClickCount++;

        //      if (rightClickCount === 2) {
        //          that.wolfAttack = true;
        //          that.wolfIsRight = true;
        //      } else if (rightClickCount >= 2) {
        //          rightClickCount = 1;
        //      }

        //  } else {
        //      console.log('Mouse Button Undetected');
        //  }

        //console.log("rightClickCount: " + rightClickCount);

    }, false);

    this.ctx.canvas.addEventListener("mouseup", function(e) {

    }, false);

     this.ctx.canvas.addEventListener("click", function (e) {
        var box = new Box(that, e.clientX, e.clientY);
        that.addEntity(box);

    }, false);

    this.ctx.canvas.addEventListener("keydown", function(e) {

        that.keyMap[e.code] = true;

        for (var i = 0; i < that.playableCharacters.length; i++) {

            if (e.code === "Digit1" && that.playableCharacters[i].name === "knight") {
                var newX = that.currentCharacter.x;
                var newY = that.currentCharacter.y;
                var newCanvasX = that.currentCharacter.canvasX;
                var newCanvasY = that.currentCharacter.canvasY;

                that.changeCharacter(that.playableCharacters[i]); 

                that.currentCharacter.x = newX;
                that.currentCharacter.y = newY;
                that.currentCharacter.canvasX = newCanvasX;
                that.currentCharacter.canvasY = newCanvasY;

            } else if (e.code === "Digit2" && that.playableCharacters[i].name === "gunwoman") {
                var newX = that.currentCharacter.x;
                var newY = that.currentCharacter.y;
                var newCanvasX = that.currentCharacter.canvasX;
                var newCanvasY = that.currentCharacter.canvasY;


                that.changeCharacter(that.playableCharacters[i]);

                that.currentCharacter.x = newX;
                that.currentCharacter.y = newY;
                that.currentCharacter.canvasX = newCanvasX;
                that.currentCharacter.canvasY = newCanvasY;

            } else if (e.code === "Digit3" && that.playableCharacters[i].name === "mage") {

                var newX = that.currentCharacter.x;
                var newY = that.currentCharacter.y;
                var newCanvasX = that.currentCharacter.canvasX;
                var newCanvasY = that.currentCharacter.canvasY;
                
                that.changeCharacter(that.playableCharacters[i]);

                that.currentCharacter.x = newX;
                that.currentCharacter.y = newY;
                that.currentCharacter.canvasX = newCanvasX;
                that.currentCharacter.canvasY = newCanvasY;

            }

        }

        // if (e.code === "KeyD" && !that.keyMap[e.code] && !that.didLeftClick) {

        //     that.d = true;
        //     that.right = true;

        // } else if (e.code === "KeyA" && !that.a  && !that.didLeftClick) {

        //     that.a = true;
        //     that.right = false;

        // if (e.code === "KeyF" && !that.didLeftClick) {

        //     that.changeCharacter();

        // }

    }, false);

    this.ctx.canvas.addEventListener("keyup", function(e) {

        that.keyMap[e.code] = false;
        // if (e.code === "KeyD" && !that.didLeftClick) {
        //     that.d = false;

        // } else if (e.code === "KeyA" && !that.didLeftClick) {
        //     that.a = false;

        // }

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
        console.log(e);
        console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
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
        // if (!this.entities[i].removeFromWorld) {
        entity.update();

        if (entitiesCount != this.entities.length) {
            console.log('bullet added');
            i++;
        }

        // }
    }
}

GameEngine.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = this.entities.length - 1; i >= 0; i--) {
        var entity = this.entities[i];
        // if (!this.entities[i].removeFromWorld) {
        entity.draw(this.ctx);

        // }
    }
    this.ctx.restore();
}


GameEngine.prototype.getGameEngine = function() {
    return this;
}

GameEngine.prototype.setCurrentBackground = function(background) {
    this.currentBackground = background;
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

GameEngine.prototype.addWolf = function(theWolf) {
    this.wolf = theWolf;
};


//entities are drawn on the map
GameEngine.prototype.addEntity = function(entity) {
    // console.log('Added Entity ' + entity);
    if (entity.name === "bullet" || entity.name === "box") {
        this.entities.unshift(entity);
        // this.entities.splice(0,0,entity);

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
