class ObjectHandler{ 
	constructor(levelW, levelH, player){ 
		this.levelW = levelW; 
		this.levelH = levelH;
		this.player = player;
		this.setup = false;
		this.bgObj=[];
		this.fgObj=[];
		this.hills=[];
		this.skyStart, this.skyEnd;
		this.hillStart, this.hillMid, this.hillEnd;
		this.sScape = [sScapeW, sScapeSpr, sScapeSummer, sScapeF];
	}
	initHills(speed){  //creates point vectors for hill peak locations    
		var incX = this.levelW/25;  //hill peak spacing
		var speed = speed;  	
		for (var j=0; j<3; j++){ //make #hills
			var arrPV = [];  //array of point vectors for each of the hills
			incX+=75*j;      //increase incX val for each loop of hills
				
			for (var i = 0; i*incX < this.levelW; i++){  
				arrPV.push(createVector (i*incX, height/4+incX/1.5+random(-15-20*j, 15+20*j)));
			}
			this.hills.push(new Hills(arrPV, this.levelW, this.levelH, this.player, speed));
			speed*=2.25; //increase the speed (translate rate) for each loop of hills
		}
	}
	addObj(number, obj){  
		//background array.  Object names: Snowflake, Raindrop, Leaf
		for (var i = 0; i < number; i++){
			this.bgObj.push(new obj(this.player, this.levelW, this.levelH));
		}
		//forground array
		for (var i = 0; i < number/10; i++){
			this.fgObj.push(new obj(this.player, this.levelW, this.levelH));
			//scale size and vel for each as it is added
			this.fgObj[this.fgObj.length-1].SF=1.4;
			this.fgObj[this.fgObj.length-1].V.mult(1.4);
		}
	}
	shadeSky(skyStart, skyEnd){
		noStroke();
		var H = 15;
			for (var i = 0; i*0.03 < 1; i++){
				var shift = lerpColor(skyStart, skyEnd, i*0.03);
				fill(shift);
				rect(0,i*H,width,H);
			}
		
	}
	bgEffects(level){
		if (this.setup === false){
			//make objects if not set up
			this.initHills(0.15);
			if (level === 0){
				this.addObj(160, Snowflake);
				this.skyStart = color(82,149,204);
				this.skyEnd = color(250, 200, 255);
				this.hillStart = color(60,85,130);
				this.hillMid = color(102,147,192);
				this.hillEnd = color(150,200,235);
			}	
			else if (level === 1){
				this.addObj(130, Raindrop);
				this.skyStart = color(70,110,120);
				this.skyEnd = color(242,252,255);
				this.hillStart = color(50,85,85,120);
				this.hillMid = color(75,110,88);
				this.hillEnd = color(85,150,105);
			}
			else if (level === 2){
				//will change to something else
				this.addObj(2, Raindrop);
				this.hills[0].lake = true;
				this.skyStart = color(150, 205, 255);
				this.skyEnd = color(255, 237, 244);
				this.hillStart = color(150, 190, 220);
				this.hillMid = color(105,170,135);
				this.hillEnd = color(130, 200, 130);
			}
			else if (level === 3){
				this.addObj(30, Leaf);
				this.skyStart = color(45, 50, 90);
				this.skyEnd = color(255, 180, 200);
				this.hillStart = color(75, 40, 30);
				this.hillMid = color(90,55,20);
				this.hillEnd = color(135, 75, 30); 
			}
			this.setup = true;
		}	
		//sky
		this.shadeSky(this.skyStart, this.skyEnd);  
		//hills
		for(var i = 0; i < this.hills.length; i++){
			if(i===0){hillColor = this.hillStart;}
			if(i===1){hillColor = this.hillMid;}
			if(i===2){hillColor = this.hillEnd;}
			this.hills[i].draw(hillColor);
		}
		//bgobjects
		for(var i=0; i< this.bgObj.length; i++){
			this.bgObj[i].update();
			this.bgObj[i].draw();
		}
	}	
	fgEffects(level){  
		for(var i=0; i< this.fgObj.length; i++){
			this.fgObj[i].update();
			this.fgObj[i].draw();
		}
	}
}