class GameScreen {
	constructor(player){
	this.player = player;
	this.P = createVector(player.T.x, player.T.y);
	this.w = width;
	this.h = height;
	this.backgroundObjects = [];
	this.foregroundObjects = [];
	this.opacity = 0;  
	this.color = [255,255,255, this.opacity];
	this.setup = false;
	}

	isOnScreen(obj){
		return  obj.P.x < this.P.x + this.w && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + this.h && obj.P.y + obj.h > this.P.y;
	}
	
	updatePosition(){
		this.P.x = this.player.T.x; 
		this.P.y = this.player.T.y;		
	}
	
	drawScreen(){
		push();
		translate(this.P.x, this.P.y);
		fill(this.color[0], this.color[1], this.color[2], this.opacity);
		rect(0,0,this.w, this.h);
		pop();
	}

	populateArrays(game){  
		let tempArrB = [];
		let tempArrF = [];
		let obj;
		game.levelData.levelEffects.forEach((effect, index) => {  
			let numB = game.levelData.numBGEffects[index];
			let numF = game.levelData.numFGEffects[index];
			
			if (effect ==="snow"){obj = Snowflake;}
			else if (effect ==="rain"){obj = Raindrop;}

			while(numB > 0){
				tempArrB.push(new obj(random(this.P.x,(this.P.x+this.w)), random(this.P.y,(this.P.y+this.h)), 0.5, 1));
				numB--;
			}
			while(numF > 0){
				tempArrF.push(new obj(random(this.P.x,(this.P.x+this.w)), random(this.P.y,(this.P.y+this.h)), 1, 1));
				numF--;
			}
		}); 

		tempArrB.sort((a, b) => (a.w > b.w ? 1 : -1));
		this.backgroundObjects = this.backgroundObjects.concat(tempArrB);
		this.foregroundObjects = this.foregroundObjects.concat(tempArrF);
		this.setup = true;
	}

	drawBGObjects(game){
		this.backgroundObjects.forEach(obj => {
			obj.draw();
			if(!game.paused){
				obj.updatePosition(this);
				obj.checkBounds(this);
			}
		});
	}
	drawFGObjects(game){
		this.foregroundObjects.forEach(obj => {
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
	this.opacity = 130 + 255*this.scale/2;
	}
	updatePosition(){
		this.P.add(this.V);
	}
	draw(){
		fill(255,255,255,this.opacity);
		push();
		translate(this.P.x, this.P.y);
		ellipse(0,0,random(this.w-3, this.w), random(this.h-3, this.h));
		pop();
	}
	checkBounds(gameScreen){
		if (this.P.x + this.w/2 < gameScreen.P.x){
			this.P.x = gameScreen.P.x + gameScreen.w + this.w/2;
		}
		if (this.P.x - this.w/2 > gameScreen.P.x + gameScreen.w){
			this.P.x = gameScreen.P.x - this.w/2;
		}
		if (this.P.y + this.h/2 < gameScreen.P.y){
			this.P.y = gameScreen.P.y + gameScreen.h + this.h/2;
		}
		if (this.P.y - this.h/2 > gameScreen.P.y + gameScreen.h){
			this.P.y = gameScreen.P.y - this.h/2;
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
	}
	checkBounds(gameScreen){
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