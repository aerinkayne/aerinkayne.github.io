class GameScreen {
	constructor(){  
	this.P = createVector(0, 0);  
	this.w = width;
	this.h = height;
	this.backgroundObjects = [];
	this.foregroundObjects = [];
	this.opacity = 0; 
 	this.color = [0,0,0]; 
	}

	isOnScreen(obj){
		return  obj.P.x < this.P.x + this.w && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + this.h && obj.P.y + obj.h > this.P.y;
	}
	
	updatePosition(T){  //vector of player translation values 
		this.P.x = T.x; 
		this.P.y = T.y;		
	}
	
	drawScreen(){  
		push();
		translate(this.P.x, this.P.y);
		fill(this.color[0], this.color[1], this.color[2], this.opacity);
		rect(0,0,this.w, this.h);
		pop();
	}

	shadeSky(game){
		let rectColor;
		let H = height/40;
		let num = height/H;
  		let C1 = color(game.levelData[game.currentLevel].skyStart);
  		let C2 = color(game.levelData[game.currentLevel].skyEnd);
  		noStroke();
		for (let i = 0; i < num; i++){
			rectColor = lerpColor(C1, C2, i/num);
			fill(rectColor);
			rect(0,i*H,width,H);
		}
	}

	drawBackgrounds(game){
		game.levelData[game.currentLevel].levelBackgroundImages.forEach(config => {
			//x coord, y coord, width, total height onscreen
			let bg = config.img.get(config.rate*game.player.T.x, 0, width, ceil(min(height-config.Y+config.rate*game.player.T.y, config.img.height)));
			image(bg, 0, config.Y-config.rate*game.player.T.y, bg.width, bg.height);
			/*noFill();  //uncomment to check get values and img draw locations
			strokeWeight(2);
			stroke(255);
			rect(0, config.Y-config.rate*this.player.T.y, bg.width, bg.height);
			strokeWeight(1);
			noStroke();//*/
		});
	} 

	//call at game setup and new level load.
	populateArrays(game){  
		let tempArrB = [];
		let tempArrF = [];
		let obj;
		game.levelData[game.currentLevel].levelEffects.forEach((effect, index) => {  
			let numB = game.levelData[game.currentLevel].numBGEffects[index];
			let numF = game.levelData[game.currentLevel].numFGEffects[index];
			
			if (effect ==="snow"){obj = Snowflake;}
			else if (effect ==="rain"){obj = Raindrop;}

			while(numB > 0){
				tempArrB.push(new obj(this.P.x + random(this.w), this.P.y + random(this.h), 0.5, 1));
				numB--;
			}
			while(numF > 0){
				tempArrF.push(new obj(this.P.x + random(this.w), this.P.y + random(this.h), 1, 1));
				numF--;
			}
		}); 

		tempArrB.sort((a, b) => (a.w > b.w ? 1 : -1));
		this.backgroundObjects = this.backgroundObjects.concat(tempArrB);
		this.foregroundObjects = this.foregroundObjects.concat(tempArrF);
	}

	drawArrObjects(game, arr){
		arr.forEach(obj => {  
			obj.draw();
			if(!game.paused){
				obj.updatePosition(this);
				obj.checkBounds(this);
			}
		});
	}
}



class Snowflake{
	constructor(x,y, scaleMin, scaleMax){
	this.P = createVector(x,y);
	this.scale = random(scaleMin, scaleMax);
	this.V = createVector(random(-1,1), 2*this.scale);
	this.w = ceil(5*this.scale);  //max size
	this.h = ceil(5*this.scale);
	this.opacity = 130 + 250*this.scale/2;
	}
	updatePosition(){
		this.P.add(this.V);
	}
	draw(){
		noStroke();
		fill(255,255,255,this.opacity);
		push();
		translate(this.P.x, this.P.y);
		ellipse(0,0,this.w/2+random(this.w/2), this.h/2+random(this.h/2));
		pop();
	}
	checkBounds(gameScreen){  //used w instead of w/2 to simplify.
  		if (this.P.x + this.w < gameScreen.P.x){
			this.P.x = gameScreen.P.x + gameScreen.w + this.w;
		}
		if (this.P.x - this.w > gameScreen.P.x + gameScreen.w){
			this.P.x = gameScreen.P.x - this.w;
		}
		if (this.P.y + this.h < gameScreen.P.y){
			this.P.y = gameScreen.P.y + gameScreen.h + this.h;
		}
		if (this.P.y - this.h > gameScreen.P.y + gameScreen.h){
			this.P.y = gameScreen.P.y - this.h;
		}
	}
}

class Raindrop extends Snowflake{
	constructor(x,y, scaleMin, scaleMax){
		super(x,y, scaleMin, scaleMax);
		this.V = createVector(1.5*this.scale, 10*this.scale);
		this.w = ceil(2*this.V.x);
		this.h = ceil(2*this.V.y);
		this.opacity = 120*this.scale;
	}
	draw(){
		stroke(175,235,255,this.opacity);
		strokeWeight(this.scale);
		push();
		translate(this.P.x, this.P.y);
		line(0,0, this.w, this.h);
		pop();
  noStroke();
	}
}

/*
class Bird extends Snowflake(){
 	constructor(x,y, scaleMin, scaleMax){
		super(x,y, scaleMin, scaleMax);
 }
 draw(){
  push();
  stroke(0,0,0, this.opacity);
  point(0,0);
  pop();
 }
}
*/