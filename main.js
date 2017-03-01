// no inheritance
function Portrait(ctx, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.ctx = ctx;
}

Portrait.prototype.draw = function() {
    this.ctx.drawImage(this.spritesheet, this.x, this.y, 130 , 101);
};


Portrait.prototype.update = function() {};

function ProgressBar(ctx, x, y) {
    this.ctx = ctx;

}

function ProgressBar(ctx, x, y) {
    this.ctx = ctx;
    this.al = 0; // use it for Amount loaded
    this.start = 4.72; //From where to start position of progress;
    this.cw = x; //to get x cordinate;
    this.ch = y; // to get y coordinate;
    this.endAngle;
    this.health;
    this.hit = false;
    this.state = "healthy";
    this.diff = 0; //to load progress bar Slowly
    this.quart = Math.PI / 2;
    this.circ = Math.PI * 2;

}

ProgressBar.prototype.update = function() {

    if (this.health >= 50) {
        this.diff = (this.al / 100) * Math.PI * 2;
        this.endAngle = this.diff + this.start;

        if (this.al >= 56) {
            clearTimeout(bar);
        }
        this.al++;
    } else if (this.hit) {
        this.health--;
        this.quart = this.quart - .01;
        var currentVal = (this.health * 2) / 100;
        this.endAngle = ((this.circ) * currentVal) - this.quart;
        this.start = -this.quart;
        this.hit = false;
    }

    if (this.health <= 0) {
        this.endAngle = this.start;
    }
};

ProgressBar.prototype.draw = function() {
    //console.log('here');
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FFF'; // for color of circle
    this.ctx.fill(); // fill function
    this.ctx.strokeStyle = '#e7f2ba'; // for border color
    this.ctx.stroke(); // Stroke function
    this.ctx.fillStyle = '#000';
    this.ctx.strokeStyle = '#37d613';
    this.ctx.lineWidth = 20;
    this.ctx.beginPath();

    if (this.endAngle < .5) {
		this.ctx.strokeStyle = '#F00';
        this.ctx.arc(this.cw, this.ch, 50, this.start, this.endAngle, false);
        this.ctx.stroke();

    } else if(this.endAngle < 2.5 && this.endAngle > .5) {
		this.ctx.strokeStyle = '#ffff13 ';
        this.ctx.arc(this.cw, this.ch, 50, this.start, this.endAngle, false);
        this.ctx.stroke();

	}

	else {
		this.ctx.strokeStyle = '#37d613';

        this.ctx.arc(this.cw, this.ch, 50, this.start, this.endAngle, false);
        this.ctx.stroke();


    }
};

ProgressBar.prototype.updateHealth = function(newHealth) {
    this.health = newHealth;
};

ProgressBar.prototype.hasBeenHit = function(isHit) {
    this.hit = isHit;
};

var bar;

// the "main" code begins here

var AM = new AssetManager();
var gameState = new GameState();

AM.queueDownload("./img/background.png");
AM.queueDownload("./img/midground.png");
AM.queueDownload("./img/foreground.png");

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
AM.queueDownload("./img/knight-impact-right.png");

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
AM.queueDownload("./img/gunwomanPORTRAITright.png");




//wolf
AM.queueDownload("./img/wolfidleright.png");
AM.queueDownload("./img/wolfattackright.png");
AM.queueDownload("./img/wolfwalkright.png");
AM.queueDownload("./img/wolf-walk-left.png");
AM.queueDownload("./img/wolf-idle-left.png");



//mage
AM.queueDownload("./img/mageWalkRight.png");
AM.queueDownload("./img/mageIdleRight.png");
AM.queueDownload("./img/mageAttackRight.png");
AM.queueDownload("./img/mageWalkLeft.png");
AM.queueDownload("./img/mageIdleLeft.png");
AM.queueDownload("./img/mageAttackLeft.png");
AM.queueDownload("./img/mageJumpRight.png");
AM.queueDownload("./img/magejumpleft.png");
AM.queueDownload("./img/magePORTRAITright.png");



//skeleton
AM.queueDownload("./img/skeletonidleright.png");
AM.queueDownload("./img/skeletonidleleft.png");
AM.queueDownload("./img/skeleton-walk-left.png");
AM.queueDownload("./img/skeleton-walk-right.png");
AM.queueDownload("./img/skeleton-attack-right.png");
AM.queueDownload("./img/skeleton-attack-left.png");

//skeleton archer
AM.queueDownload("./img/skeletonarcheridleleft.png");
AM.queueDownload("./img/skeletonarcherattackleft.png");
AM.queueDownload("./img/skeletonarcherattackright.png");


