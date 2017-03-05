function GameState(ctx, gameEngine) {
    this.ctx = ctx;
    this.gameEngine = gameEngine;
    
    this.charactersAlive = 3;
    this.currentCharacter = null;
    
    this.playableCharacters = [];
    
    this.knightIsAlive = true;
    this.gunwomanIsAlive = true;
    this.mageIsAlive = true;
    
    this.wolfSummoned = false;

    this.currentForeground = null;

    this.gameIsOver = false;
    this.playAgainClicked = false;

    //for all the dead enemies
    //used to restore dead enemy positions
    this.graveYard = [];
}

GameState.prototype.draw = function() {}

GameState.prototype.update = function() {
    var gameEngine = this.gameEngine;
    var currentCharacter = this.getCurrentCharacter();

    if (this.charactersAlive === 0) {
        this.gameIsOver = true;
    }

    if (this.gameIsOver && !this.playAgainClicked) {

        if (gameEngine.clickX >= 31 * TILE_SIZE && gameEngine.clickX <= 38 * TILE_SIZE &&
            gameEngine.clickY >= 15 * TILE_SIZE - 30 && gameEngine.clickY <= 18 * TILE_SIZE) {

            this.playAgainClicked = true;

            this.reset();
        } 
    }

    if (currentCharacter) {
        
        if (currentCharacter.x >= 10839 && currentCharacter.y === 357) { //check to see if at the end of level

            window.alert("Next level");

        } else if (currentCharacter.y > 700) { //fell off map

            if (currentCharacter === this.playableCharacters[0]) { //currentCharacter is knight
                
                this.knightIsAlive = false;
                currentCharacter.progressBar.updateHealth(0);

            } else if (currentCharacter === this.playableCharacters[1]) { //currentCharacter is gunwoman

                this.gunwomanIsAlive = false;
                currentCharacter.progressBar.updateHealth(0);

            } else if (currentCharacter === this.playableCharacters[2]) { //currentCharacter is mage

                this.mageIsAlive = false;
                currentCharacter.progressBar.updateHealth(0);
            }

            gameEngine.removeEntity(currentCharacter);
            this.currentCharacter = null;
            this.charactersAlive--;

        } else if (gameEngine.keyMap["Digit1"] && this.knightIsAlive) {

                var x = currentCharacter.x;
                var y = currentCharacter.y;

                var oldX = currentCharacter.oldX;
                var oldY = currentCharacter.oldY;

                var canvasX = currentCharacter.canvasX;
                var canvasY = currentCharacter.canvasY;

                var collidedTop = currentCharacter.collidedTop;
                var collidedBottom = currentCharacter.collidedBottom;
                var collidedLeft = currentCharacter.collidedLeft;
                var collidedRight = currentCharacter.collidedRight;

                var collidedTopEntity = currentCharacter.collidedTopEntity;
                var collidedBottomEntity = currentCharacter.collidedBottomEntity;
                var collidedLeftEntity = currentCharacter.collidedLeftEntity;
                var collidedRightEntity = currentCharacter.collidedRightEntity;

                var lastGroundY = currentCharacter.lastGroundY;

                this.changeCharacter(this.playableCharacters[0]); //change to knight

                this.currentCharacter.x = x;
                this.currentCharacter.y = y;

                this.currentCharacter.oldX = oldX;
                this.currentCharacter.oldY = oldY;

                this.currentCharacter.canvasX = canvasX;
                this.currentCharacter.canvasY = canvasY;

                this.currentCharacter.collidedTop = collidedTop;
                this.currentCharacter.collidedBottom = collidedBottom;
                this.currentCharacter.collidedLeft = collidedLeft;
                this.currentCharacter.collidedRight = collidedRight;

                this.currentCharacter.collidedTopEntity = collidedTopEntity;
                this.currentCharacter.collidedBottomEntity = collidedBottomEntity;
                this.currentCharacter.collidedLeftEntity = collidedLeftEntity;
                this.currentCharacter.collidedRightEntity = collidedRightEntity;

                this.currentCharacter.lastGroundY = lastGroundY;            


        } else if (gameEngine.keyMap["Digit2"] && this.gunwomanIsAlive) {

                var x = currentCharacter.x;
                var y = currentCharacter.y;

                var oldX = currentCharacter.oldX;
                var oldY = currentCharacter.oldY;

                var canvasX = currentCharacter.canvasX;
                var canvasY = currentCharacter.canvasY;

                var collidedTop = currentCharacter.collidedTop;
                var collidedBottom = currentCharacter.collidedBottom;
                var collidedLeft = currentCharacter.collidedLeft;
                var collidedRight = currentCharacter.collidedRight;

                var collidedTopEntity = currentCharacter.collidedTopEntity;
                var collidedBottomEntity = currentCharacter.collidedBottomEntity;
                var collidedLeftEntity = currentCharacter.collidedLeftEntity;
                var collidedRightEntity = currentCharacter.collidedRightEntity;

                var lastGroundY = currentCharacter.lastGroundY;

                this.changeCharacter(this.playableCharacters[1]); //change to gunwoman

                this.currentCharacter.x = x;
                this.currentCharacter.y = y;

                this.currentCharacter.oldX = oldX;
                this.currentCharacter.oldY = oldY;

                this.currentCharacter.canvasX = canvasX;
                this.currentCharacter.canvasY = canvasY;

                this.currentCharacter.collidedTop = collidedTop;
                this.currentCharacter.collidedBottom = collidedBottom;
                this.currentCharacter.collidedLeft = collidedLeft;
                this.currentCharacter.collidedRight = collidedRight;

                this.currentCharacter.collidedTopEntity = collidedTopEntity;
                this.currentCharacter.collidedBottomEntity = collidedBottomEntity;
                this.currentCharacter.collidedLeftEntity = collidedLeftEntity;
                this.currentCharacter.collidedRightEntity = collidedRightEntity;

                this.currentCharacter.lastGroundY = lastGroundY;

        } else if (gameEngine.keyMap["Digit3"] && this.mageIsAlive) {

                var x = currentCharacter.x;
                var y = currentCharacter.y;

                var oldX = currentCharacter.oldX;
                var oldY = currentCharacter.oldY;

                var canvasX = currentCharacter.canvasX;
                var canvasY = currentCharacter.canvasY;

                var collidedTop = currentCharacter.collidedTop;
                var collidedBottom = currentCharacter.collidedBottom;
                var collidedLeft = currentCharacter.collidedLeft;
                var collidedRight = currentCharacter.collidedRight;

                var collidedTopEntity = currentCharacter.collidedTopEntity;
                var collidedBottomEntity = currentCharacter.collidedBottomEntity;
                var collidedLeftEntity = currentCharacter.collidedLeftEntity;
                var collidedRightEntity = currentCharacter.collidedRightEntity;

                var lastGroundY = currentCharacter.lastGroundY;

                this.changeCharacter(this.playableCharacters[2]); //change to mage

                this.currentCharacter.x = x;
                this.currentCharacter.y = y;

                this.currentCharacter.oldX = oldX;
                this.currentCharacter.oldY = oldY;

                this.currentCharacter.canvasX = canvasX;
                this.currentCharacter.canvasY = canvasY;

                this.currentCharacter.collidedTop = collidedTop;
                this.currentCharacter.collidedBottom = collidedBottom;
                this.currentCharacter.collidedLeft = collidedLeft;
                this.currentCharacter.collidedRight = collidedRight;

                this.currentCharacter.collidedTopEntity = collidedTopEntity;
                this.currentCharacter.collidedBottomEntity = collidedBottomEntity;
                this.currentCharacter.collidedLeftEntity = collidedLeftEntity;
                this.currentCharacter.collidedRightEntity = collidedRightEntity;

                this.currentCharacter.lastGroundY = lastGroundY;
        }
    }

    if (!currentCharacter) {
        
        if (gameEngine.keyMap["Digit1"] && this.knightIsAlive) {

            var x = 34 * TILE_SIZE;
            var y = 27 * TILE_SIZE;

            var oldX = 34 * TILE_SIZE;
            var oldY = 27 * TILE_SIZE;

            var canvasX = 34 * TILE_SIZE;
            var canvasY = 27 * TILE_SIZE;


            this.changeCharacter(this.playableCharacters[0]); //change to gunwoman

            this.currentCharacter.x = x;
            this.currentCharacter.y = y;

            this.currentCharacter.oldX = oldX;
            this.currentCharacter.oldY = oldY;

            this.currentCharacter.canvasX = canvasX;
            this.currentCharacter.canvasY = canvasY;

            this.currentForeground.canvasX = 0;

            for (var i = 0; i < gameEngine.entities.length; i++) {

                if (gameEngine.entities[i].name === "platform" || gameEngine.entities[i].name === "box" || gameEngine.entities[i].name === "tree") {
                    
                    var platform = gameEngine.entities[i];
                    platform.canvasX = platform.initialCanvasX;
                
                } else if (gameEngine.entities[i].name === "skeleton") {
                    
                    var skeleton = gameEngine.entities[i];
                    skeleton.x = skeleton.initialX;
                    skeleton.canvasX = skeleton.initialCanvasX;
                    skeleton.animationAttackRight.elapsedTime = 0;
                    skeleton.animationAttackLeft.elapsedTime = 0;
                    skeleton.attacking = false;
                
                }
            }

        } else if (gameEngine.keyMap["Digit2"] && this.gunwomanIsAlive) {

            var x = 34 * TILE_SIZE;
            var y = 27 * TILE_SIZE;

            var oldX = 34 * TILE_SIZE;
            var oldY = 27 * TILE_SIZE;

            var canvasX = 34 * TILE_SIZE;
            var canvasY = 27 * TILE_SIZE;


            this.changeCharacter(this.playableCharacters[1]); //change to gunwoman

            this.currentCharacter.x = x;
            this.currentCharacter.y = y;

            this.currentCharacter.oldX = oldX;
            this.currentCharacter.oldY = oldY;

            this.currentCharacter.canvasX = canvasX;
            this.currentCharacter.canvasY = canvasY;

            this.currentForeground.canvasX = 0;

            for (var i = 0; i < gameEngine.entities.length; i++) {

                if (gameEngine.entities[i].name === "platform" || 
                    gameEngine.entities[i].name === "box" || 
                    gameEngine.entities[i].name === "tree") {
                    
                    var platform = gameEngine.entities[i];
                    platform.canvasX = platform.initialCanvasX;
                
                } else if (gameEngine.entities[i].name === "skeleton") {
                    
                    var skeleton = gameEngine.entities[i];
                    skeleton.x = skeleton.initialX;
                    skeleton.canvasX = skeleton.initialCanvasX;
                    skeleton.animationAttackRight.elapsedTime = 0;
                    skeleton.animationAttackLeft.elapsedTime = 0;
                    skeleton.attacking = false;
                
                }
            }

        } else if (gameEngine.keyMap["Digit3"] && this.mageIsAlive) {

            var x = 34 * TILE_SIZE;
            var y = 27 * TILE_SIZE;

            var oldX = 34 * TILE_SIZE;
            var oldY = 27 * TILE_SIZE;

            var canvasX = 34 * TILE_SIZE;
            var canvasY = 27 * TILE_SIZE;


            this.changeCharacter(this.playableCharacters[2]); //change to gunwoman

            this.currentCharacter.x = x;
            this.currentCharacter.y = y;

            this.currentCharacter.oldX = oldX;
            this.currentCharacter.oldY = oldY;

            this.currentCharacter.canvasX = canvasX;
            this.currentCharacter.canvasY = canvasY;

            this.currentForeground.canvasX = 0;

            for (var i = 0; i < gameEngine.entities.length; i++) {

                if (gameEngine.entities[i].name === "platform" || 
                    gameEngine.entities[i].name === "box" || 
                    gameEngine.entities[i].name === "tree") {
                    
                    var platform = gameEngine.entities[i];
                    platform.canvasX = platform.initialCanvasX;
                
                } else if (gameEngine.entities[i].name === "skeleton") {
                    
                    var skeleton = gameEngine.entities[i];
                    skeleton.x = skeleton.initialX;
                    skeleton.canvasX = skeleton.initialCanvasX;
                    skeleton.animationAttackRight.elapsedTime = 0;
                    skeleton.animationAttackLeft.elapsedTime = 0;
                    skeleton.attacking = false;
                
                }
            }

        }
    }
};

