var state;  //main loop conditions
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

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprite1 = loadImage("sprites/spritesheet1.png");
	soundKey = loadSound("sounds/clink1.mp3");
	soundHeart = loadSound("sounds/243701__ertfelda__correct.wav");
	soundJump = loadSound("sounds/420668__sypherzent__basic-melee-swing-miss-whoosh.wav");
	soundJump.setVolume(0.4);
	soundSpike = loadSound("sounds/344131__thebuilder15__sword-slice.wav");
	
	sScapeW = loadSound("sounds/soundscapes/320447__ellary__soundscape-find-nothing.mp3");
	sScapeW.setVolume(0.4);
	sScapeSpr = loadSound("sounds/soundscapes/325647__shadydave__expressions-of-the-mind-piano-loop.mp3");
	sScapeSpr.setVolume(0.4);
	sScapeSummer = loadSound("sounds/soundscapes/370293__mrthenoronha__water-game-theme-loop.wav");
	sScapeSummer.setVolume(0.4);
	sScapeF = loadSound("sounds/soundscapes/468407__onderwish__sci-fi-survival-dreamscape.mp3");
	sScapeF.setVolume(0.4);
}


function setup() {
    var c = createCanvas(600, 400);
	c.parent('cParent');
	frameRate(60);

	state="inGame";  //game state
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

	imgHeart = sprite1.get(100,50,50,50);
	imgR1 = sprite1.get(0, 200, 50, 50);
	imgR2 = sprite1.get(50, 200, 50, 50);
	imgR3 = sprite1.get(0,250,50,50);
	imgR4 = sprite1.get(50,250,50,50);
	imgClSide = sprite1.get(200,0,50,50); //61519
	imgClMid = sprite1.get(250,0,50,50);  //61519
	imgL1 = sprite1.get(200, 50, 50,50);  //61519
	imgL2 = sprite1.get(250, 50, 50,50);  //61519
	imgPot = sprite1.get(100,100,50,50); //61519
	imgKey = sprite1.get(100, 200, 50, 50);
	imgPortal = sprite1.get(100, 250, 50, 50);
	imgFlower = sprite1.get(150, 0, 50, 50);
	imgFlower2 = sprite1.get(150, 50, 50, 50); //61619
	imgFossil = sprite1.get(200, 100, 50, 50); //61619
	
	
	//def player
	players.push(new Player(0,0,28,28));  // 0.7 * tile size

	//def game
	game=new Game(players[0]);
}



function keyPressed(){keys[keyCode]=true;}   
function keyReleased(){keys[keyCode]=false;}
  




function draw() {
	if (game.mapLoaded === "mapInitial"){
		game.loadMap();
		} //only load map once here
	
    if(state==="inGame"){
        game.runGame();
    }
    if(state==="dead"){
		game.objectHandler.sScape[game.currentLevel].stop();
		game.clickToRestart();
    }
    if(state==="win"){
        fill(0, 200, 0,1);
        noStroke();
        rect(0,0,width,height);
        fill(0, 0, 0);
        textAlign(CENTER,CENTER);
        textSize(50);
        text("You Win!",width/2,height/2);
    }
}