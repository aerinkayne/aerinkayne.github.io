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

	drawScreen(){  //only called in game loop if this.opacity is not 0.
		//called after matrix reset, so no translation used.
		fill(this.color[0], this.color[1], this.color[2], this.opacity);
		rect(0,0,this.w, this.h);
	}
}