GameState.prototype.updateHealth = function(entity) {
    var gameEngine = this.gameEngine;

    if (entity.name === "knight" || 
        entity.name === "gunwoman" || 
        entity.name === "mage" || 
        entity.name === "wolf") {
        
        entity.health = entity.health - 1;
        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);

        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);

            if (entity.name === "knight") {
                this.knightIsAlive = false;
            }

            gameEngine.removeEntity(this.currentCharacter);
            this.currentCharacter = null;
            this.charactersAlive--;

            // if (this.charactersAlive > 1) {

            //     this.charactersAlive--;

            // } else if (this.charactersAlive === 0) {
            //     window.alert('gameover');
            // }
            
        }
    
    } else if (entity.name === "skeleton") {

        for (var i = 0; i < this.gameEngine.entities.length; i++) {
            
            
            if (entity === this.gameEngine.entities[i]) {
                entity.health = entity.health - 1;
            }
            
            if (entity.health <= 0 && entity === this.gameEngine.entities[i]) {
                this.graveYard.push(entity);
                this.gameEngine.entities.splice(i, 1);
            }
        }
    }
};

GameState.prototype.addPlayableCharacter = function(character) {
    console.log('Added Character ' + character.name);
    this.playableCharacters.push(character);
}

GameState.prototype.setCurrentCharacter = function(character) {
    this.currentCharacter = character;
}

