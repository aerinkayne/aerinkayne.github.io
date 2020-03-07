let width = 500; let height = 400;
let maxNumNew = 10;
let fishAdded = 0;
let horizon = height*17/20;
let waves;
let arrPlants = [];
let arrFrontPlants = [];
let arrFish = [];
let arrNewFish = [];
let arrBubbles = [];
let imgRocks, imgRocksGround, rocks, rocksG;


function preload(){
	imgRocks = loadImage("scripts_CSS_ind/fishtank/assets/sprites/pex55692_NeelUpadhyay.png");
	imgRocksGround = loadImage("scripts_CSS_ind/fishtank/assets/sprites/pex3560027_MattHardy.png");
}


function setup(){
  let c = createCanvas(500,400);
  c.parent('cParent');
  
  rocks = imgRocks.get(0,0,imgRocks.width, imgRocks.height);
  rocksG = imgRocksGround.get(0,0,imgRocksGround.width, imgRocksGround.height);
  
  waves = new Waves(0, height/10, width/4, height/65);
  addObjectsToArr(10, arrPlants, Plant);
  sortArrByProp(arrPlants, 'scale');
  
  addObjectsToArr(1, arrFish, Fish);
  addObjectsToArr(3, arrBubbles, Bubble);
}  


function mouseClicked(){
  if (mouseY > height/8 && mouseY < height*5/6 && fishAdded < maxNumNew){
    fishAdded++;
    arrNewFish.push(new Fish(mouseX, mouseY));
  }
}

function draw(){
	fill(215,245,255);
	rect(0,0,width,height/10);
	gradientH([200,235,255],[25,100,175], height-5*height/20, 3, height/10);
	gradientH([80,140,200],[255, 255, 215], height-horizon, 2, horizon );
	waves.draw();
	//change rel to canvas
	image(rocksG, 0, height-height/6, width, height/6);
	
	arrPlants.forEach(obj=>{obj.draw();});
	arrFish.forEach(obj=>{obj.draw();});
	if(arrNewFish.length){
		arrNewFish.forEach(fish=> {fish.draw();});
	}
	//change rel to canvas
	image(rocks, 3/5*width, height-height/2, width/3, height/2);
	arrBubbles.forEach(obj=>{obj.draw();});
}