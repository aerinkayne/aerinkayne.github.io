var transparency;  
var fadeColor;
var keys=[]; //for movements
var decoImages = [];
var lava = [];
var portkeys =[];
var hearts = [];
var spikes = [];
var portals = [];
var players = [];
var blocks = [];
var sprite1;
var soundJump;
var soundKey;
var soundHeart;
var soundSpike;
var sScapeW, sScapeSpr, sScapeSummer, sScapeF;
var game;
var hillColor;

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprite1 = loadImage("assets/sprites/spritesheet1.png");
	soundKey = loadSound("assets/sounds/clink1.mp3");
	soundHeart = loadSound("assets/sounds/243701__ertfelda__correct.wav");
	soundJump = loadSound("assets/sounds/420668__sypherzent__basic-melee-swing-miss-whoosh.wav");
	soundJump.setVolume(0.4);
	soundSpike = loadSound("assets/sounds/344131__thebuilder15__sword-slice.wav");
	
	sScapeW = loadSound("assets/sounds/soundscapes/320447__ellary__soundscape-find-nothing.mp3");
	sScapeW.setVolume(0.4);
	sScapeSpr = loadSound("assets/sounds/soundscapes/325647__shadydave__expressions-of-the-mind-piano-loop.mp3");
	sScapeSpr.setVolume(0.4);
	sScapeSummer = loadSound("assets/sounds/soundscapes/370293__mrthenoronha__water-game-theme-loop.wav");
	sScapeSummer.setVolume(0.4);
	sScapeF = loadSound("assets/sounds/soundscapes/468407__onderwish__sci-fi-survival-dreamscape.mp3");
	sScapeF.setVolume(0.4);
}


function setup() {
    var c = createCanvas(600, 400);
	c.parent('cParent');
	frameRate(60);

	transparency=0;  //overlay effects
	fadeColor=color(255, 255, 255, transparency);
	
	//sprites
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
}

  

function keyPressed(){keys[keyCode]=true;}   
function keyReleased(){keys[keyCode]=false;}




function draw() {
	if (game.gameState === "gameStart"){ //game.mapLoaded === "mapInitial"){
		game.loadMap();
		} //only load map once here
	
    if(game.gameState === "inGame"){ //state==="inGame"){
        game.runGame();
    }
    if(game.gameState === "dead"){ //state==="dead"){
		game.effectsHandler.sScape[game.currentLevel].stop();
		game.clickToRestart();
    }
    if(game.gameState === "win"){ //state==="win"){
        fill(0, 200, 0,1);
        noStroke();
        rect(0,0,width,height);
        fill(0, 0, 0);
        textAlign(CENTER,CENTER);
        textSize(50);
        text("You Win!",width/2,height/2);
    }
}