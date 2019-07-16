var levelW, levelH;
var bg_stars; 
var invGame;
var btnStart, btnPause, btnRestart, btnSel1, btnSel2, btnSel3;
var ship;
var bads = [];
var pups = [];

var sprBadR1, sprBadR2;
var sprBadG1, sprBadG2;
var sprBadB1, sprBadB2;
var sprBadBr1, sprBadBr2;

var sPup, sPhaser, sEnmDmg, sEnmDestr, sEnmSpawn, sShipDestr;
var sEnmD2;
var sEnmAtt, sEnmAtt2;

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprites = loadImage("assets/sprites/invSprites1.png");
	
	sPup = loadSound("assets/sounds/UI/171527__leszek-szary__menu-click.wav");
	sPhaser = loadSound("assets/sounds/phasers/phaserPulse.mp3");
	sPhaser.setVolume(0.5);
	sPhaserG = loadSound("assets/sounds/phasers/159230__noirenex__deepscan.mp3");
	sPhaserG.setVolume(0.5);
	sPhaserB = loadSound("assets/sounds/phasers/67426__aji__pair03.wav");
	sPhaserY = loadSound("assets/sounds/phasers/82745__sikoses__stm1-some-bass.mp3");
	
	sEnmDmg = loadSound("assets/sounds/alien/117740__donalfonso__kurzschluss.wav");
	sEnmD2 = loadSound("assets/sounds/alien/205753__scorpion67890__surge-leech-1.wav");
	sEnmDestr = loadSound("assets/sounds/350976__cabled-mess__boom-c-01.wav");
	sEnmSpawn = loadSound("assets/sounds/alien/ambientIntro.wav");
	sEnmAtt = loadSound("assets/sounds/alien/163095__fantozzi__ftz-gc-118-phaserattack1.wav");
	sEnmAtt.setVolume(0.3);
	sEnmAtt2 = loadSound("assets/sounds/alien/61818__tim-kahn__hard-kick.wav");

	
	sShipDestr = loadSound("assets/sounds/397702__mrthenoronha__explosion-8-bit.wav");
}
	
function setup(){
	var c = createCanvas(600,400);
	c.parent('cParent');
	frameRate(60);
	levelW = 750;
	levelH = 400;
	sprBadR1 = sprites.get(50,250,132,81);
	sprBadR2 = sprites.get(200,250,132,81);
	sprBadG1 = sprites.get(50,50,132,81);
	sprBadG2 = sprites.get(200,50,132,81);
	sprBadB1 = sprites.get(50,150,132,81);
	sprBadB2 = sprites.get(200,150,132,81);
	sprBadBr1 = sprites.get(50,350,132,81);
	sprBadBr2 = sprites.get(200,350,132,81);
	
	invGame = new Game();
	ship = new Ship(width/2-20, height-40, 40,40);
	bg_stars = new StarField(150); 
	sortArrByProp(bg_stars.stars, "s");
	btnStart = new Button(width/2-50,height/2-25,100,50,5, "Start");
	btnPause = new Button(5, height-25, 40, 20, 4, "Pause");
}	

function keyPressed(){
	if (keyCode === RIGHT_ARROW){
		ship.move[0] = true;
	}
	if (keyCode === LEFT_ARROW){
		ship.move[1] = true;
	}
	if (keyCode === UP_ARROW){
		ship.move[2] = true;
	}
	if (keyCode === DOWN_ARROW){
		ship.move[3] = true;
	}
	
}
function keyReleased(){
	if (keyCode === RIGHT_ARROW){
		ship.move[0] = false;
	}
	if (keyCode === LEFT_ARROW){
		ship.move[1] = false;
	}
	if (keyCode === UP_ARROW){
		ship.move[2] = false;
	}
	if (keyCode === DOWN_ARROW){
		ship.move[3] = false;
	}
}


function mouseClicked(){
    if (invGame.gameState === "gameStart" && btnStart.isClicked(mouseX,mouseY)){
			invGame.gameState = "inGame";
	}
    else if (invGame.gameState === "inGame" && btnPause.isClicked(mouseX,mouseY)){
		btnPause.txt = "# #";
		invGame.gameState = "gamePaused";
	}
	
	else if (invGame.gameState === "gamePaused" && btnPause.isClicked(mouseX,mouseY)){
		btnPause.txt = "Pause";
		invGame.gameState = "inGame";
	}
	
	else if (invGame.gameState === "gameOver" && btnStart.isClicked(mouseX,mouseY)) {
		ship = new Ship(width/2-20, height-40, 40,40);
		invGame = new Game();
	}
	
	
}  



function draw(){
	invGame.manageScenes();
	
}
