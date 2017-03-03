function GameState(ctx, gameEngine) {
    this.ctx = ctx;
    this.game = gameEngine;
    this.charactersAlive = 3;
}




GameState.prototype.draw = function() {}

GameState.prototype.update = function() {

    var gameEngine = this.game;
    var currentCharacter = gameEngine.getCurrentCharacter();

    if (currentCharacter.x >= 10839 && currentCharacter.y === 357) {
        window.alert("Next level");
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

        for (var i = 0; i < this.game.entities.length; i++) {
            var e = this.game.entities[i];
            
            if (e.id === entity.id) {
                console.log('entity id: ' + entity.id);
                entity.health = entity.health - 1;
            }
            
            if (entity.health <= 0 && e.id === entity.id) {
                this.game.entities.splice(i, 1);
            }
        }
    }
};
