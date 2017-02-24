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
AM.queueDownload("./img/foreground1.png");
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
    var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground1.png"));
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
    var platform10 = new Platform(gameEngine, 133, 41, 35, 2);
    var platform11 = new Platform(gameEngine, 134, 40, 50.5, 1);
    var platform26 = new Platform(gameEngine, 160.5, 15, 3, 2);
    var platform27 = new Platform(gameEngine, 143.5, 31, 3, 1.5);
    var platform28 = new Platform(gameEngine, 153.5, 24, 23, 1);
    var platform29 = new Platform(gameEngine, 168.5, 8, 8, 5);
    var platform30 = new Platform(gameEngine, 187.5, 28, 2, 2);
    var platform31 = new Platform(gameEngine, 202, 32, 3, 2);
    var platform32 = new Platform(gameEngine, 211.5, 28, 6, 4);
    var platform33 = new Platform(gameEngine, 220.5, 41, 2, 2);
    var platform34 = new Platform(gameEngine, 227.75, 41, 18, 4);
    var platform35 = new Platform(gameEngine, 224.5, 26, 38, 6);
    var platform36 = new Platform(gameEngine, 260.5, 29, 26, 1.5);
    var platform37 = new Platform(gameEngine, 286.5, 29, 23, 6);
    var platform38 = new Platform(gameEngine, 249.5, 41, 13, 4);
    var platform39 = new Platform(gameEngine, 272.5, 40.5, 2, 2);
    var platform40 = new Platform(gameEngine, 284.5, 42.5, 2, 2);
    var platform41 = new Platform(gameEngine, 280.5, 40.5, 2, 2);
    var platform42 = new Platform(gameEngine, 296, 41, 3, 2);
    var platform43 = new Platform(gameEngine, 312, 39, 3, 2);
    var platform44 = new Platform(gameEngine, 242.5, 14, 3, 2);
    var platform45 = new Platform(gameEngine, 270.5, 10, 8, 5);
    var platform46 = new Platform(gameEngine, 319.5, 32, 2, 2);
    var platform47 = new Platform(gameEngine, 326.5, 35, 21.5, 1);
    var platform48 = new Platform(gameEngine, 327.5, 24, 2, 2);
    var platform49 = new Platform(gameEngine, 333, 17, 9, 1);
    var platform50 = new Platform(gameEngine, 344, 6, 11, 1);
    var platform51 = new Platform(gameEngine, 357, 17, 9, 1);
    var platform52 = new Platform(gameEngine, 348.5, 18, 2, 2);
    var platform53 = new Platform(gameEngine, 353.5, 35, 3, 5);
    var platform54 = new Platform(gameEngine, 361.5, 35, 3, 5);
    var platform55 = new Platform(gameEngine, 369.5, 35, 3, 5);
    var platform56 = new Platform(gameEngine, 379.5, 30, 3, 2);
    var platform57 = new Platform(gameEngine, 388, 36, 33, 1.5);
    var platform58 = new Platform(gameEngine, 419.5, 19, 5.5, 26);
    var platform59 = new Platform(gameEngine, 399, 24, 5.5, 4);
    var platform60 = new Platform(gameEngine, 415.5, 24, 3, 2);
    var platform61 = new Platform(gameEngine, 435.5, 27, 5, 18);
    var platform62 = new Platform(gameEngine, 441.5, 24, 2, 2);
    var platform63 = new Platform(gameEngine, 447.5, 20, 2, 2);
    var platform64 = new Platform(gameEngine, 452.5, 14, 2, 2);
    var platform65 = new Platform(gameEngine, 456.5, 9, 5, 36);
    var platform66 = new Platform(gameEngine, 471.5, 14, 2, 2);
    var platform67 = new Platform(gameEngine, 468, 27, 3,2);
    var platform68 = new Platform(gameEngine, 479, 39, 3,2);
    var platform69 = new Platform(gameEngine, 479.5, 17, 13.5, 7);
    var platform70 = new Platform(gameEngine, 492, 35, 14, 4);
    var platform71 = new Platform(gameEngine, 515, 22, 2, 8);
    var platform72 = new Platform(gameEngine, 515, 22, 19, 3);
    var platform73 = new Platform(gameEngine, 515, 38, 1, 7);
    var platform74 = new Platform(gameEngine, 543, 22, 13, 3);
    var platform75 = new Platform(gameEngine, 556, 22, 1, 23);
    var platform76 = new Platform(gameEngine, 516, 40, 40, 1);
    var platform77 = new Platform(gameEngine, 523.5, 33, 2, 2);
    var platform78 = new Platform(gameEngine, 532, 30, 14, 1);
    var platform79 = new Platform(gameEngine, 527, 16, 5, 4);
    var platform80 = new Platform(gameEngine, 545 , 16, 5, 4);
    var platform81 = new Platform(gameEngine, 559, 19, 11, 1.5);
    var platform82 = new Platform(gameEngine, 570, 16, 23, 5);
    var platform83 = new Platform(gameEngine, 599.5, 31, 3, 14);
    var platform84 = new Platform(gameEngine, 611.5, 27, 3, 18);
    var platform85 = new Platform(gameEngine, 622.5, 36, 3, 9);
    var platform86 = new Platform(gameEngine, 630.5, 21, 3, 24);
    var platform87 = new Platform(gameEngine, 641.5, 27, 3, 18);
    var platform88 = new Platform(gameEngine, 642, 29, 15, 1.5);
    var platform89 = new Platform(gameEngine, 667, 29, 31.5, 1.5);
    var platform90 = new Platform(gameEngine, 662, 11, 3, 2);








    // Major Platform 1
    gameEngine.addEntity(platform1);
    gameEngine.addEntity(platform2);
    gameEngine.addEntity(platform3);
    gameEngine.addEntity(platform4);
    gameEngine.addEntity(platform5);
    gameEngine.addEntity(platform6);
    gameEngine.addEntity(platform7);
    gameEngine.addEntity(platform8);
    gameEngine.addEntity(platform9);

    // Major Platform 2
    gameEngine.addEntity(platform11); // main platform
    gameEngine.addEntity(platform26); // mini floating platform
    gameEngine.addEntity(platform27); // mini floating platform (below ladder)
    gameEngine.addEntity(platform28); // ladder platform
    gameEngine.addEntity(platform29); // bigger floating platform
    gameEngine.addEntity(platform30); // tiny floating platform (to platform 3)

    // Major Platform 3
    gameEngine.addEntity(platform31); // floating mini platform
    gameEngine.addEntity(platform32); // floating platform
    gameEngine.addEntity(platform33); // floating mini platform
    gameEngine.addEntity(platform34); // platform under floating platform 1
    gameEngine.addEntity(platform35); // floating platform
    gameEngine.addEntity(platform36); // ladder
    gameEngine.addEntity(platform37); // connected to ladder
    gameEngine.addEntity(platform38); // platform under floating platform 2
    gameEngine.addEntity(platform39); // tiny floating platform 1
    gameEngine.addEntity(platform40); // tiny floating platform 2
    // gameEngine.addEntity(platform41);
    gameEngine.addEntity(platform42); // mini platform (under floating platform 2)
    gameEngine.addEntity(platform43); // mini platform 2, go to major platform 4
    gameEngine.addEntity(platform44); // mini platform (in sky)
    gameEngine.addEntity(platform45); // big floating platform (above ladder)

    // Major Platform 4 (Cave)
    gameEngine.addEntity(platform46); // tiny floating platform
    gameEngine.addEntity(platform47); // big platform
    gameEngine.addEntity(platform48); // tiny floating platform
    gameEngine.addEntity(platform49); // tri platform 1
    gameEngine.addEntity(platform50); // tri platform2
    gameEngine.addEntity(platform51); // tri platform3
    gameEngine.addEntity(platform52); // tiny floating platform
    gameEngine.addEntity(platform53); // custom floating platform 1
    gameEngine.addEntity(platform54); // custom floating platform 2
    gameEngine.addEntity(platform55); // custom floating platform 3
    gameEngine.addEntity(platform56); // mini floating platform

    // Major Platform 5
    gameEngine.addEntity(platform57); // ladder
    gameEngine.addEntity(platform58); // tall platform 1
    gameEngine.addEntity(platform59); // floating platform grass
    gameEngine.addEntity(platform60); // floating mini platform
    gameEngine.addEntity(platform61); // tall platform 2
    gameEngine.addEntity(platform62); // tiny platform
    gameEngine.addEntity(platform63); // tiny platform
    gameEngine.addEntity(platform64); // tiny platform
    gameEngine.addEntity(platform65); // tall platform 3
    gameEngine.addEntity(platform66); // tiny platform
    gameEngine.addEntity(platform67); // mini platform
    gameEngine.addEntity(platform68); // mini platform
    gameEngine.addEntity(platform69); // floating platform
    gameEngine.addEntity(platform70); // ladder

    // Major Platform 6 (cave)
    gameEngine.addEntity(platform71); // ceiling
    gameEngine.addEntity(platform72); // ceiling
    gameEngine.addEntity(platform73); // side
    gameEngine.addEntity(platform74); // ceiling
    gameEngine.addEntity(platform75); // ceiling
    gameEngine.addEntity(platform76); // ground
    gameEngine.addEntity(platform77); // tiny platform
    gameEngine.addEntity(platform78); // shelf
    gameEngine.addEntity(platform79); // grassy floaty thing
    gameEngine.addEntity(platform80); // blah

    // Last section
    gameEngine.addEntity(platform81); // ladder
    gameEngine.addEntity(platform82); // big triangle thingy
    gameEngine.addEntity(platform83); // skinny platform
    gameEngine.addEntity(platform84); // skinny platform
    gameEngine.addEntity(platform85); // skinny platform
    gameEngine.addEntity(platform86); // skinny platform
    gameEngine.addEntity(platform87); // skinny platform
    gameEngine.addEntity(platform88); // ladder
    gameEngine.addEntity(platform89); // ladder
    gameEngine.addEntity(platform90); // mini platform


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
