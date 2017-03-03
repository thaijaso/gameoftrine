function GameState(ctx, gameEngine) {
    this.ctx = ctx;
    this.gameEngine = gameEngine;
    this.charactersAlive = 3;
    this.currentCharacter = null;
    this.playableCharacters = [];
    this.playableCharacterIndex = 0;
    this.wolfSummoned = false;
}

GameState.prototype.draw = function() {}

GameState.prototype.update = function() {

    var gameEngine = this.gameEngine;
    var currentCharacter = this.getCurrentCharacter();

    if (currentCharacter.x >= 10839 && currentCharacter.y === 357) {

        window.alert("Next level");

    } else if (currentCharacter.y > 700) {

        console.log('died');
    }
};

GameState.prototype.updateHealth = function(entity) {

    if (entity.name === "knight" || entity.name === "gunwoman" || entity.name === "mage" || entity.name === "wolf") {
        entity.health = entity.health - 1;
        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);

        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);

            if (this.charactersAlive > 1) {
                //this.game.replaceCharacter();
                this.charactersAlive--;

            } else if (this.charactersAlive === 0) {
                window.alert('gameover');
            }
            
        }
    
    } else if (entity.name === "skeleton") {

        for (var i = 0; i < this.gameEngine.entities.length; i++) {
            var e = this.gameEngine.entities[i];
            
            if (e.id === entity.id) {
                //console.log('entity id: ' + entity.id);
                entity.health = entity.health - 1;
            }
            
            if (entity.health <= 0 && e.id === entity.id) {
                this.gameEngine.entities.splice(i, 1);
            }
        }
    }
};

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
