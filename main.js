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

//skeleton
AM.queueDownload("./img/skeletonidleright.png");
AM.queueDownload("./img/skeletonidleleft.png");

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
    var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground-grid.png"));
    var background = new Background(gameEngine, AM.getAsset("./img/background.png"));
    var midground = new Midground(gameEngine, AM.getAsset("./img/midground.png"));
    var grapple = new Grapple(gameEngine, canvas, ctx);

    var knight = new Knight(gameEngine);
    var gunwoman = new Gunwoman(gameEngine);
    var mage = new Mage(gameEngine);
    var wolf = new Wolf(gameEngine);
    var skeleton = new Skeleton(gameEngine);
    var tree = new Tree(gameEngine);


    var knightPortraitRight = new Portrait(ctx, AM.getAsset("./img/knightportraitright.png"));

    //an entity is any element drawn on the map
    //gameEngine.addEntity(background);
    //gameEngine.addEntity(midground);
    gameEngine.addEntity(knight);
    // gameEngine.addEntity(bullet);
    // gameEngine.addEntity(skeleton);
    // gameEngine.addEntity(tree);
    //gameEngine.addEntity(knightPortraitRight);
    // gameEngine.addEntity(grapple);

    gameEngine.addPlayableCharacter(knight);
    gameEngine.addPlayableCharacter(gunwoman);
    gameEngine.addPlayableCharacter(mage);

    gameEngine.addWolf(wolf);

    gameEngine.setCurrentCharacter(knight);
    //gameEngine.setCurrentBackground(background);

    //x,  y, width, height
    var platform1 = new Platform(gameEngine, 0, 31, 110, 1);
    var platform2 = new Platform(gameEngine, 119, 34, 5, 1);
    var platform3 = new Platform(gameEngine, 125, 30, 5, 1);
    var platform4 = new Platform(gameEngine, 135, 25, 5, 1);
    var platform5 = new Platform(gameEngine, 33, 23, 4, 1);
    var platform6 = new Platform(gameEngine, 25, 22, 3, 1);

    gameEngine.addEntity(platform1);
    gameEngine.addEntity(platform2);
    gameEngine.addEntity(platform3);
    gameEngine.addEntity(platform4);
    gameEngine.addEntity(platform5);
    gameEngine.addEntity(platform6);

    //gameEngine.addEntity(foreground);
    console.log("All Done!");
});
