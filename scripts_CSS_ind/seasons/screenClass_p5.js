class GameScreen{ 
constructor(game){ 
		this.game = game;
		this.P = createVector(game.player.T.x, game.player.T.y);
		this.w = width;
		this.h = height;
		this.bgObj=[];
		this.fgObj=[];
		this.hills=[];
		this.opacity = 0; 		 
		this.color = [200,0,0];  
		this.setup = this.effectSetup();  
	}

	isOnScreen(obj){  //for maptile and other obj onscreen checks
		return  obj.P.x < this.P.x + this.w && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + this.h && obj.P.y + obj.h > this.P.y;
	}

	updatePosition(){
		this.P.x = this.game.player.T.x; 
		this.P.y = this.game.player.T.y;		
	}

	initHills(speed){  					//creates point vectors for hill peak locations    
		let incX = this.game.levelW/25; //incX is distance between hill peaks 	
		for (let j=0; j<3; j++){ 		//number of hills.  0 is background.
			let arrPV = [];  			//for array of point vectors
			incX+=75*j;      			//incX increases for each loop of hills
				
			for (let i = 0; i*incX < this.game.levelW; i++){  
				arrPV.push(createVector (i*incX, height/4 + incX/1.5 + random(-15-20*j, 15+20*j)));
			}
			this.hills.push(new Hills(this.game, arrPV, speed));
			speed*=2.25; 				//speed (translate rate) increased for each hill
		}
	}

	shadeSky(){
		noStroke();
		let H = 15;
		let C1 = color(this.game.levelData[this.game.currentLevel].skyStart);
		let C2 = color(this.game.levelData[this.game.currentLevel].skyEnd);
			for (let i = 0; i*0.03 < 1; i++){
				let shift = lerpColor(C1, C2, i*0.03);
				fill(shift);
				rect(0,i*H,width,H);
			}	
	}

	effectSetup(){
		//creates objects at construction
		this.initHills(0.15);
		let numB = this.game.levelData[this.game.currentLevel].numBGeffects;
		let numF = this.game.levelData[this.game.currentLevel].numFGeffects;
		let effect = this.game.levelData[this.game.currentLevel].levelEffect;
		let obj;
			if (effect === "snow")		{obj = Snowflake;}
			else if (effect === "rain") {obj = Raindrop;}
			else if (effect === "leaf") {obj = Leaf;}

		while (numB > 0){
			this.bgObj.push(new obj(this.P.x + random(this.w), this.P.y + random(this.h), 0.4, 1));
			numB--;
		}
		while (numF > 0){
			this.fgObj.push(new obj(this.P.x + random(this.w), this.P.y + random(this.h), 1, 1));
			numF--;
		} 
	}
		
	drawHills(){
		this.hills.forEach((hill, i)=> {
			let lake = false;
			if (i===0){lake = true;}  //draws a lake in front of back hill if true in levelData
			let hillColor = this.game.levelData[this.game.currentLevel].hillColors[i];
			hill.draw(hillColor, lake);
		});
	}

	drawArrObjects(arr){
		arr.forEach(obj=>{
			obj.update(this);
			obj.draw();
		});
	}

	drawScreen(){  
		//called after matrix reset
		if (this.opacity){
			fill(this.color[0], this.color[1], this.color[2], this.opacity);
			rect(0,0,this.w, this.h);
		}
	}
}


//objects associated with screen class (snow, rain, leaves, hills, birds).  
class Snowflake{
	constructor(x,y, min, max){
		this.P = createVector(x,y);
		this.scale = random(min, max);  
		this.V = createVector(this.scale*random(-1,1), this.scale*2);
		this.w = this.h = ceil(5*this.scale);  //for bounds check
		this.opacity = 75 + 180*this.scale;
		
	}
	update(gameScreen){  
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
		this.P.add(this.V);

	}
	draw() {
		noStroke();
		fill(255, 255, 255, this.opacity);
		push();
		translate(this.P.x, this.P.y);
		ellipse(0,0,this.w/2+random(this.w/2), this.h/2+random(this.h/2));
		pop();
	}
}
class Raindrop extends Snowflake{
	constructor(x,y, min, max){
		super(x,y, min, max);
		this.V = createVector(4*this.scale,12*this.scale);
		this.opacity = 75 + 100*this.scale;
	}
	draw() {
		stroke(175, 215, 255, this.opacity);
		push();
		translate(this.P.x, this.P.y);
		line(0,0,this.V.x,this.V.y);
		pop();
	}
}
class Leaf extends Snowflake{
	constructor(x,y){
		super(x,y);
		this.V = createVector(random(-1,1), random(0.5, 1));
		this.w = random(3.5, 11); 
		this.h = random(3.5, 11);
		this.angle = 0;
		this.spinSpeed = random(1,5);
		this.color = [random(150,230), random(50, 200), random(25, 50)];
	}
	draw() {
		this.angle += this.spinSpeed; //updating spin here
		noStroke();
		fill(this.color);
		push();
		translate(this.P.x,this.P.y);
		rotate(radians(this.angle));
		ellipse(0,0, this.w, this.h);
		pop();
	}
}
class Hills {  
	constructor(game, arrPV, speed){ 
		this.arrPV = arrPV;
		this.levelW = game.levelW;
		this.levelH = game.levelH;
		this.player = game.player;
		this.currentLevel = game.currentLevel;
		this.speed = speed;
	}
	draw(color, lakeBool) {  //currently called from screenEffects 
		push();
		//parallax effect 
		translate(-this.speed*this.player.T.x, 0);
		//subtract height because T is h/2 less than P, and only increments until h/2 before levelH
		translate(0, this.speed*(this.levelH-height-this.player.T.y));
		
		fill(color);
		beginShape();
		curveVertex(0, this.levelH);
		curveVertex(0, this.levelH);
		curveVertex(0, this.arrPV[0].y); 
		
			for (let i = 0; i < this.arrPV.length; i++){
				curveVertex(this.arrPV[i].x,  this.arrPV[i].y); 
			}
			
		curveVertex(this.levelW, this.arrPV[this.arrPV.length-1].y);
		curveVertex(this.levelW, this.levelH);
		curveVertex(this.levelW, this.levelH);
		endShape(CLOSE); 
		
		//draw a lake effect if it has been set to true.  TODO needs rework.
		if (levelData[this.currentLevel].hasLake && lakeBool){
			fill(30, 100, 150);
			rect(this.arrPV[0].x, this.arrPV[0].y+66, this.levelW, this.levelH-this.arrPV[0].y);
			fill(150, 190, 220, 60);  
				for (let i = 1; i<6; i++){
					rect(0, this.arrPV[0].y+66, this.levelW, height/(5+5*i*i));
				}
		}
		pop();
	}
}