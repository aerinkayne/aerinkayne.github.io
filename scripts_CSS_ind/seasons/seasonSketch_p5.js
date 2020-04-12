let transparency;  
let canvasOverlay;
let keys = []; //for movements
let decoImages = [];
let lava = [];
let portkeys =[];
let hearts = [];
let spikes = [];
let portals = [];
let players = [];
let blocks = [];
let sprite1;
let btnWint, btnSpr, btnSum, btnFall, btnPause, btnRestart, btnContinue;
let btnLevels = [];

let soundJump;
let soundKey;
let soundHeart;
let soundSpike;
let sScapeW, sScapeSpr, sScapeSummer, sScapeF;
let game;
let hillColor;

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprite1 = loadImage("scripts_CSS_ind/seasons/assets/sprites/spritesheet1.png");
	soundKey = loadSound("scripts_CSS_ind/seasons/assets/sounds/clink1.mp3");
	soundHeart = loadSound("scripts_CSS_ind/seasons/assets/sounds/243701__ertfelda__correct.wav");
	soundJump = loadSound("scripts_CSS_ind/seasons/assets/sounds/420668__sypherzent__basic-melee-swing-miss-whoosh.wav");
	soundSpike = loadSound("scripts_CSS_ind/seasons/assets/sounds/344131__thebuilder15__sword-slice.wav");

	sScapeW = loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/320447__ellary__soundscape-find-nothing.mp3", asset=>{levelData[0].music = asset});
	sScapeSpr = loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/325647__shadydave__expressions-of-the-mind-piano-loop.mp3", asset=>{levelData[1].music = asset});
	sScapeSummer = loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/370293__mrthenoronha__water-game-theme-loop.wav", asset=>{levelData[2].music = asset});
	sScapeF = loadSound("scripts_CSS_ind/seasons/assets/sounds/soundscapes/468407__onderwish__sci-fi-survival-dreamscape.mp3", asset=>{levelData[3].music = asset});
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
	sScapeW.setVolume(0.4);
	sScapeSpr.setVolume(0.4);
	sScapeSummer.setVolume(0.3);
	sScapeF.setVolume(0.4);

	//sprites for tiles and config images
	imgStart = sprite1.get(150,179,30,20);

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
	
	//game
	game=new Game();  
	
	//buttons.  PX,PY, W, H, radius, color, label, level index (if any)
	btnWint = new Button(width/10, 1.65*height/10, width/3.5, height/3.1, 3, color(220), "Winter",0); 
	btnWint0 = new LevelSelectButton(btnWinter1, 1, imgSS_Wint);  //do not reference level by 0 indexing
	

	btnSpr = new Button(5*width/10, 1.65*height/10, width/3.5, height/3.1, 3, color(220), "Spring",1); 
	btnSum = new Button(width/10, 5.95*height/10, width/3.5, height/3.1, 3, color(220), "Summer",2); 
	btnFall = new Button(5*width/10, 5.95*height/10, width/3.5, height/3.1, 3, color(220), "Fall",3);
	btnWint.img = imgSS_Wint;
	btnSpr.img = imgSS_Spr;
	btnSum.img = imgSS_Sum;
	btnFall.img = imgSS_Fall;
	btnLevels = [btnWint, btnSpr, btnSum, btnFall];
	
	btnStart = new Button(8.62*width/10, 8.5*height/10, width/15, height/15, 4, color(0,200,100));
	btnStart.tSize = btnStart.h/2; 
	btnStart.img = imgStart;
	
	btnPause = new SmlButton(1.75*width/10, 0.1*height/10, width/20, height/25, 2, color(175,235,180,200), "Pause");
	btnPause.tSize = btnPause.h/2;
	
	btnContinue = new SmlButton(width/2-3*width/20, height/2, width/10, height/16, 8, color(75,200,255), "Continue");
	btnRestart = new SmlButton(width/2+width/20, height/2, width/10, height/16, 0, color(255,75,110), "Restart");
}

  

function keyPressed(){keys[keyCode]=true;}   
function keyReleased(){keys[keyCode]=false;}


function mouseClicked(){
	game.manageScenes();	
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
		game.effectsHandler.sScape[game.currentLevel].stop();
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