//tree
AM.queueDownload("./img/treeleaffall.png");

//arrow
AM.queueDownload("./img/arrow.png");


AM.downloadAll(function() {
    var canvas = document.getElementById("gameWorld");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.focus();

    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    var gameState = new GameState(ctx, gameEngine);

    gameEngine.init(ctx, AM, gameState);

    var foreground = new Foreground(gameEngine, AM.getAsset("./img/foreground.png"));
    var background = new Background(gameEngine, AM.getAsset("./img/background.png"));
    var midground = new Midground(gameEngine, AM.getAsset("./img/midground.png"));

    var progressKnight = new ProgressBar(ctx, 74, 72);
    var progressGunwoman = new ProgressBar(ctx, 205, 72);
    var progressMage = new ProgressBar(ctx, 335, 72);

    var knight = new Knight(gameEngine, gameState, progressKnight);
    var gunwoman = new Gunwoman(gameEngine, gameState, progressGunwoman);
    var mage = new Mage(gameEngine, gameState, progressMage);
	//var wolf = new Wolf(gameEngine);

                                        //   x   y
    var skeleton0 = new Skeleton(gameEngine, gameState, 68, 24);
    var skeleton1 = new Skeleton(gameEngine, gameState, 72, 24);
    var skeleton2 = new Skeleton(gameEngine, gameState, 75, 24);
    var skeleton3 = new Skeleton(gameEngine, gameState, 80, 24);
    var skeleton4 = new Skeleton(gameEngine, gameState, 144, 32);//BOTTOM TWO
    var skeleton5 = new Skeleton(gameEngine, gameState, 174, 32);
    var skeleton6 = new Skeleton(gameEngine, gameState, 168, 17);//SINGLE TOP ONE
    var skeleton7 = new Skeleton(gameEngine, gameState, 235, 19);//TOP THREE BY THE TREE
    var skeleton8 = new Skeleton(gameEngine, gameState, 255, 19);
    var skeleton9 = new Skeleton(gameEngine, gameState, 285, 22);
    var skeleton10 = new Skeleton(gameEngine, gameState, 235, 33);//TWO UNDER THE TREE
    var skeleton11 = new Skeleton(gameEngine, gameState, 255, 33);
    var skeleton12 = new Skeleton(gameEngine, gameState, 336, 7);//THE THREEIO 
    var skeleton13 = new Skeleton(gameEngine, gameState, 360, 7);
    var skeleton14 = new Skeleton(gameEngine, gameState, 348, 1);
    var skeleton15 = new Skeleton(gameEngine, gameState, 335, 27);//UNDER THE THREEIO
    var skeleton16 = new Skeleton(gameEngine, gameState, 400, 27);//SINGLE ONE BY THE TREE ON POL
    var skeleton17 = new Skeleton(gameEngine, gameState, 485, 10);// SINGLE ON TOP OF THE SIGN
    var skeleton18 = new Skeleton(gameEngine, gameState, 540, 32);//GUYS INSIDE THE SQURE SHAPE
    var skeleton19 = new Skeleton(gameEngine, gameState, 528, 32);
    var skeleton20 = new Skeleton(gameEngine, gameState, 580, 7);//SINGLE GUY BY TREE
    var skeleton21 = new Skeleton(gameEngine, gameState, 650, 22);//
    var skeleton22 = new Skeleton(gameEngine, gameState, 685, 22);


    var tree = new Tree(gameEngine);

    var tooltip = new Tooltip(gameEngine);

    var knightPortraitRight = new Portrait(ctx, AM.getAsset("./img/knightportraitright.png"), 4.9, 20);
    var gunwomanPortraitRight = new Portrait(ctx, AM.getAsset("./img/gunwomanPORTRAITright.png"), 155, 20);
    var magePortraitRight = new Portrait(ctx, AM.getAsset("./img/magePORTRAITright.png"), 265, 20);


    //an entity is any element drawn on the map
    gameEngine.addEntity(knight);
    
    //gameEngine.addEntity(skeleton0);
    //gameEngine.addEntity(skeleton1);
    //gameEngine.addEntity(skeleton2);
    //gameEngine.addEntity(skeleton3);
                      
    gameEngine.addEntity(skeleton4); 
    gameEngine.addEntity(skeleton5); 
    gameEngine.addEntity(skeleton6);
    gameEngine.addEntity(skeleton7);
    gameEngine.addEntity(skeleton8);
    gameEngine.addEntity(skeleton9);
    gameEngine.addEntity(skeleton10);
    gameEngine.addEntity(skeleton11);
    gameEngine.addEntity(skeleton12);
    gameEngine.addEntity(skeleton13);
    gameEngine.addEntity(skeleton14);
    gameEngine.addEntity(skeleton15);
    gameEngine.addEntity(skeleton16);
    gameEngine.addEntity(skeleton17);
    gameEngine.addEntity(skeleton18);
    gameEngine.addEntity(skeleton19);
    gameEngine.addEntity(skeleton20);
    gameEngine.addEntity(skeleton21);
    gameEngine.addEntity(skeleton22);

                                            //   x   y
    var archer1 = new SkeletonArcher(gameEngine, 96, 3);
    var archer2 = new SkeletonArcher(gameEngine, 166, 12);
    var archer3 = new SkeletonArcher(gameEngine, 172, 5);
    var archer4 = new SkeletonArcher(gameEngine, 243, 11);
    var archer5 = new SkeletonArcher(gameEngine, 274, 7);
    var archer6 = new SkeletonArcher(gameEngine, 400, 21);
    var archer7 = new SkeletonArcher(gameEngine, 530, 13);
    var archer8 = new SkeletonArcher(gameEngine, 547, 13);
    var archer9 = new SkeletonArcher(gameEngine, 663, 8);

    // gameEngine.addEntity(archer1);
    // gameEngine.addEntity(archer2); 
    // gameEngine.addEntity(archer3);
    // gameEngine.addEntity(archer4); 
    // gameEngine.addEntity(archer5);
    // gameEngine.addEntity(archer6);
    // gameEngine.addEntity(archer7); 
    // gameEngine.addEntity(archer8);
    // gameEngine.addEntity(archer9);

                                                   //x,  y, width, height
    var tutorialPlatform0 = new Platform(gameEngine, 0, 39, 42, 1)
    var tutorialPlatform1 = new Platform(gameEngine, 41, 28, 1, 11);
    
    var platform1 = new Platform(gameEngine, 42, 28, 78, 1);
    var platform2 = new Platform(gameEngine, 64, 22, 3, 2);
    var platform3 = new Platform(gameEngine, 75, 19, 3, 2);
    var platform4 = new Platform(gameEngine, 88, 18, 3, 1.5);
    var platform5 = new Platform(gameEngine, 94, 18, 5, 1.5);
    var platform6 = new Platform(gameEngine, 102, 18, 7.5, 1.5);
    var platform7 = new Platform(gameEngine, 95.5, 6.8, 3, 2);
    var platform8 = new Platform(gameEngine, 119, 31, 5, 4);
    var platform9 = new Platform(gameEngine, 129, 33, 3, 2);

    var platform11 = new Platform(gameEngine, 134, 37, 50.5, 1);
    var platform26 = new Platform(gameEngine, 160.5, 12, 3, 2);
    var platform27 = new Platform(gameEngine, 143.5, 28, 3, 1.5);
    var platform28 = new Platform(gameEngine, 153.5, 21, 23, 1);
    var platform29 = new Platform(gameEngine, 168.5, 5, 8, 5);
    var platform30 = new Platform(gameEngine, 187.5, 25, 2, 2);
    var platform31 = new Platform(gameEngine, 202, 29, 3, 2);
    var platform32 = new Platform(gameEngine, 211.5, 25, 6, 4);
    var platform33 = new Platform(gameEngine, 220.5, 38, 2, 2);
    var platform34 = new Platform(gameEngine, 227.75, 38, 18, 4);
    var platform35 = new Platform(gameEngine, 224.5, 23, 38, 6);
    var platform36 = new Platform(gameEngine, 260.5, 26, 26, 1.5);
    var platform37 = new Platform(gameEngine, 286.5, 26, 23, 6);
    var platform38 = new Platform(gameEngine, 249.5, 38, 13, 4);
    var platform39 = new Platform(gameEngine, 272.5, 37.5, 2, 2);
    var platform40 = new Platform(gameEngine, 284.5, 39.5, 2, 2);

    var platform42 = new Platform(gameEngine, 296, 38, 3, 2);
    var platform43 = new Platform(gameEngine, 312, 36, 3, 2);
    var platform44 = new Platform(gameEngine, 242.5, 11, 3, 2);
    var platform45 = new Platform(gameEngine, 270.5, 7, 8, 5);
    var platform46 = new Platform(gameEngine, 319.5, 29.5, 2, 2);
    var platform47 = new Platform(gameEngine, 326.5, 32, 21.5, 1);
    var platform48 = new Platform(gameEngine, 327.5, 21.5, 2, 2);
    var platform49 = new Platform(gameEngine, 333, 14, 9, 1);
    var platform50 = new Platform(gameEngine, 344, 8, 12.5, 1);
    var platform51 = new Platform(gameEngine, 357, 14, 9, 1);
    var platform52 = new Platform(gameEngine, 348.5, 15.5, 2, 2);
    var platform53 = new Platform(gameEngine, 353.5, 32, 3, 5);
    var platform54 = new Platform(gameEngine, 361.5, 32, 3, 5);
    var platform55 = new Platform(gameEngine, 369.5, 32, 3, 5);
    var platform56 = new Platform(gameEngine, 379.5, 27, 3, 2);
    var platform57 = new Platform(gameEngine, 388, 33, 33, 1.5);
    var platform58 = new Platform(gameEngine, 419.5, 16, 5.5, 26);
    var platform59 = new Platform(gameEngine, 399, 21, 5.5, 4);
    var platform60 = new Platform(gameEngine, 415.5, 21, 3, 2);
    var platform61 = new Platform(gameEngine, 435.5, 24, 5, 18);
    var platform62 = new Platform(gameEngine, 441.5, 21, 2, 2);
    var platform63 = new Platform(gameEngine, 447.5, 17, 2, 2);
    var platform64 = new Platform(gameEngine, 452.8, 11, 2, 2);
    var platform65 = new Platform(gameEngine, 456.5, 6, 5, 36);
    var platform66 = new Platform(gameEngine, 471.5, 11, 2, 2);
    var platform67 = new Platform(gameEngine, 468, 24, 3, 2);
    var platform68 = new Platform(gameEngine, 479, 36, 3, 2);
    var platform69 = new Platform(gameEngine, 479.5, 14, 13.5, 7);
    var platform70 = new Platform(gameEngine, 492, 32, 14, 4);
    var platform71 = new Platform(gameEngine, 515, 19, 2, 8);
    var platform72 = new Platform(gameEngine, 515, 19, 19, 3);
    var platform73 = new Platform(gameEngine, 515, 35, 1, 7);
    var platform74 = new Platform(gameEngine, 543, 19, 13, 3);
    var platform75 = new Platform(gameEngine, 556, 19, 1, 23);
    var platform76 = new Platform(gameEngine, 516, 37, 40, 1);
    var platform77 = new Platform(gameEngine, 523.5, 30, 2, 2);
    var platform78 = new Platform(gameEngine, 532, 30, 14, 1);
    var platform79 = new Platform(gameEngine, 527, 13, 5, 4);
    var platform80 = new Platform(gameEngine, 545, 13, 5, 4);
    var platform81 = new Platform(gameEngine, 559, 16, 11, 1.5);
    var platform82 = new Platform(gameEngine, 570, 13, 23, 5);
    var platform83 = new Platform(gameEngine, 599.5, 28, 3, 14);
    var platform84 = new Platform(gameEngine, 611.5, 24, 3, 18);
    var platform85 = new Platform(gameEngine, 622.5, 33, 3, 9);
    var platform86 = new Platform(gameEngine, 630.5, 19, 3, 24);
    var platform87 = new Platform(gameEngine, 641.5, 24, 3, 18);
    var platform88 = new Platform(gameEngine, 642, 26, 15, 1.5);
    var platform89 = new Platform(gameEngine, 667, 26, 31.5, 1.5);
    var platform90 = new Platform(gameEngine, 662, 8, 3, 2);

    //Tutorial Platform
    gameEngine.addEntity(tutorialPlatform0);
    gameEngine.addEntity(tutorialPlatform1);

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

    gameEngine.addEntity(tooltip);
    gameEngine.addEntity(foreground);
    gameEngine.addEntity(tree);

    gameEngine.addEntity(knightPortraitRight);
    gameEngine.addEntity(gunwomanPortraitRight);
    gameEngine.addEntity(magePortraitRight);

    gameEngine.addEntity(progressKnight);
    gameEngine.addEntity(progressGunwoman);
    gameEngine.addEntity(progressMage);

    gameEngine.addPlayableCharacter(knight);
    gameEngine.addPlayableCharacter(gunwoman);
    gameEngine.addPlayableCharacter(mage);

    gameEngine.setCurrentCharacter(knight);

    gameEngine.setCurrentBackground(background);
    gameEngine.setCurrentForeground(foreground);


    gameEngine.addEntity(midground);
    gameEngine.addEntity(background);

    gameEngine.start();

    console.log("All Done!");
});
					