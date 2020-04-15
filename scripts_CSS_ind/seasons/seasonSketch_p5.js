let transparency;  //TODO move to screen prop
let canvasOverlay;
let blocks = [];   //TODO move to maptiles (work out calling)

let sprite1;
let btnWint, btnSpr, btnSum, btnFall, btnPause, btnRestart, btnContinue;
let btnLevels = [];

let soundJump;
let soundKey;
let soundHeart;
let soundSpike;
let game;

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprite1 = loadImage("scripts_CSS_ind/seasons/assets/sprites/spritesheet1.png");
	soundKey = loadSound("scripts_CSS_ind/seasons/assets/sounds/clink1.mp3");
	soundHeart = loadSound("scripts_CSS_ind/seasons/assets/sounds/243701__ertfelda__correct.wav");
	soundJump = loadSound("scripts_CSS_ind/seasons/assets/sounds/420668__sypherzent__basic-melee-swing-miss-whoosh.wav");
	soundSpike = loadSound("scripts_CSS_ind/seasons/assets/sounds/344131__thebuilder15__sword-slice.wav");

	loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/320447__ellary__soundscape-find-nothing.mp3", 
		asset=>{levelData[0].music = asset});
	loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/325647__shadydave__expressions-of-the-mind-piano-loop.mp3", 
		asset=>{levelData[1].music = asset});
	loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/370293__mrthenoronha__water-game-theme-loop.wav", 
		asset=>{levelData[2].music = asset});
	loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/468407__onderwish__sci-fi-survival-dreamscape.mp3", 
		asset=>{levelData[3].music = asset});
}


function setup() {
    let c = createCanvas(600, 400);
	c.parent('cParent');
	frameRate(60);

	transparency=0;  //overlay effects
	canvasOverlay=color(255, 255, 255, transparency);
	
	//volume adjustments
	soundJump.setVolume(0.4);
	soundSpike.setVolume(0.7);
	levelData[0].music.setVolume(0.4);
	levelData[1].music.setVolume(0.4);
	levelData[2].music.setVolume(0.3);
	levelData[3].music.setVolume(0.4);

	//sprites for tiles and config images
	imgSS_Wint = sprite1.get(150,200,171,129);
	imgSS_Spr = sprite1.get(329,200,171,129);
	imgSS_Sum = sprite1.get(150,329,171,129);
	imgSS_Fall = sprite1.get(329,329,171,129);
	
	imgG1 = sprite1.get(0,0,50,50);
	imgG2 = sprite1.get(50,0,50,50); 
	imgD1 = sprite1.get(0,50,50,50);
	imgD2 = sprite1.get(50,50,50,50);
	imgS1 = sprite1.get(0,100,50,50);
	imgS2 = sprite1.get(50,100,50,50);
	imgIce1 = sprite1.get(0,150,50,50);
	imgIce2 = sprite1.get(50,150,50,50);
	imgWood1 = sprite1.get(300, 0, 50, 50);
	imgWood2 = sprite1.get(350, 0, 50, 50);
	imgBrick = sprite1.get(400, 0, 50, 50);

	imgHeart = sprite1.get(100,50,50,50);
	imgR1 = sprite1.get(0, 200, 50, 50);
	imgR2 = sprite1.get(50, 200, 50, 50);
	imgR3 = sprite1.get(0,250,50,50);
	imgR4 = sprite1.get(50,250,50,50);
	imgClL = sprite1.get(200,0,50,50); 
	imgClM = sprite1.get(250,0,50,50);  
	imgClR = sprite1.get(250,100,50,50);  
	imgL1 = sprite1.get(200, 50, 50,50);  
	imgL2 = sprite1.get(250, 50, 50,50);  
	imgPot = sprite1.get(100,100,50,50); 
	imgKey = sprite1.get(100, 200, 50, 50);
	imgPortal = sprite1.get(100, 250, 50, 50);
	imgFlower = sprite1.get(150, 0, 50, 50);
	imgFlower2 = sprite1.get(150, 50, 50, 50); 
	imgFossil = sprite1.get(200, 100, 50, 50); 
	imgPumpk = sprite1.get(150, 100, 50, 50); 
	
	//game instance
	game=new Game();  
	
	//buttons
	btnStart = new Button(btnStart1);
	btnWint = new LevelSelectButton(btnLevelSelect, width/10, 1.65*height/10, "Winter", 0, imgSS_Wint);
	btnSpr = new LevelSelectButton(btnLevelSelect, 5*width/10, 1.65*height/10, "Spring", 1, imgSS_Spr);
	btnSum = new LevelSelectButton(btnLevelSelect, width/10, 5.95*height/10, "Summer", 2, imgSS_Sum);
	btnFall = new LevelSelectButton(btnLevelSelect, 5*width/10, 5.95*height/10, "Fall", 3, imgSS_Fall);
	btnLevels = [btnWint, btnSpr, btnSum, btnFall];

	btnPause = new Button(pause1);
	btnContinue = new Button(continue1);
	btnRestart = new Button(restart1);
}


  
function keyPressed(){
	if (game.player.movements.hasOwnProperty(keyCode)){
		game.player.movements[keyCode] = true;  
	}
}
function keyReleased(){
	if (game.player.movements.hasOwnProperty(keyCode)){
		game.player.movements[keyCode] = false;  
	}
}



//sketch main
function draw() {
	
	
	if (game.gameState === "levelSelect"){
		game.screenLvSelect();
	}
	if(game.gameState === "gameStart"){ 
		game.loadMap(); //only load map once here
		} 
    if(game.gameState === "inGame"){ 
        game.screenInGame(); 
    }
    if(game.gameState === "gameOver"){ 
		game.levelData[game.currentLevel].music.stop();
		game.screenGameOver();
    }
	
	
    if(game.gameState === "win"){ 
        fill(0, 200, 0,1);
        noStroke();
        rect(0,0,width,height);
        fill(0, 0, 0);
        textAlign(CENTER,CENTER);
        textSize(50);
        text("You Win!",width/2,height/2);
    }
}