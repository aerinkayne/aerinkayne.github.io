let pokyGame;
let spriteSheet;
let sprDirt1, sprDirt2, sprDirt3, sprDirt4, sprIceT1, sprIceT2, sprIce1, sprIce2, sprVine1; 
let sprVineT, sprCloudL1, sprCloudR1, sprCloudM1, sprCloudL2, sprCloudR2, sprCloudM2;
let sprMoveIce;

let pokyRunR1, pokyRunR2, pokyRunL1, pokyRunL2, pokyJumpR, pokyJumpL, pokyClimb1, pokyClimb2;



function preload(){
	//load spritesheets and sounds (sounds with user names are from Freesound.org)
	spriteSheet = loadImage("scripts_CSS_ind/pokysWorld/assets/sprites/sprites1.png");
	loadImage("scripts_CSS_ind/pokysWorld/assets/sprites/BG0.png", 
		asset=> {levelData[0].levelBackgroundImages[0].img = asset});
	loadImage("scripts_CSS_ind/pokysWorld/assets/sprites/BG1.png", 
		asset=> {levelData[0].levelBackgroundImages[1].img = asset});
	loadImage("scripts_CSS_ind/pokysWorld/assets/sprites/BG2.png", 
		asset=> {levelData[0].levelBackgroundImages[2].img = asset});
}

function setup(){
	let c = createCanvas(500,400);
	c.parent('cParent');
	frameRate(60);
	
	//sprites
	sprGrass1 = spriteSheet.get(0,0,50,15); 
	sprGrass2 = spriteSheet.get(50,0,50,15);
	sprGrass3 = spriteSheet.get(100,0,50,15);
	sprDirt1 = spriteSheet.get(0,50,50,50);
	sprDirt2 = spriteSheet.get(50,50,50,50);
	sprDirt3 = spriteSheet.get(100,50,50,50);
	sprDirt4 = spriteSheet.get(150,50,50,50);
	sprRockT1 = spriteSheet.get(150,150,50,50);
	sprRockT2 = spriteSheet.get(200,150,50,50);
	sprRock1 = spriteSheet.get(150,200,50,50);
	sprRock2 = spriteSheet.get(200,200,50,50);
	sprIceT1 = spriteSheet.get(0,100,50,50);
	sprIceT2 = spriteSheet.get(50,100,50,50);
	sprIce1 = spriteSheet.get(0,150,50,50);
	sprIce2 = spriteSheet.get(50,150,50,50);
	sprVine1 = spriteSheet.get(250,0,50,50);
	sprVineT = spriteSheet.get(300,0,50,50);
	sprCloudL1 = spriteSheet.get(0,200,50,50);
	sprCloudM1 = spriteSheet.get(50,200,50,50);
	sprCloudR1 = spriteSheet.get(100,200,50,50);
	sprCloudL2 = spriteSheet.get(0,250,50,50);
	sprCloudM2 = spriteSheet.get(50,250,50,50);
	sprCloudR2 = spriteSheet.get(100,250,50,50);
	sprBricks = spriteSheet.get(100,150,50,50);
	sprClover1 = spriteSheet.get(350,225,50,25);
	sprWood1 = spriteSheet.get(100,100,50,50);
	sprWood2 = spriteSheet.get(100,150,50,50);
	sprBeam = spriteSheet.get(200,0,25,50);
	sprWindow = spriteSheet.get(225,0,25,50);
	sprMoveIce = spriteSheet.get(0,30,75,20);
	sprMoveCloud = spriteSheet.get(350,0,70,40);
	sprHeart1 = spriteSheet.get(80,18,33,30);
	sprHeart2 = spriteSheet.get(115,18,33,30);
	
	pokyRunR1 = spriteSheet.get(207,100, 40,50);
	pokyRunR2 = spriteSheet.get(252,100, 40,50);
	pokyRunL1 = spriteSheet.get(207,50, 40,50);
	pokyRunL2 = spriteSheet.get(252,50, 40,50);
	pokyJumpR = spriteSheet.get(297,100, 40,50);
	pokyJumpL = spriteSheet.get(297,50, 40,50);
	pokySwimR1 = spriteSheet.get(350,104, 47,42);
	pokySwimL1 = spriteSheet.get(400,104, 47,42);
	pokySwimR2 = spriteSheet.get(350,149, 47,42);
	pokySwimL2 = spriteSheet.get(400,149, 47,42);
	pokyClimb1 = spriteSheet.get(342,50, 40,50);
	pokyClimb2 = spriteSheet.get(385,50, 40,50);
	
	pokyGame = new Game();
}	


function keyPressed(){
	if (pokyGame.player.movements.hasOwnProperty(keyCode)){
		pokyGame.player.movements[keyCode] = true;  
	}
}		
function keyReleased(){
	if (pokyGame.player.movements.hasOwnProperty(keyCode)){
		pokyGame.player.movements[keyCode] = false;
	}
}


function draw(){
	pokyGame.manageScenes();
}
