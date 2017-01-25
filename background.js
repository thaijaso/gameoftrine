function init() {
    //console.log('here');
    var width = window.innerWidth;
    var height = window.innerHeight;
	stage = new PIXI.Container();
	renderer = new PIXI.CanvasRenderer(width, height, 
        { view: document.getElementById("gameWorld") }
	);



	//var farTexture = PIXI.Texture.fromImage("resources/bg-far.png");
	//far = new PIXI.extras.TilingSprite(farTexture, 512, 256);
	//far.position.x = 0;
	//far.position.y = 0;
	//far.tilePosition.x = 0;
	//far.tilePosition.y = 0;
	//stage.addChild(far);
    
    //console.log(AM);

    console.log('Here');

	var midTexture = PIXI.Texture.fromImage("./img/background.jpg");
	mid = new PIXI.extras.TilingSprite(midTexture, width, height);
	mid.position.x = 0;
	mid.position.y = 128;
	mid.tilePosition.x = 0;
	mid.tilePosition.y = 0;
	stage.addChild(mid);

	requestAnimationFrame(update);
    console.log("Background Initialized")
}

function update() {
	//far.tilePosition.x -= 0.128;
	mid.tilePosition.x -= 0.64;

	renderer.render(stage);

	requestAnimationFrame(update);
}

window.onload = function() {
    init();
};