GameState.prototype.getCurrentCharacter = function() {
    return this.currentCharacter;
}

GameState.prototype.changeCharacter = function(newCharacter) {
    var oldCharacter = this.getCurrentCharacter()

    //removes the old character from the entities array
    for (var i = 0; i < this.gameEngine.entities.length; i++) { //perhaps make entities a map to find the old character faster??
        if (oldCharacter === this.gameEngine.entities[i]) {
            this.gameEngine.entities.splice(i, 1);
        }
    }

    this.gameEngine.entities.unshift(newCharacter);
    this.setCurrentCharacter(newCharacter);
}

GameState.prototype.setCurrentForeground = function(foreground) {
    this.currentForeground = foreground;
}

GameState.prototype.getCurrentForeground = function() {
    return this.currentForeground;
}

//resets the game state
GameState.prototype.reset = function() {
    var gameEngine = this.gameEngine;
    this.charactersAlive = 3;
    this.setCurrentCharacter(this.playableCharacters[0]); //reset to knight
    
    var x = 34 * TILE_SIZE;
    var y = 27 * TILE_SIZE;

    var oldX = 34 * TILE_SIZE;
    var oldY = 27 * TILE_SIZE;

    var canvasX = 34 * TILE_SIZE;
    var canvasY = 27 * TILE_SIZE;

    this.currentCharacter.x = x;
    this.currentCharacter.y = y;

    this.currentCharacter.oldX = oldX;
    this.currentCharacter.oldY = oldY;

    this.currentCharacter.canvasX = canvasX;
    this.currentCharacter.canvasY = canvasY;

    this.currentForeground.canvasX = 0;

    this.gameIsOver = false;
    this.playAgainClicked = false;
    
    this.playableCharacters[0].health = 50;
    this.playableCharacters[1].health = 50;
    this.playableCharacters[1].progressBar.updateHealth(50);
    this.playableCharacters[2].health = 50;
    this.playableCharacters[2].progressBar.updateHealth(50);
    
    this.knightIsAlive = true;
    this.gunwomanIsAlive = true;
    this.mageIsAlive = true;
    
    gameEngine.addEntity(this.playableCharacters[0]); //add knight

    //add dead enemies back into game
    for (var i = 0; i < this.graveYard.length; i++) {
        var enemy = this.graveYard.pop();
        gameEngine.addEntity(enemy);
    }

     for (var i = 0; i < gameEngine.entities.length; i++) {

        if (gameEngine.entities[i].name === "platform" || 
            gameEngine.entities[i].name === "tree") {
            
            var platform = gameEngine.entities[i];
            platform.canvasX = platform.initialCanvasX;
        
        } else if (gameEngine.entities[i].name === "skeleton") {
            
            var skeleton = gameEngine.entities[i];
            skeleton.health = 2;
            skeleton.x = skeleton.initialX;
            skeleton.canvasX = skeleton.initialCanvasX;
            skeleton.animationAttackRight.elapsedTime = 0;
            skeleton.animationAttackLeft.elapsedTime = 0;
            skeleton.attacking = false;

        
        } else if (gameEngine.entities[i].name === "box") {

            gameEngine.removeEntity(gameEngine.entities[i]);
            i--;
        }
    }
}
