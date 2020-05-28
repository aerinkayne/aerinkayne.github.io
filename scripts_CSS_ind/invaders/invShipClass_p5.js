//ship class  
class Ship{
	constructor(x,y){
	this.P = createVector(x,y); 
	this.V = createVector(0,0);
	this.T = createVector(0,0);
	this.w = height/10;
	this.h = height/10;
	this.movements = {39: false, 37: false, 38: false, 40: false}; //R,L,U,D 
	this.acc = 1.0;
	this.dec = 0.25;
	this.MAXSP = 4.5;
	this.onTouchTimer = 0;
	this.onTouchMoveDirection = createVector(0,0);
	this.onTouchShipP = createVector(0,0);
	this.onTouchMouseP = createVector(0,0); 
	this.thruster = 0; 
	this.gunType = new Gun(startLaser); //orangeLaser;
	this.shielded = false;
	this.shield = new Shield(this.P.x, this.P.y, this.w, this.h);
	this.shots = [];
	this.firing = false;
	this.firingDelay = 0;
	this.shotDirection = -1;  //-1 for player ship, 1 for enemy ships
	this.powerLevel = 0;  	  //zero based
	this.powerLevelMAX = 2;
	this.gunz = [btnRedGun, btnBlueGun, btnGreenGun, btnOrangeGun, btnSpreadGun];
	this.healthMAX = 1800;  
	this.health = this.healthMAX;  
	this.score = 0;
	this.dmgDelay = 30;
	this.dmgDelayTimer = this.dmgDelay;
	this.dmgTaken = sEnmDestr;
	this.dest = sShipDestr;
	} 
	touchMove(){
		this.onTouchShipP = createVector(this.P.x+this.w/2, this.P.y+this.h/2); 
		this.onTouchMouseP = createVector(mouseX, mouseY);
		this.onTouchTimer = 30;
		this.onTouchMouseP.add(this.T);
		this.onTouchMoveDirection = this.onTouchMouseP.sub(this.onTouchShipP);
		this.V = this.onTouchMoveDirection.setMag(this.MAXSP);
	}
	updateTouchTimer(){
		if(this.onTouchTimer<0){this.onTouchTimer=0;}
			else {
				this.onTouchTimer--;
			}
	}
	spreadShot(number, angle){
		let angleRadians = radians(angle);
		let vMag = this.gunType.speed;
		let a = angleRadians/(number-1);
		let a0 = PI/2-angleRadians/2;
		let lastIndex = this.shots.length-1;
		for (let i = 0; i < number; i++){
			this.shots[lastIndex - i].V.x = cos(a0 + i*a);
			this.shots[lastIndex - i].V.y = sin(a0 + i*a)*this.shotDirection;
			this.shots[lastIndex - i].V.setMag(vMag);
		}
	}
	getTarget (arr){
		let target = 0;
		for (let i=0; i < arr.length; i++){
			if (this.P.dist(arr[i].P) < 0.6*width){
				target = arr[i];
				break;
			}
		}
		return target;
	}
	shoot(){ 
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y);
		let V = createVector(0, this.gunType.speed*this.shotDirection);

