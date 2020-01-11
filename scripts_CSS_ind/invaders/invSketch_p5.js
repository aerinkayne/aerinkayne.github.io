let levelW, levelH, bordL, bordR;  //define after game created
let bg_stars; 
let invGame;
let btnStart, btnPause;
let ship;
let bads = [];
let pups = [];

let sprites2;
let sprBadR1, sprBadR2;
let sprBadG1, sprBadG2;
let sprBadB1, sprBadB2;
let sprBadBr1, sprBadBr2;
let sprCrim1, sprCrim2, sprCrim3;
let eye1, eye2, eyeClosed;
let sprShip1, sprShipF;

let sPup, sPhaser, sPhaserB, sPhaserG, sPhaserY, sShipDestr;
let sEnmSpawn, sEnmAtt, sEnmAtt2, sEnmCrimAtt; 
let sEnmDmg, sEnmDestr, sEnmD2;
let startLaser, redLaser, blueLaser, greenPulse, orangeLaser, homingMissile, spreader;

function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	sprites2 = loadImage("scripts_CSS_ind/invaders/assets/sprites/invSprites2.png");
	
	sPup = loadSound("scripts_CSS_ind/invaders/assets/sounds/UI/171527__leszek-szary__menu-click.wav");
	
	sPhaser = loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/phaserPulse.mp3");
	sPhaser.setVolume(0.2);
	sPhaserB = loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/337660__five-step__metallic.mp3");
	sPhaserG = loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/159230__noirenex__deepscan.mp3");
	sPhaserG.setVolume(0.5);
	sPhaserY = loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/82745__sikoses__stm1-some-bass.mp3");
	
	sEnmDmg = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/117740__donalfonso__kurzschluss.wav");
	sEnmD2 = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/205753__scorpion67890__surge-leech-1.wav");

	sEnmSpawn = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/ambientIntro.wav");
	sEnmAtt = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/163095__fantozzi__ftz-gc-118-phaserattack1.wav");
	sEnmCrimAtt = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/146732__leszek-szary__creature.wav");
	sEnmAtt.setVolume(0.3);
	sEnmAtt2 = loadSound("scripts_CSS_ind/invaders/assets/sounds/alien/61818__tim-kahn__hard-kick.wav");

	sEnmDestr = loadSound("scripts_CSS_ind/invaders/assets/sounds/dmg/350976__cabled-mess__boom-c-01.wav");
	sShipDestr = loadSound("scripts_CSS_ind/invaders/assets/sounds/dmg/397702__mrthenoronha__explosion-8-bit.wav");
	
	//copy values that need to change in WeaponShot creation; don't change them here!
	startLaser = {
		name: "startLaser",
		w: 6,
		h: 10,
		speed: 10,
		weaponColor: [0,150,175],
		pushNumber: 1,
		hits: 1,  
		rechargeTime: 16,
		damage: 15,
		targeted: false,
		weaponSound: sPhaser
	};
	redLaser = {
		name: "redLaser",
		w: 4,
		h: 12,
		speed: 7.5,
		weaponColor: [200,0,0],
		pushNumber: 1,
		hits: 1,
		rechargeTime: 8,
		damage: 15,
		targeted: false,
		weaponSound: sPhaser
	};
	blueLaser = {
		name: "blueLaser",
		w: 9,
		h: 20,
		speed: 6,
		weaponColor: [100,50,220],
		pushNumber: 1,
		hits: 2,
		rechargeTime: 35,
		damage: 30,
		targeted: false,
		weaponSound: sPhaserB
	};
	greenPulse = {
		name: "greenPulse",
		w: 16,
		h: 9,
		speed: 5,
		weaponColor: [0,175,155],
		pushNumber: 1,
		hits: 2,
		rechargeTime: 25,
		damage: 35,
		targeted: true, 
		trackTime: 5,
		weaponSound: sPhaserG
	};
	orangeLaser = {
		name: "orangeLaser",
		w: 5,
		h: 55,
		speed: 4,
		weaponColor: [200,150,0],
		pushNumber: 1,
		hits: 3,
		rechargeTime: 45,
		damage: 75,
		targeted: false,
		weaponSound: sPhaserY
	};
	homingMissile = {
		name: "homingMissile",
		w: 9,
		h: 9,
		speed: 2,
		weaponColor: [230,0,100],
		pushNumber: 1,
		hits: 1,
		rechargeTime: 40,
		damage: 70,
		targeted: true,
		trackTime: 250,
		weaponSound: sEnmAtt
	};
	spreader = {
		name: "spreader",
		w: 7,
		h: 5,
		speed: 5,
		weaponColor: [200,0,100],
		pushNumber: 4,
		hits: 1,
		spreadAngle: 20,
		rechargeTime: 30,
		damage: 15,
		targeted: false,
		weaponSound: sEnmAtt
	};
	
}
	
function setup(){
	let c = createCanvas(450,375);
	c.parent('cParent');
	frameRate(60);
	imageMode(CENTER);
	
	sprBadR1 = sprites2.get(50,296,128,85);
	sprBadR2 = sprites2.get(200,296,128,85);
	sprBadG1 = sprites2.get(46,46,139,87); 
	sprBadG2 = sprites2.get(196,46,139,87); 
	sprBadB1 = sprites2.get(56,142,120,110);
	sprBadB2 = sprites2.get(205,142,120,110);
	sprBadBr1 = sprites2.get(380,36,127,162);
	sprBadBr2 = sprites2.get(537,36,127,162);
	sprCrim1 = sprites2.get(337,433,132,110);
	sprCrim2 = sprites2.get(337,560,132,110);
	sprCrim3 = sprites2.get(474,508,132,110);
	eye1 = sprites2.get(366,278,150,98);
	eye2 = sprites2.get(535,278,150,98);
	eyeClosed = sprites2.get(535,367,150,98);
	sprShip1 = sprites2.get(50,450,102,123);
	sprShipF = sprites2.get(200,450,102,123);
	
	invGame = new Game();
	levelW = invGame.levelW;
	levelH = invGame.levelH;
	bordL = width/2;
	bordR = levelW - width/2;
	
	ship = new Ship(width/2-35,height-35, 35,35);
	bg_stars = new StarField(150); 
	sortArrByProp(bg_stars.stars, "w");
	btnStart = new Button(width/2-50,height/2-25,100,50,5, "Start");
	btnPause = new Button(5, height-25, 35, 20, 4, "❚❚");
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
		invGame.startGame();
		invGame.gameState = "inGame";
	}
    else if (invGame.gameState === "inGame" && btnPause.isClicked(mouseX,mouseY)){
		btnPause.txtColor = [75,255,200];
		btnPause.txt = "➤";
		invGame.gameState = "gamePaused";
	}
	else if (invGame.gameState === "gamePaused" && btnPause.isClicked(mouseX,mouseY)){
		btnPause.txtColor = [0,0,0];
		btnPause.txt = "❚❚";
		invGame.gameState = "inGame";
	}
	else if (invGame.gameState === "gameOver" && btnStart.isClicked(mouseX,mouseY)) {
		ship = new Ship(width/2-35,height-35, 35,35); 
		invGame = new Game();
	}
}  

function draw(){
	invGame.manageScenes();
}
