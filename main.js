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
AM.queueDownload("./img/gunwomanattackrightup.png");



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
    var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground.png"));
    var background = new Background(gameEngine, AM.getAsset("./img/background.png"));
    var midground = new Midground(gameEngine, AM.getAsset("./img/midground.png"));
    // var grapple = new Grapple(gameEngine, canvas, ctx);

    var knight = new Knight(gameEngine);
    var gunwoman = new Gunwoman(gameEngine);
    var mage = new Mage(gameEngine);
    var wolf = new Wolf(gameEngine);

    var skeleton = new Skeleton(gameEngine);
    var tree = new Tree(gameEngine);

    //var knightPortraitRight = new Portrait(ctx, AM.getAsset("./img/knightportraitright.png"));

    //an entity is any element drawn on the map
    gameEngine.addEntity(knight);

                                            //x,  y, width, height
    var platform1 = new Platform(gameEngine, 0, 31, 110, 1); 
    var platform2 = new Platform(gameEngine, 64, 25, 3, 2);
    var platform3 = new Platform(gameEngine, 75, 22, 3, 2);
    var platform4 = new Platform(gameEngine, 88, 21, 3, 1.5);
    var platform5 = new Platform(gameEngine, 94, 21, 5, 1.5);
    var platform6 = new Platform(gameEngine, 102, 21, 7.5, 1.5);
    var platform7 = new Platform(gameEngine, 95.5, 6.8, 3, 2);
    var platform8 = new Platform(gameEngine, 119, 34, 5, 4);
    var platform9 = new Platform(gameEngine, 129, 36, 3, 2);
    var platform10 = new Platform(gameEngine, 134, 40, 1, 2);
    var platform11 = new Platform(gameEngine, 135, 39, 2, 1);
    var platform12 = new Platform(gameEngine, 135, 39, 1, 3);
    var platform13 = new Platform(gameEngine, 136, 39, 1, 3);
    var platform14 = new Platform(gameEngine, 137, 38, 8, 1);

    gameEngine.addEntity(platform1);
    gameEngine.addEntity(platform2);
    gameEngine.addEntity(platform3);
    gameEngine.addEntity(platform4);
    gameEngine.addEntity(platform5);
    gameEngine.addEntity(platform6);
    gameEngine.addEntity(platform7);
    gameEngine.addEntity(platform8);
    gameEngine.addEntity(platform9);
    gameEngine.addEntity(platform10);
    gameEngine.addEntity(platform11);
    //gameEngine.addEntity(platform12);
    //gameEngine.addEntity(platform13);
    gameEngine.addEntity(platform14);
    
    gameEngine.addEntity(foreground);
    gameEngine.addEntity(tree);

    // gameEngine.addEntity(skeleton);
    // gameEngine.addEntity(tree);

    //gameEngine.addEntity(knightPortraitRight);
    // gameEngine.addEntity(grapple);

    gameEngine.addPlayableCharacter(knight);
    gameEngine.addPlayableCharacter(gunwoman);
    gameEngine.addPlayableCharacter(mage);

    // gameEngine.addWolf(wolf);

    gameEngine.setCurrentCharacter(knight);
    //gameEngine.setCurrentBackground(background);

   
    gameEngine.addEntity(midground);
    gameEngine.addEntity(background);    

    console.log("All Done!");
});
