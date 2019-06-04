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
var game;

function preload(){
	//load spritesheets
	sprite1 = loadImage("sprites/spritesheet1.png");
}


function setup() {
    createCanvas(600, 400);
	frameRate(50);

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
	imgKey = sprite1.get(100, 200, 50, 50);
	imgPortal = sprite1.get(100, 250, 50, 50);
	imgFlower = sprite1.get(150, 0, 50, 50);
	
	//def player
	players.push(new Player(0,0,28,28));  // 0.7 * tile size

	//def game
	game=new Game(players[0]);
}



function keyPressed(){keys[keyCode]=true;}   
function keyReleased(){keys[keyCode]=false;}
  




function draw() {
	if (game.mapLoaded === "mapInitial"){game.loadMap();} //only load map once here
	
    if(state==="inGame"){
        game.runGame();
    }
    if(state==="dead"){
		game.clickRestart();
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