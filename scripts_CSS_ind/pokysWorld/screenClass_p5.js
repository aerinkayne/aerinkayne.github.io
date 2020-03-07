class GameScreen {
	constructor(player){
	this.player = player;
	this.P = createVector(player.T.x, player.T.y);
	this.w = width;
	this.h = height;
	this.backgroundObjects = [];
	this.onScreenBGO = [];
	this.foregroundObjects = [];
	this.onScreenFGO = [];
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
		/* location and tracking check
		strokeWeight(2); 
		stroke(200,0,0); 
		fill(200,0,0,this.opacity);  //*/
		push();
		translate(this.P.x, this.P.y);
		fill(this.color);
		rect(0,0,this.w, this.h);
		/*
		strokeWeight(1);
		noStroke();//*/
		pop();
	}
	sortArrFromIndexByProp(fromIndex, arr, str){
		let holder;
		for (let i = fromIndex; i < arr.length; i++){
			for (let j = i+1; j < arr.length; j++) {
				if (arr[j][str] < arr[i][str]){ 
					holder = arr[i];
					arr[i] = arr[j];
					arr[j] = holder;
				}
			}
		}
	}
	addObjectsToArr(number, arr, obj, scaleMin, scaleMax){
		let startIndex = arr.length;
		while(number>0){
		arr.push(new obj(random(this.P.x,(this.P.x+this.w)), random(this.P.y,(this.P.y+this.h)), scaleMin, scaleMax));
		number--;
		}
		this.sortArrFromIndexByProp(startIndex, arr, "w");
	}
	populateArrays(game){  //todo: need to pass number of and scale range 
		if (game.levelData.levelEffects.includes("snow")){
			let i = game.levelData.levelEffects.indexOf("snow");
			//console.log(i, game.levelData.howManyEffects[i]);
			this.addObjectsToArr(game.levelData.numBGEffects[i], this.backgroundObjects, Snowflake, 0.5, 1);
			this.addObjectsToArr(game.levelData.numFGEffects[i], this.foregroundObjects, Snowflake, 1, 1);
		}
		if (game.levelData.levelEffects.includes("rain")){
			let i = game.levelData.levelEffects.indexOf("rain");
			//console.log(i, game.levelData.howManyEffects[i]);
			this.addObjectsToArr(game.levelData.numBGEffects[i], this.backgroundObjects, Raindrop, 0.5, 1);
			this.addObjectsToArr(game.levelData.numFGEffects[i], this.foregroundObjects, Raindrop, 1, 1);
		}
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
	this.V = createVector(random(-0.5,0.5), 1.2*this.scale);
	this.w = 5*this.scale;  //max size
	this.h = 5*this.scale;
	this.opacity = 255*this.scale;
	}
	updatePosition(gameScreen){
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
		this.w = 2*this.V.x;
		this.h = 2*this.V.y;
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