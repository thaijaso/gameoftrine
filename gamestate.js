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
    this.currentBackground = null;

    this.gameIsOver = false;
    this.didLose = false;
    this.didWin = false;
    this.playAgainClicked = false;
    this.score = 0;

    //for all the dead enemies
    //used to restore dead enemy positions
    this.graveYard = [];

    this.mutePressed = false;

    this.backgroundMusic = new Howl({
        src: ['./sound/Background.mp3'],
        // music: [0, 195600, true]
         loop: true,
    });
    this.ocean = new Howl({
        src: ['./sound/alkaibeach.mp3'],
            loop: true,
            volume: 0.5,
    });

    this.isWalking = false;
    this.walk = new Howl({
        src: ['./sound/walk.mp3'],
            volume: 0.5,
    });

    this.isAttack = false;
    this.shot = new Howl({
        src: ['./sound/shot1.wav'],
            volume: 0.5,
        sprite: {
            shot: [0, 1800],
        }
    });

    this.sword = new Howl({
        src: ['./sound/steelsword.mp3'],
         volume: 0.5,
        sprite: {
            sword: [0, 1000],
        }
       
    });

    this.addBox = new Howl({
        src: ['./sound/addBox.ogg'],
        volume: 0.5,
    });

    this.battle = new Howl({
        src: ['./sound/BattleMusic.mp3'],
        loop: true,
        volume: 1,
    });

    this.battleOn = false;
}

GameState.prototype.draw = function() {}

GameState.prototype.updateScore = function() {
    this.score++;
};

