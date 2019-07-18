//TODO unfuck this whole thing

//handle arrays for background objects (snow, rain, leaves, hills)
class ObjectHandler{ 
	constructor(levelW, levelH, player){ 
		this.levelW = levelW; 
		this.levelH = levelH;
		this.player = player;
		this.bgObj=[];
		this.fgObj=[];
		this.hills=[];
		this.sScape = [sScapeW, sScapeSpr, sScapeSummer, sScapeF];
	}
	//objecthandler is def in game.loadmap as needed.

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
			this.fgObj[this.fgObj.length-1].SF=1.6;
			this.fgObj[this.fgObj.length-1].V.mult(1.6);
		}
	}
	
	shadeSky(colorStart, colorEnd){
			noStroke();
			var H = 15;
			for (var i = 0; i*0.04 < 1; i++){
				var shift = lerpColor(colorStart, colorEnd, i*0.04);
				fill(shift);
				rect(0,i*H,width,H);
			}
	}
	
	season(string){
		var hillColor;
		var skyStart, skyEnd, hillStart, hillMid, hillEnd;
		if (this.hills.length === 0){
			this.initHills(0.15);
		}
		
		if (string === "winter"){
			skyStart = color(82,149,204);
			skyEnd = color(250, 200, 255);
			hillStart = color(45,75,130);
			hillMid = color(102,147,192);
			hillEnd = color(150,200,235);
			//add snow if it hasn't been added yet
			if (this.bgObj.length===0){
				this.addObj(160, Snowflake);
			}
		}	
		else if (string === "spring"){
			skyEnd = color(242,252,255);
			hillStart = color(40,95,75);
			hillMid = color(66,129,96);
			hillEnd = color(85,158,106);
			if (this.player.P.y > 300){
				skyStart = color(70,110,120);
			}
				else {
					skyStart = color(150,175,225);
				}
			if (this.bgObj.length===0){
				this.addObj(160, Raindrop);
			}
		}
		else if (string === "summer"){
			this.hills[0].lake = true;
			skyStart = color(150, 205, 255);
			skyEnd = color(255, 237, 244);
			hillStart = color(150, 190, 220);
			hillMid = color(105,170,135);
			hillEnd = color(130, 200, 130);
			//will change to something else
			if (this.bgObj.length===0){
				this.addObj(10, Raindrop);
			}
		}
		else if (string === "fall"){
			skyStart = color(45, 50, 90);
			skyEnd = color(255, 180, 200);
			hillStart = color(75, 40, 30);
			hillMid = color(90,55,20);
			hillEnd = color(135, 75, 30); 
			if (this.bgObj.length===0){
				this.addObj(20, Leaf);
			} 
		}
		
		//all
		this.shadeSky(skyStart, skyEnd);  
		for(var i = 0; i < this.hills.length; i++){
			if(i===0){hillColor = lerpColor(hillStart, skyStart, 0.25);}
			if(i===1){hillColor = hillMid;}
			if(i===2){hillColor = hillEnd;}
			this.hills[i].draw(hillColor);
		}
		for(var i=0; i< this.bgObj.length; i++){
			if (string === "spring" && this.player.P.y > 275){
				this.bgObj[i].update();
				this.bgObj[i].draw();
			}
			else if (string === "winter" || string === "summer" || string ==="fall"){
				this.bgObj[i].update();
				this.bgObj[i].draw();
			}
		}
	}
}