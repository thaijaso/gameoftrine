// no inheritance
function Portrait(ctx, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.ctx = ctx;

}

Portrait.prototype.draw = function() {
    //console.log(this);
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};


Portrait.prototype.update = function() {};

// the "main" code begins here

var AM = new AssetManager();
var gameState = new GameState();


var gameWorld = document.getElementById("gameWorld");
gameWorld.width = window.innerWidth;
gameWorld.height = window.innerHeight;


AM.queueDownload("./img/background.png");
AM.queueDownload("./img/midground.png");
AM.queueDownload("./img/foreground.png");
AM.queueDownload("./img/foreground-grid.png");

//knight
AM.queueDownload("./img/knightidleright.png");
AM.queueDownload("./img/knightattackright.png");
AM.queueDownload("./img/knightwalkright.png");
AM.queueDownload("./img/knightidleleft.png");
AM.queueDownload("./img/knightattackleft.png");
AM.queueDownload("./img/knightwalkleft.png");
AM.queueDownload("./img/knightjumpright.png");
AM.queueDownload("./img/knightjumpleft.png");
AM.queueDownload("./img/knightportraitright.png");

//gunwoman
AM.queueDownload("./img/gunwomanidleright.png");
AM.queueDownload("./img/gunwomanwalkright.png");
AM.queueDownload("./img/gunwomanattackright.png");
AM.queueDownload("./img/gunwomanidleleft.png");
AM.queueDownload("./img/gunwomanwalkleft.png");
AM.queueDownload("./img/gunwomanattackleft.png");
AM.queueDownload("./img/gunwomanjumpright.png");
AM.queueDownload("./img/gunwomanjumpleft.png");


//wolf
AM.queueDownload("./img/wolfidleright.png");
AM.queueDownload("./img/wolfattackright.png");
AM.queueDownload("./img/wolfwalkright.png");

//mage
AM.queueDownload("./img/mageWalkRight.png");
AM.queueDownload("./img/mageIdleRight.png");
AM.queueDownload("./img/mageAttackRight.png");
AM.queueDownload("./img/mageWalkLeft.png");
AM.queueDownload("./img/mageIdleLeft.png");
AM.queueDownload("./img/mageAttackLeft.png");
AM.queueDownload("./img/mageJumpRight.png");
AM.queueDownload("./img/magejumpleft.png");

//tree
AM.queueDownload("./img/treeleaffall.png");


AM.downloadAll(function() {
    var canvas = document.getElementById("gameWorld");
    canvas.focus();

    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();

    gameEngine.init(ctx, AM);
    gameEngine.start();
    gameState.init(ctx, gameEngine);


    //var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground.png"));
    var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground.png"));
    var background = new Background(gameEngine, AM.getAsset("./img/background.png"));
    var midground = new Midground(gameEngine, AM.getAsset("./img/midground.png"));

    var knight = new Knight(gameEngine);
    var gunwoman = new Gunwoman(gameEngine);
    var mage = new Mage(gameEngine);
    var wolf = new Wolf(gameEngine);
    var tree = new Tree(gameEngine);


    //var knightPortraitRight = new Portrait(ctx, AM.getAsset("./img/knightportraitright.png"));

    //an entity is any element drawn on the map
    gameEngine.addEntity(knight);
    gameEngine.addEntity(foreground);
    
    gameEngine.addEntity(tree);
    //gameEngine.addEntity(knightPortraitRight);

    gameEngine.addPlayableCharacter(knight);
    gameEngine.addPlayableCharacter(gunwoman);
    gameEngine.addPlayableCharacter(mage);

    gameEngine.addWolf(wolf);

    gameEngine.setCurrentCharacter(knight);
    //gameEngine.setCurrentBackground(background);
    
                                          //x,  y, width, height
    var platform1 = new Platform(gameEngine, 0, 31, 110, 1); 
    var platform2 = new Platform(gameEngine, 30, 23, 8, 1);
    var platform3 = new Platform(gameEngine, 36, 19, 2, 1);
    var platform4 = new Platform(gameEngine, 32, 18, 3, 1);
    var platform5 = new Platform(gameEngine, 36, 19, 4, 1);
    
    platform1.number = 1;
    platform2.number = 2;
    platform3.number = 3;
    platform4.number = 4;
    platform5.number = 5;

    gameEngine.addEntity(platform1);
    gameEngine.addEntity(platform2);
    gameEngine.addEntity(platform3);
    gameEngine.addEntity(platform4);
    //gameEngine.addEntity(platform5);


    gameEngine.addEntity(midground);
    gameEngine.addEntity(background);    
    console.log("All Done!");
});