		P.x -= this.w/8*this.powerLevel;
		for (let p = 0; p <= this.powerLevel; p++){
			for (let i=0; i< this.gunType.pushNumber; i++){
				this.shots.push(new WeaponShot(this, P, V));
			}
			if(this.gunType.name === "spreader"){
				this.spreadShot(this.gunType.pushNumber, this.gunType.spreadAngle);
			}
			P.x += this.w/4;
		}	
	}
	healthBar(){
		noStroke();
		fill(225,225,255);
		textAlign(LEFT);
		text(`HP ${this.health}`, width-15*width/50, height-4*height/40);
		fill(0,0,0);
		stroke(100,175,255);
		rect(width-15*width/50-1, height-3*height/40-1, width/10 + 1, 6,2);
		noStroke();
		fill(155,0,40);
		if (this.health < 0){this.health = 0;}
		if (this.health > this.healthMAX){this.health = this.healthMAX;}
		rect(width-15*width/50, height-3*height/40, map(this.health,0,this.healthMAX,0,width/10), 4,2);
	}
	shieldBar(){
		noStroke();
		fill(225,225,255);
		textAlign(LEFT);
		text(`shields ${this.shield.absorb}`, width-9*width/50, height-4*height/40);
		fill(0,0,0);
		stroke(100,175,255);
		rect(width-9*width/50-1, height-3*height/40-1, width/10 + 1, 6,2);
		noStroke();
		fill(100,0,120);
		if (this.shield.absorb < 0){this.shield.absorb = 0;}
		rect(width-9*width/50, height-3*height/40, map(this.shield.absorb, 0, this.shield.absorbMax, 0, width/10), 4,2);
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		//glow effects
		noStroke();
		fill(0, 62, 156, 30 + 100*abs(sin(radians(frameCount))));
		//animate thruster with -V.y
		if (this.V.y < 0){
			this.thruster = this.h/2.5;
		} else {this.thruster = 0;}
		//larger darker blue
		rect(1/5*this.w, 9/10*this.h, this.w/3, this.h/3 + 3/4*this.thruster, 25);   //left
		rect(19/40*this.w, 9/10*this.h, this.w/3, this.h/3 + 3/4*this.thruster, 25); //right
		//light blue
		fill(0, 166, 255, 3*this.thruster + 65 + 125*abs(sin(radians(frameCount))));
		ellipse(3/8*this.w, this.h, this.w/5, this.h/5 + this.thruster);
		ellipse(9/14*this.w, this.h, this.w/5, this.h/5 + this.thruster);
		//small bright blue
		fill(184, 230, 255);
		ellipse(3/8*this.w, this.h, this.w/9.5, this.h/10 + this.thruster/2); 
		ellipse(9/14*this.w, this.h, this.w/9.5, this.h/10 + this.thruster/2);
		 
		if (this.firing){
			image(sprShipF, this.w/2, this.h/2, this.w, this.h + .23*this.h);
		}
		else {
			image(sprShip1, this.w/2, this.h/2, this.w, this.h+ .23*this.h);
		}
		if (this.shielded){
			this.shield.updatePosition(this);
			this.shield.draw();
		}
		pop();	
	}	
	playerShipDestroyed(){
		this.dest.play();
		//remove remaining enemies and powerups from global arrays (todo:put in game)
		while (bads.length) { bads.pop(); }	
		while (moveTogether.length) { moveTogether.pop(); }		
		while (pups.length) { pups.pop(); }

		gameScreen = new GameScreen();
		invGame = new Game();
	}	
	damageTaken(damage){
		if (this.shielded){
			this.shield.absorb -= damage;
			if (this.shield.absorb < 0){
				this.shield.absord = 0;
				this.shielded = false;
			}
		}
		else{
			this.health -= damage;
			this.dmgDelayTimer = 0;
			this.dmgTaken.play();
			if(this.health < 0){
				this.health = 0;
			}
		}		
	}
	updateTranslationVector(){  
		this.T.x = (this.P.x + this.w/2 > levelW-width/2) ? levelW-width : round(max(0, this.P.x + this.w/2 - width/2));
		this.T.y = 0; //no vertical translation
	}
	update(){
		//constrain
		this.P.x= constrain(this.P.x, 0, levelW-this.w);
		this.P.y= constrain(this.P.y, 0, levelH-this.h);
		
		if (this.movements['39']){this.V.x+=this.acc;}
		if (this.movements['37']){this.V.x-=this.acc;}
		if (this.movements['38']){this.V.y-=this.acc;}
		if (this.movements['40']){this.V.y+=this.acc;}

		//if click to move
		this.updateTouchTimer();
		//slow down if key not pressed, stop if reversed
		if (this.onTouchTimer <= 0){
			if (!this.movements['39'] && this.V.x < 0){
				this.V.x+=this.dec;
					if (this.V.x > 0){this.V.x = 0;}
			}
			if (!this.movements['37'] && this.V.x > 0){
				this.V.x-=this.dec;
					if (this.V.x < 0){this.V.x = 0;}
			}
			if (!this.movements['38'] && this.V.y > 0){
				this.V.y-=this.dec;
					if (this.V.y < 0){this.V.y = 0;}
			}
			if (!this.movements['40'] && this.V.y < 0){
				this.V.y+=this.dec;
					if (this.V.y > 0){this.V.y = 0;}
			}
		}
		this.V.limit(this.MAXSP);
		this.P.add(this.V);
		this.updateTranslationVector();

		//limit firing rate
		if (this.firingDelay <= this.gunType.rechargeTime){ //weaponRecharge){
			this.firingDelay++;  
		}  
		if (this.firingDelay > this.gunType.rechargeTime){
			this.firing=false;
		}
		
		//fire gun
		if (mouseIsPressed && !this.firing) { 
			this.gunType.weaponSound.play(); 
			this.shoot(); 
			this.firing = true;
			this.firingDelay = 0;
		}
		//update shots fired
		if (this.shots.length){
			for (let i = this.shots.length-1; i >= 0; i--){
				let target = this.shots[i].targeted ? this.getTarget(bads) : 0;
				this.shots[i].update(this, target);
				
				if (this.shots[i].P.y < -this.shots[i].h){ 
					this.shots.splice(i,1);
				}
			}
		}
		//dmgDelay update
		this.dmgDelayTimer++

		//end game if no health remaining
		if(this.health <= 0){
			this.playerShipDestroyed()
		}
	}
}