GameState.prototype.update = function() {
    var gameEngine = this.gameEngine;

    if (!gameEngine.startMenu) {

        var currentCharacter = this.getCurrentCharacter();

        if (this.charactersAlive === 0) {
            this.gameIsOver = true;
            this.didLose = true;

        }

        if (this.gameIsOver && !this.playAgainClicked) {

            if (gameEngine.clickX >= 31 * TILE_SIZE && gameEngine.clickX <= 38 * TILE_SIZE &&
                gameEngine.clickY >= 15 * TILE_SIZE - 30 && gameEngine.clickY <= 18 * TILE_SIZE) {

                this.playAgainClicked = true;

                this.reset();
            }
        }

        if (currentCharacter) {

            if (currentCharacter.y > 700) { //fell off map

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
                this.currentBackground.canvasX = 0;

                for (var i = 0; i < gameEngine.entities.length; i++) {

                    if (gameEngine.entities[i].name === "platform" ||
                        gameEngine.entities[i].name === "box" ||
                        gameEngine.entities[i].name === "tree" ||
                        gameEngine.entities[i].name === "spike" ||
                        gameEngine.entities[i].name === "potion" || 
                        gameEngine.entities[i].name === "coin") {


                        var platform = gameEngine.entities[i];
                        platform.canvasX = platform.initialCanvasX;

                    } else if (gameEngine.entities[i].name === "skeleton" ||
                        gameEngine.entities[i].name === "skeletonArcher" ||
                        gameEngine.entities[i].name === "robot") {


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
                this.currentBackground.canvasX = 0;

                for (var i = 0; i < gameEngine.entities.length; i++) {

                    if (gameEngine.entities[i].name === "platform" ||
                        gameEngine.entities[i].name === "box" ||
                        gameEngine.entities[i].name === "tree" ||
                        gameEngine.entities[i].name === "spike" ||
                        gameEngine.entities[i].name === "potion" ||
                        gameEngine.entities[i].name === "coin") {

                        var platform = gameEngine.entities[i];
                        platform.canvasX = platform.initialCanvasX;

                    } else if (gameEngine.entities[i].name === "skeleton" ||
                        gameEngine.entities[i].name === "skeletonArcher" ||
                        gameEngine.entities[i].name === "robot") {

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
                this.currentBackground.canvasX = 0;

                for (var i = 0; i < gameEngine.entities.length; i++) {

                    if (gameEngine.entities[i].name === "platform" ||
                        gameEngine.entities[i].name === "box" ||
                        gameEngine.entities[i].name === "tree" ||
                        gameEngine.entities[i].name === "spike" ||
                        gameEngine.entities[i].name === "potion" ||
                        gameEngine.entities[i].name === "coin") {

                        var platform = gameEngine.entities[i];
                        platform.canvasX = platform.initialCanvasX;

                    } else if (gameEngine.entities[i].name === "skeleton" ||
                        gameEngine.entities[i].name === "skeletonArcher" ||
                        gameEngine.entities[i].name === "robot") {

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
    }

     if (gameEngine.keyMap["KeyD"] || gameEngine.keyMap["KeyA"]) {

        if (!this.isWalking && !this.mutePressed) {
            this.isWalking = true;
            this.walk.play();
        }
    } else if (!gameEngine.keyMap["KeyD"]) {

        this.isWalking = false;
        this.walk.stop();
    }

    if (gameEngine.keyMap["1"] ) {
        var mouseX = gameEngine.clickX;
        var mouseY = gameEngine.clickY;
        if(mouseX >= (93 * 16) && mouseX <= (93 *16) + 30 
            && mouseY >= 16 && mouseY <= 16 + 30) {
            this.mutePressed = true;
        }
    }

    if (gameEngine.keyMap["1"] && currentCharacter != undefined) {
        var newX = gameEngine.clickX;
        var newY = gameEngine.clickY;
        if (!this.isAttack) {
            this.isAttack = true;
            if(!this.mutePressed){
                if(currentCharacter.name === "knight") {
                    this.sword.play('sword');
                } else if(currentCharacter.name === "gunwoman") {
                    this.shot.play('shot');
                } else if(currentCharacter.name === "mage") {
                    this.addBox.play();
                }
            }   
        }
    } else if (!gameEngine.keyMap["1"] && currentCharacter != undefined) {

        this.isAttack = false;
        this.shot.stop();
    }

    if (this.mutePressed) {
        this.sword.stop();
        this.shot.stop();
        this.addBox.stop();
        this.walk.stop();
        this.backgroundMusic.stop();
        this.ocean.stop();
        this.battle.stop();
    }

    if (currentCharacter != undefined && !this.mutePressed) {
        var curX = currentCharacter.x;
        var curY = currentCharacter.canvasY;

        if (curX > (903 * 16) && !this.battleOn) {
            this.backgroundMusic.stop();
            this.battle.play();
            this.battleOn = true;
        }
    }
    

};

GameState.prototype.updateHealth = function(entity) {
    var gameEngine = this.gameEngine;

    if (entity.name === "knight" ||
        entity.name === "gunwoman" ||
        entity.name === "mage" ||
        entity.name === "wolf") {

        entity.health = entity.health - 5;

        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);

        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);

            if (entity.name === "knight") {
                
                this.knightIsAlive = false;

            } else if (entity.name === "gunwoman") {

                this.gunwomanIsAlive = false;
            
            } else if (entity.name === "mage") {

                this.mageIsAlive = false;
            }

            gameEngine.removeEntity(this.currentCharacter);
            this.currentCharacter = null;
            this.charactersAlive--;
        }

    
    } else if (entity.name === "skeleton" || 
        entity.name === "skeletonArcher" ||
        entity.name === "robot") {

        for (var i = 0; i < this.gameEngine.entities.length; i++) {


            if (entity === this.gameEngine.entities[i]) {
                entity.health = entity.health - 1;

                if (entity.name === "robot") {
                    //console.log(entity.health);
                    entity.progressBar.updateHealth(entity.health);
                    entity.progressBar.hasBeenHit(true);
                }
            }

            if (entity.health <= 0 && entity === this.gameEngine.entities[i]) {

                this.graveYard.push(entity);
                this.gameEngine.entities.splice(i, 1);
                var coin = new Coin(this.gameEngine, this, entity);
                this.gameEngine.addEntity(coin);

                // final boss
                if (entity.name === "robot") {
                    this.gameIsOver = true;
                    this.didWin = true;
                }
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

GameState.prototype.setCurrentBackground = function(background) {
    this.currentBackground = background;
}

GameState.prototype.getCurrentBackground = function() {
    return this.currentBackground;
}

GameState.prototype.restoreHealth = function(entity) {

    this.playableCharacters[0].health = 50;
    this.playableCharacters[0].progressBar.updateHealth(this.playableCharacters[0].health);
    this.playableCharacters[1].health = 50;
    this.playableCharacters[1].progressBar.updateHealth(this.playableCharacters[1].health);
    this.playableCharacters[2].health = 50;
    this.playableCharacters[2].progressBar.updateHealth(this.playableCharacters[2].health);
    this.mageIsAlive = true;
    this.gunwomanIsAlive = true;
    this.knightIsAlive = true;
};

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
    this.currentBackground.canvasX = 0;

    this.gameIsOver = false;
    this.didLose = false;
    this.didWin = false;
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
            gameEngine.entities[i].name === "tree" ||
            gameEngine.entities[i].name === "spike" ||
            gameEngine.entities[i].name === "potion" ||
            gameEngine.entities[i].name === "coin") {

            var platform = gameEngine.entities[i];
            platform.canvasX = platform.initialCanvasX;

        } else if (gameEngine.entities[i].name === "skeleton" || 
            gameEngine.entities[i].name === "skeletonArcher" ||
            gameEngine.entities[i].name === "robot") {

            var enemy = gameEngine.entities[i];
            
            if (enemy.name === "skeleton" || enemy.name === "skeletonArcher") {

                enemy.health = 3;
            
            } else {

                enemy.health = 50;
            }
            
            enemy.x = enemy.initialX;
            enemy.canvasX = enemy.initialCanvasX;
            enemy.animationAttackRight.elapsedTime = 0;
            enemy.animationAttackLeft.elapsedTime = 0;
            enemy.attacking = false;


        } else if (gameEngine.entities[i].name === "box") {

            gameEngine.removeEntity(gameEngine.entities[i]);
            i--;
        }
    }
}

function Score(gameEngine, gameState) {
    this.gameEngine = gameEngine;
    this.ctx = gameEngine.ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.gameState = gameState;
    this.x = 0 ;
    this.y = this.height - 75;
    this.score = gameState.score;
    this.initialCanvasX = this.x;
    this.name = "score";
    this.potOfGold = AM.getAsset("./img/potofgold.png");

}

Score.prototype.update = function() {
    this.score = this.gameState.score;
};

Score.prototype.draw = function() {
    // this.ctx.fillStyle = "black";
    // this.ctx.fillRect(this.x - 5, this.y - 30, 150, 60);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Georgia";
    this.ctx.drawImage(this.potOfGold, this.x , this.y - 50, 70, 70);
    this.ctx.fillText(this.score, this.x + 25 , this.y );
}
