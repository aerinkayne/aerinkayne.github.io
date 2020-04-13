class EffectsHandler{ 
constructor(game){ //levelW, levelH, player){ 
		this.levelW = game.levelW; 
		this.levelH = game.levelH;
		this.player = game.player;
		this.currentLevel = game.currentLevel;
		this.setup = false;
		this.bgObj=[];
		this.fgObj=[];
		this.hills=[];
		this.transparency = 0; //check this
		this.overlayC = color(255,255,255,this.transparency);  //check this
	}
	initHills(speed){  				//creates point vectors for hill peak locations    
		let incX = this.levelW/25;  //increment X; hill peak spacing 	
		for (let j=0; j<3; j++){ 	//make #hills
			let arrPV = [];  		//for array of point vectors for each of the hills
			incX+=75*j;      		//increase incX val for each loop of hills
				
			for (let i = 0; i*incX < this.levelW; i++){  
				arrPV.push(createVector (i*incX, height/4+incX/1.5+random(-15-20*j, 15+20*j)));
			}
			this.hills.push(new Hills(this, arrPV, speed));  //arrPV, this.levelW, this.levelH, this.player
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

	screenEffects(game){
		//create objects if not set up
		if (this.setup === false){
			this.initHills(0.15);
			let numB = game.levelData[game.currentLevel].numBGeffects;
			let numF = game.levelData[game.currentLevel].numFGeffects;
			let effect = game.levelData[game.currentLevel].levelEffect;
			let obj;
				if (effect === "snow")		{obj = Snowflake;}
				else if (effect === "rain") {obj = Raindrop;}
				else if (effect === "leaf") {obj = Leaf;}

			while (numB > 0){
				this.bgObj.push(new obj(this.player, this.levelW, this.levelH));
				numB--;
			}
			while (numF > 0){
				this.fgObj.push(new obj(this.player, this.levelW, this.levelH));
				numF--;
			} 
			this.setup = true;
		}
		
		//draw sky
		this.shadeSky(game);  

		//draw hills
		this.hills.forEach((hill, i)=> {
			let lake = false;
			if (i===0){lake = true;}
			let hillColor = game.levelData[game.currentLevel].hillColors[i];
			hill.draw(hillColor, lake);
		});

		//bgobjects
		for(let i=0; i< this.bgObj.length; i++){
			this.bgObj[i].update();
			this.bgObj[i].antiCam();
			this.bgObj[i].draw();
		}
	}
	

	fgEffects(){  
		for(let i=0; i< this.fgObj.length; i++){
			this.fgObj[i].update();
			this.fgObj[i].antiCam();
			this.fgObj[i].draw();
		}
	}



}