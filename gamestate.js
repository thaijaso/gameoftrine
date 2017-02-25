function GameState(ctx, gameEngine) {
    this.ctx = ctx;
    this.game = gameEngine;
    this.charactersAlive = 3;
}




GameState.prototype.draw = function() {}

GameState.prototype.update = function() {


};

GameState.prototype.updateHealth = function(entity) {

    if (entity.name === "knight") {
        entity.health = entity.health - 1;
        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);

        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);

            if (this.charactersAlive > 1) {
                this.game.replaceCharacter();
                this.charactersAlive--;

                
            
            } else if (this.charactersAlive === 0) {
                window.alert('gameover');
            }
            
        }
    } else if (entity.name === "gunwoman") {

        entity.health = entity.health - 1;
        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);
        
        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);
            
            if (this.charactersAlive > 1) {
                this.game.replaceCharacter();
                this.charactersAlive--;

            
            } else {

                window.alert('gameover');
            }
            
        }

    } else if (entity.name === "mage") {

        entity.health = entity.health - 1;
        entity.progressBar.updateHealth(entity.health);
        entity.progressBar.hasBeenHit(true);

        if (entity.health <= 0) {
            // this.game.removeEntity(entity.id);
            
            if (this.charactersAlive > 1) {
                this.game.replaceCharacter();
                this.charactersAlive--;

            
            } else {

                window.alert('gameover');
            }
            
        }

    } else if (entity.name === "skeleton") {

        for (var i = 0; i < this.game.entities.length; i++) {
            var e = this.game.entities[i];
            if (e.id === entity.id) {

                entity.health = entity.health - 1;
            }
            if (entity.health <= 0 && e.id === entity.id) {
                this.game.entities.splice(i, 1);
            }
        }
    }


 //    var nogunwoman = false;
	// var nomage = false;
	// var noknight = false;
 //    for (var i = 0; i < this.game.entities.length; i++) {
 //        var e = this.game.entities[i];

 //        if (e.name != "gunwoman") {
 //        	nogunwoman = true;
 //        }
 //        if(e.name != "knight") {
 //        	noknight = true;
 //        } 
 //        if(e.name != "mage") {
 //        	nomage = true;
 //        }
 //    }

 //    if(noknight && nomage && nogunwoman) {
 //    	window.alert("Game Over");
 //    }


};
