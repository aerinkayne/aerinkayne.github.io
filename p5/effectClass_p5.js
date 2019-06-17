class ObjectHandler{ 
	constructor(max, levelW, levelH, player){ //handle background object arrays
		this.levelW = levelW;  //from game.loadmap 
		this.levelH = levelH;
		this.max = max;  //currently 150
		this.player = player;
		this.snow=[];
		this.rain=[];
		this.fgRain=[];
		this.fgSnow=[];
		this.birds =[];
		this.leaves=[];
		this.fgLeaves=[];
		this.hills=[];		
	}
	//objecthandler is inst in game class constructor and also recreated in game.loadmap as needed.
	
	initHills(speed){
		if (this.hills.length===0){     
			var incX = this.levelW/25;  //eg 20, 9, 5
			var speed = speed; 		
			for (var j=0; j<3; j++){	//make three hills
				var arrPV = [];  
				incX+=75*j;  
				
				for (var i = 0; i*incX < this.levelW; i++){  
					arrPV.push(createVector (i*incX, height/4+incX/1.5+random(-15-20*j, 15+20*j)));
				}
				this.hills.push(new Hills(arrPV, this.levelW, this.levelH, this.player, speed));
				speed*=2;
				
			}
		}
		
	}
	add(type){  
		if (type==="snow"){
			if (this.snow.length < this.max) {    
				this.snow.push(new Snowflake(this.player, this.levelW, this.levelH));
			}
			
			if(this.fgSnow.length<this.max/10){
				//scale size and vel for each as it is added
				this.fgSnow.push(new Snowflake(this.player, this.levelW, this.levelH));
				this.fgSnow[this.fgSnow.length-1].SF=1.6;
				this.fgSnow[this.fgSnow.length-1].V.mult(1.6);
			}
		}
		if (type==="rain"){
			if (this.rain.length < this.max) {    
				this.rain.push(new Raindrop(this.player, this.levelW, this.levelH));
			}
			if(this.fgRain.length<this.max/10){
				this.fgRain.push(new Raindrop(this.player, this.levelW, this.levelH));
				this.fgRain[this.fgRain.length-1].SF=1.6;
				this.fgRain[this.fgRain.length-1].V.mult(1.6);
			}
		}	
		
		if (type === "birds"){
			if (this.birds.length < this.max/15) {
				this.birds.push(new Bird(this.player, this.levelW, this.levelH));
				this.birds[this.birds.length-1].P.x += random(-80,80);
				this.birds[this.birds.length-1].P.y += random(-80,80);
				this.birds[this.birds.length-1].tx += random(1000,2000);
				this.birds[this.birds.length-1].ty += random(1000,2000);
			}
			
		}
		if (type==="leaves"){
			if (this.leaves.length < this.max/10) {
				this.leaves.push(new Leaf(this.player, this.levelW, this.levelH));
			}
			
			if (this.fgLeaves.length<this.max/20){
				this.fgLeaves.push(new Leaf(this.player, this.levelW, this.levelH));
				this.fgLeaves[this.fgLeaves.length-1].SF=2.0;
				this.fgLeaves[this.fgLeaves.length-1].V.mult(2.0);
			}
		}
	}
	shadeSky(colorStart, colorEnd){
			noStroke();
			var colorStart = colorStart;
			var colorEnd = colorEnd;
			var inc = 12;

			for (var i = 0; i<2*inc; i++){
				var shift = lerpColor(colorStart, colorEnd, i/(2*inc));
				fill(shift);
				rect(0,i*inc,width,i*inc+inc);
			}
	}
	season(string){
		var hillColor;
		var skyStart, skyEnd, hillStart, hillEnd;
		if (string === "winter"){
			skyStart = color(82,149,204);
			skyEnd = color(250,200,255);
			hillStart = color(45,75,130);
			hillEnd = color(150,201,235);
			this.shadeSky(skyStart, skyEnd);  
			this.initHills(0.15);
			
			for(var i = 0; i < this.hills.length; i++){
				if(i===0){hillColor = lerpColor(hillStart,skyStart, 0.25);}
				if(i===1){hillColor = lerpColor(hillColor, hillEnd, 0.5);}
				if(i===2){hillColor = hillEnd;}
				this.hills[i].draw(hillColor);
			}
			this.add("snow"); 
			for(var i=0; i< this.snow.length; i++){
				this.snow[i].update();
				this.snow[i].draw();
			}
		}
		else if (string === "spring"){
			skyEnd = color(242,252,255);
			hillStart = color(40,95,75);
			hillEnd = color(85,158,106);
			if (this.player.P.y > 300){
				skyStart = color(70,110,120);
			}
			else {
				skyStart = color(150,175,225);
			}
			this.shadeSky(skyStart, skyEnd);
			
			this.initHills(0.15);
			for(var i = 0; i < this.hills.length; i++){
				if(i===0){hillColor = lerpColor(hillStart,skyStart, 0.25);}
				if(i===1){hillColor = lerpColor(hillColor, hillEnd, 0.5);}
				if(i===2){hillColor = hillEnd;}
				this.hills[i].draw(hillColor);
			}
			this.add("rain"); 
			if (this.player.P.y > 300){
				for(var i=0; i< this.rain.length; i++){
					this.rain[i].update();
					this.rain[i].draw();
				}
			}
			
		}
		else if (string === "summer"){
			skyStart = color(153, 209, 255);
			skyEnd = color(255, 237, 244);
			hillStart = color(150, 190, 220);
			hillEnd = color(120, 200, 90);
			this.shadeSky(skyStart, skyEnd);
			this.initHills(0.15);
			for(var i = 0; i < this.hills.length; i++){
				if(i===0){hillColor = lerpColor(hillStart,skyStart, 0.25);}
				if(i===1){hillColor = color(50,140,50);}
				if(i===2){hillColor = hillEnd;}
				this.hills[0].lake = true;
				this.hills[i].draw(hillColor);
			}
			/*  //borken
			this.add("birds"); 
			for(var i=0; i< this.birds.length; i++){
				this.birds[i].update();
				this.birds[i].draw();
			}
			*/
			
		}
		else if (string === "fall"){
			skyStart = color(107, 191, 255);
			skyEnd = color(250, 239, 255);
			hillStart = color(225, 170, 100);
			hillEnd = color(225, 150, 25);
			this.shadeSky(skyStart, skyEnd);
			this.initHills(0.15);
			for(var i = 0; i < this.hills.length; i++){
				if(i===0){hillColor = lerpColor(hillStart,skyStart, 0.25);}
				if(i===1){hillColor = lerpColor(hillColor, hillEnd, 0.5);}
				if(i===2){hillColor = hillEnd;}
				this.hills[i].draw(hillColor);
			}
			this.add("leaves");  
			for(var i=0; i< this.leaves.length; i++){
				this.leaves[i].update();
				this.leaves[i].draw();
			}
		}
	}
}