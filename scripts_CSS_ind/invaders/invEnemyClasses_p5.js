class Enemy{
	constructor(x,y, type){  //ship type
		this.type=type;
		this.spawnInP = createVector(0,-150);
		this.spawnInV = createVector(0, 0.1);
		this.P = createVector(x,y);
		this.P.y = this.P.y+this.spawnInP.y;
		this.V = createVector(0.5,0);  //update later
		this.shots = [];
		this.firing = false;
		this.drop = false;
		this.firingDelay = 0;
		this.weaponHits = 1;
		
		//switchtho
		if (type === "ship1"){
			this.w = 40;
			this.h = 35;
			//this.c = color(130,0,75);
			//this.c2 = color(60, 0, 15);
			//this.c3 = color(175, 70,95);
			this.health = 20;
			this.att = sEnmAtt;
			this.dest = sEnmDestr;

			//weapon stats
			this.weaponColor = color(200,0,0);
			this.weaponW = 4;
			this.weaponH = 12;
			this.weaponSpeed = -7.5; //speed of projectile.  higher is faster. (neg for enemy ships)
			this.weaponRecharge = 100; //weap recharge time.  lower allows faster shots. 
			this.weaponDamage = 15;
			this.shotRoll = 0.1; //testing
		}
		else if (type === "ship2"){
			this.w = 50;
			this.h = 45;
			//this.c = color(35,95,130);
			//this.c2 = color(35,0,80);
			//this.c3 = color(125,75,200);
			
			this.health = 50;
			this.att = sEnmAtt2;
			this.dest = sEnmD2;
			
			this.weaponColor = color(135,0,200);
			this.weaponW = 6;
			this.weaponH = 20;
			this.weaponSpeed = -6; 
			this.weaponRecharge = 150;  
			this.weaponDamage = 25;
			this.shotRoll = 0.1; //testing
			

		}
		else if (type === "ship3"){
			this.w = 50;
			this.h = 45;
			//this.c = color(35,140,120);
			//this.c2 = color(0,75,50);
			//this.c3 = color(75,175,120);
			this.health = 80;
			this.att = sEnmAtt;
			this.dest = sEnmDestr;
			
			this.weaponColor = color(0,200,135);
			this.weaponW = 15;
			this.weaponH = 18;
			this.weaponSpeed = -6; 
			this.weaponRecharge = 150;  
			this.weaponDamage = 40;
			this.shotRoll = 0.3; //testing
		}
		else if (type === "ship4"){
			this.w = 28;
			this.h = 35;
			//this.c = color(100,75,0);
			//this.c2 = color(80,40,0);
			//this.c3 = color(150,75,100);
			this.health = 160;
			this.att = sEnmAtt;
			this.dest = sEnmD2;
			
			this.weaponHits = 2;
			this.weaponColor = color(225,150,0);
			this.weaponW = 4;
			this.weaponH = 60;
			this.weaponSpeed = -3; 
			this.weaponRecharge = 150;  
			this.weaponDamage = 75;
			this.shotRoll = 0.2; //testing
		}
		else if (type === "ship5"){
			this.w = 50;
			this.h = 60;
			this.c = color(0,25,70);
			this.c2 = color(0,50,100);
			this.c3 = color(0,175,200);
			
			this.numEyes = 15;
			this.eyes = [];
			for (var i = 0; i< this.numEyes; i++){
				this.eyes.push(new Object());
				this.eyes[i].P = createVector (random(-this.w/2,this.w/20), random(-this.h/2,this.h/2));
				this.eyes[i].SF = random(0.15, 1);
				this.eyes[i].ani = random(0,PI/2);
			}
			
			this.health = 1000;
			this.att = sEnmAtt;
			this.dest = sEnmD2;
			
			this.weaponColor = color(230,0,100);
			this.weaponW = 7;
			this.weaponH = 7;
			this.weaponSpeed = -6; 
			this.weaponRecharge = 300;  
			this.weaponDamage = 75;
			this.shotRoll = 1; //testing
		}
	}
	
	draw(){
		if (this.health>0){
			if (this.type === "ship5"){
				
				//hit box
				noStroke();
				fill(this.c);  
				rect(this.P.x, this.P.y, this.w, this.h, 8);
				
				fill(this.c2);
				strokeWeight(1);
				stroke(this.c3);
				for (var i = 0; i <5; i++){
					rect(this.P.x, this.P.y+i*this.h/5.5, this.w, this.h/6, 3);
				}
				
				for (var i = 1; i < this.numEyes; i++){
					push();
					
					translate(this.P.x+this.w/2+this.eyes[i].P.x, this.P.y+this.h/2+this.eyes[i].P.y);
					scale(this.eyes[i].SF);
					fill(0, 17, 79);
					noStroke();
					ellipse(15,1,30,13+2*abs(sin(invGame.timer+this.eyes[i].ani)));


					fill(0, 73, 133);
					strokeWeight(1);
					stroke(0, 242, 255);

					beginShape();
					curveVertex(15,0);
					curveVertex(0,0);
					curveVertex(15,-10+4*abs(sin((invGame.timer+this.eyes[i].ani)/2)));
					curveVertex(30,0);
					curveVertex(15,10-4*abs(sin((invGame.timer+this.eyes[i].ani)/2)));
					curveVertex(0,0);
					curveVertex(10,-5);
					endShape();

					noStroke();
					fill(0, 255, 255);
					ellipse(15,0,25,10-6*abs(sin((invGame.timer+this.eyes[i].ani)/2)));
					fill(64, 0, 94,140);
					ellipse(15,0,14,12);
					fill(0, 0, 0);
					ellipse(15,0,3,9);
					fill(255, 255, 255);
					ellipse(11,-2,3,3);
					pop();
				}

			}
			else {
				push();
				translate(this.P.x, this.P.y);
				//noFill();  //hitbox check
				//stroke(200,0,0);
				//rect(0,0,this.w, this.h);
				imageMode(CENTER);
				
				if (this.type === "ship1"){
					if (sin(frameCount/2.5) > 0){
						this.img = sprBadR1;
					}
					else {
						this.img = sprBadR2;
					}
				}
				
				if (this.type === "ship2"){
					if (sin(frameCount/2.7) > 0){
						this.img = sprBadB1;
					}
					else {
						this.img = sprBadB2;
					}
				}
				
				else if (this.type === "ship3"){
					if (sin(frameCount/2.4) > 0){
						this.img = sprBadG1;
					}
					else {
						this.img = sprBadG2;
					}
				}
				
				else if (this.type === "ship4"){
					if (sin(frameCount/2.4) > 0){
						this.img = sprBadBr1; 
					}
					else {
						this.img = sprBadBr2; 
					}
				}
				
				image(this.img, this.w/2, this.h/2, this.w, this.h);
				pop();
			}		
		}	
	}
				/*
				rectMode(CENTER);
				push();
				translate(this.P.x+this.w/2, this.P.y+this.h/2);
				rotate(radians(-20)); 
				 
				noStroke();
				fill(this.c3);
				for (var i = 0; i < 3; i++){
					rect(-this.w/2.5,i*this.h/10+this.h/30*sin(invGame.timer), this.w/2, this.h/30);
				}
				pop();
				
				
				push();
				translate(this.P.x+this.w/2, this.P.y+this.h/2);
				rotate(radians(20));
				
				noStroke();
				fill(this.c3);
				for (var i = 0; i < 3; i++){
					rect(this.w/2.5,i*this.h/10+this.h/30*sin(invGame.timer), this.w/2, this.h/30);
				}
				pop();
				
				rectMode(CORNER);
				strokeWeight(1);
				stroke(0,0,0,150);
				push();
				translate(this.P.x, this.P.y);

				//body
				fill(this.c2);
				for (var i = 0; i<4; i++){
					rect(this.w/6+(4-i)*this.w/25, this.h/5+i*this.h/10, 2/3*this.w-(4-i)*this.w/12.5, this.h/7.5, 8);
				}
				
				//eyes
				
				fill(this.c);  
				ellipse(this.w/5, 3/4*this.h, this.w/2.75, this.h/3); //left
				ellipse(4/5*this.w, 3/4*this.h, this.w/2.75, this.h/3); //right
				ellipse(this.w/2, 6/10*this.h, this.w/2.25, this.h/2.5); //mid
				fill(this.c3); //small
				for (var i = 0; i < 3; i++){
					rect(2.5*this.w/8+i*this.w/8, 3/4*this.h, this.w/8, this.h/8, 10);
				}	
				for (var i = 0; i < 4; i++){
					rect(2*this.w/8+i*this.w/8, 3.4/4*this.h, this.w/8, this.h/8, 10);
				}	
				pop();
			}
		}
	}
	*/
	shoot(){
		this.shots.push(new Laser(this));
		this.att.play();
	}
	
	dropItem(){
		pups.push(new PowerUp(this));
	}
	
	//called in sketch loop through bads.length
	update(){  
	
		//update shots fired.  remove if offscreen.
		if (this.shots.length>0){
			for (var i = this.shots.length-1; i >= 0; i--){
				this.shots[i].draw(); //070319
				if(invGame.gameState==="inGame"){
					this.shots[i].update(this);
				}	
				
				if (this.shots[i].P.y > height+100){ 
					this.shots.splice(i,1);
				}
			}
		}
		
		
		//dmg done to player ship. remove if collision && hits 0, update hits
		for (var i = this.shots.length - 1; i >= 0; i--){
			if(collide(this.shots[i], ship) && ship.dmgDelay > 40){
				this.shots[i].draw();
				this.shots[i].hits--;
				
				if (this.shots[i].hits===0){
					this.shots.splice(i,1);
				}
				
				ship.health -= this.weaponDamage;
				ship.dmgDelay = 0;
						
				if (ship.health > 0){
						sEnmDmg.play();
				}
				else if (ship.health <= 0){
						ship.dest.play();	
				}
			}
		}
		
		//if alive and inGame
		if (this.health>0 && invGame.gameState==="inGame"){
			
			//horizontal based on ship type
			
			//ship1 just moves left/right constant V
			
			//ship2
			if (this.type === "ship2"){
				//if moving right
				if (this.V.x > 0){
					this.V.x = 2*abs(sin(radians(frameCount)));
				}
				//if moving left
				else if (this.V.x < 0){
					this.V.x = -2*abs(sin(radians(frameCount)));
				}
			}	
				
				
				
			//horizontal movement borders for all ships
			if (this.P.x < 40 || this.P.x > levelW - 40){
				this.V.x*=-1;
			}
			

			//else {}
			
			//vertical initial
			if (this.spawnInP.y < 50){
				this.spawnInP.add(this.spawnInV);
				this.P.add(this.spawnInV);
			}
			
			this.P.add(this.V);
			
			//limit firing rate
			if (this.firingDelay < this.weaponRecharge){
				this.firingDelay++;  
			}  
			if (this.firingDelay >= this.weaponRecharge){
				this.firing=false;
			}
			
			//shot roll
			if (this.shotRoll > random(0,100) && !this.firing){
				this.shoot();
			}
			
			//dmg taken by player ship
			for (var i = ship.shots.length - 1; i >= 0; i--){
				if(collide(ship.shots[i], this)){
					ship.shots[i].hits--;
					ship.shots[i].draw();
					
					if (ship.shots[i].hits===0){
						ship.shots.splice(i,1);
					}
					
					
					this.health -= ship.weaponDamage;
					
					if (this.health > 0){
						sEnmDmg.play();
					}
					else if (this.health <= 0){
						this.dest.play();
						ship.score+= this.weaponDamage;
						if(this.drop === true){this.dropItem();}
					}
				}	
			}
			
			
		}
	}
}