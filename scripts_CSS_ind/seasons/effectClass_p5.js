class GameScreen{ 
constructor(game){ //levelW, levelH, player){ 
		this.levelW = game.levelW; 
		this.levelH = game.levelH;
		this.player = game.player;
		this.P = createVector(this.player.T.x, this.player.T.y);
		this.currentLevel = game.currentLevel;
		this.w = width;
		this.h = height;
		this.bgObj=[];
		this.fgObj=[];
		this.hills=[];
		this.opacity = 5; 		//TODO finish setup
		this.color = [90,0,0];  //TODO finish setup
		this.setup = false;
	}

	isOnScreen(obj){  //for maptile and other obj onscreen check
		return  obj.P.x < this.P.x + this.w && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + this.h && obj.P.y + obj.h > this.P.y;
	}

	updatePosition(){
		this.P.x = this.player.T.x; 
		this.P.y = this.player.T.y;		
	}

	initHills(speed){  				//creates point vectors for hill peak locations    
		let incX = this.levelW/25;  //increment X; hill peak spacing 	
		for (let j=0; j<3; j++){ 	//make #hills
			let arrPV = [];  		//for array of point vectors for each of the hills
			incX+=75*j;      		//increase incX val for each loop of hills
				
			for (let i = 0; i*incX < this.levelW; i++){  
				arrPV.push(createVector (i*incX, height/4 + incX/1.5 + random(-15-20*j, 15+20*j)));
			}
			this.hills.push(new Hills(this, arrPV, speed));  //this for levelW, levelH, player
			speed*=2.25; //increase the speed (translate rate) for each loop of hills
		}
	}

	shadeSky(game){
		noStroke();
		let H = 15;
		let C1 = color(game.levelData[game.currentLevel].skyStart);
		let C2 = color(game.levelData[game.currentLevel].skyEnd);
			for (let i = 0; i*0.03 < 1; i++){
				let shift = lerpColor(C1, C2, i*0.03);
				fill(shift);
				rect(0,i*H,width,H);
			}	
	}

	effectSetup(game){
		//create objects if not set up
		this.initHills(0.15);
		let numB = game.levelData[game.currentLevel].numBGeffects;
		let numF = game.levelData[game.currentLevel].numFGeffects;
		let effect = game.levelData[game.currentLevel].levelEffect;
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
		this.setup = true;
	}
		
	drawHills(game){
		this.hills.forEach((hill, i)=> {
			let lake = false;
			if (i===0){lake = true;}  //draws a lake in front of first hill if true in levelData
			let hillColor = game.levelData[game.currentLevel].hillColors[i];
			hill.draw(hillColor, lake);
		});
	}

	drawArrObjects(arr){
		arr.forEach(obj=>{
			obj.update(this);
			obj.draw();
		});
	}

	drawScreen(){  //only called if this.opacity is not 0.
		push();
		translate(this.P.x, this.P.y);
		fill(this.color[0], this.color[1], this.color[2], this.opacity);
		rect(0,0,this.w, this.h);
		pop();
	}
}