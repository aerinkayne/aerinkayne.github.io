//TODO: fix all the things.
class Enemy{
	constructor(x, y, gridW, gridH){
		this.w = 70;
		this.h = 70;  
		this.gridW = gridW;
		this.gridH = gridH;
		this.scaleBy = random(0.6, 1);  //vary sizes somewhat

		this.spawnPoint = floor(-height/2);
		this.spawnVelocity = 0.2;
		this.P = createVector(x, y + this.spawnPoint); 
		this.V = createVector(0.5, 0);  //updated later

		this.drawTimer = 0;
		this.cycleTime = 50;
		this.takesDamage = true;
		this.points = 10;  
		this.animationOffset = random(PI);
		this.shots = [];
		this.drop = 0;
		this.firingDelay = 0;
		this.modifyLocation = 1; //0 or 1.  used as a multiplier in some statements in shot draw method
		this.shotDirection = 1;  //-1 for player ship, 1 for enemy ships
		this.powerLevel = 0;
		this.shotRoll = 0.3; 	 //chance of attacking once attackcooldown is up
		this.setup = false;
	}

	scaleAndCenter(){
		this.w = round(this.w*this.scaleBy);  //create variety of sizes, and correct position according to size change. 
		this.h = round(this.h*this.scaleBy);
		this.P.x = this.P.x + round(this.gridW - this.w)/2;
		this.P.y = this.P.y + round(this.gridH - this.h)/2;
		this.setup = true;
	}

	spawnIn(){
		if (this.spawnPoint < 20){
			this.P.y += this.spawnVelocity;
			this.spawnPoint += this.spawnVelocity;
		}
	}

	draw(){
		if (this.health>0){
			let len = this.imageSprites.length;
			let segTime = this.cycleTime/len;
			let i = floor(this.drawTimer/segTime);
			push();
			translate(this.P.x, this.P.y);
			//image mode is CENTER
			image(this.imageSprites[i], this.w/2, this.h/2, this.w, this.h);
			pop();
			this.updateDrawTimer();
		}
	}
	shoot(){
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y + this.h/2); 
		let V = createVector(0, this.gunType.speed*this.shotDirection);
		this.shots.push(new WeaponShot(this, P, V));
		this.att.play();
	}
	attackRoll(){
		if (this.shotRoll > random(0,100)){
			this.shoot();
			this.firingDelay = 0;
		}
	}	
	dropItem(){
		if (this.drop === "gun"){
			pups.push(new PowerUp(this));
		}
		else if (this.drop === "shield"){
			pups.push(new ShieldDrop(this));
		}
		this.drop = false;
	}
	updateDrawTimer() {
		this.drawTimer ++;
		if (this.drawTimer >= this.cycleTime) {
			this.drawTimer = 0;
		}
	}
	updateVelocity(){
		return;
	}
	drawShots(){
		this.shots.forEach(shot => {
			if (collide(shot, gameScreen)){
				shot.draw(this);
			}	
		});
	}
	updateShots(ship){
		//update P if inGame. decrement to avoid problems from shots being spliced out  
		for (let i = this.shots.length-1; i >= 0; i--){
			//pass ship as target for targeted shots
			this.shots[i].update(this, ship);

			//check for collision with player ship.  update shot.hits.  remove shot if collision && shot.hits 0
			if(collide(this.shots[i], ship) && ship.dmgDelayTimer > ship.dmgDelay){
				this.shots[i].draw(this);  //draw a final time.  looks better.
				this.shots[i].hits--; 
				ship.damageTaken(this.gunType.damage);  //shield absorbs done in this method too
				if (this.shots[i].hits <= 0){
					this.shots.splice(i,1);
					continue;
				}
			}
			//remove shots if they go off the level bord. extra -y distance because enemies move in from off screen
			if (this.shots[i].P.y > height || this.shots[i].P.y < -height/3 ||   
				this.shots[i].P.x < -this.shots[i].w || this.shots[i].P.x > levelW ){ 
				this.shots.splice(i,1);
			}
		}
	}
	checkDirectCollision(ship){
		//check for direct collision with player
		if (collide(this, ship) && this.health > 0 && ship.dmgDelayTimer > ship.dmgDelay){
			ship.damageTaken(100);      //************
			if (this.takesDamage){
				this.health-=100;
				sEnmDmg.play();
			}
		}
	}
	movementBounds(){
		if (this.P.x < 0 || this.P.x > levelW - this.w){
			this.V.x *= -1;
		}
		if (this.P.y > levelH){
			this.P.y = -2*this.h;
		}
	}
	updatePosition(){ 
		this.P.x += this.V.x*this.scaleBy;
		this.P.y += this.V.y*this.scaleBy;
	}
	//update is called in Game.managescenes, through loop of bads.length.  todo: fix this disaster.
	update(ship){  
		if (!this.setup){
			this.scaleAndCenter();
		}

		if (this.shots.length > 0 ){
			this.updateShots(ship);
		}
		
		this.checkDirectCollision(ship);
		if (this.checkIfAttackable){this.checkIfAttackable();} //call method if it exists
		
		//if enemy is alive and state is inGame
		if (this.health > 0 && invGame.gameState==="inGame"){
			this.spawnIn();
			this.movementBounds();
			this.updateVelocity();
			this.updatePosition();
			
			//limit attack rate
			if (this.firingDelay < this.attackCooldown){
				this.firingDelay++;  
			}  
			else {
				this.attackRoll();
			}
			
			//dmg taken by player ship
			for (let i = ship.shots.length - 1; i >= 0; i--){
				if(collide(ship.shots[i], this)){
					ship.shots[i].hits--;
					ship.shots[i].draw(this);
					
					if (ship.shots[i].hits <= 0){
						ship.shots.splice(i,1);
					}
					
					if (this.takesDamage){
						this.health -= ship.gunType.damage;
						
						if (this.health > 0){
							sEnmDmg.play();
						}
						else if (this.health <= 0){
							this.dest.play();
							ship.score+= this.points;
							if(this.drop){this.dropItem();}
						}
					}	
				}	
			}
		}
	}
}

class RedShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 65;
		this.h = 55;
		this.imageSprites = [sprBadR1,sprBadR2];
		this.cycleTime = 40;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = redLaser;
		this.health = 50;
		this.attackCooldown = 50; 
		this.att = sEnmAtt;  	
		this.dest = sEnmDestr; 
	}	
}
class BlueShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 45;
		this.h = 45;
		this.imageSprites = [sprBadB1,sprBadB2];
		this.cycleTime = 30;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = blueLaser;
		this.health = 100;
		this.attackCooldown = 100; 
		this.att = sEnmAtt2;
		this.dest = sEnmD2; 
	}
	updateVelocity(){
		//if moving right vs if moving left
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));
		this.V.y = cos(frameCount/40);
	}
}
class CrimsonShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 55;
		this.h = 50;
		this.imageSprites = [sprCrim1, sprCrim2, sprCrim3, sprCrim2];
		this.cycleTime = 90;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = spreader;
		this.health = 70;
		this.attackCooldown = 30; 
		this.att = sEnmCrimAtt;
		this.dest = sEnmD2; 
	}
	updateVelocity(){
		//if moving right vs if moving left
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/40)) : this.V.x = -abs(cos(frameCount/40));
		this.V.y = 1/2*cos(frameCount/20);
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
	shoot(){
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y + this.h*this.modifyLocation);
		let V = createVector(0, this.gunType.speed*this.shotDirection);
		for (let i=0; i< this.gunType.pushNumber; i++){
			this.shots.push(new WeaponShot(this, P, V));
		}
		this.spreadShot(this.gunType.pushNumber, this.gunType.spreadAngle);
		this.att.play();
	}
}
class GreenShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 55;
		this.h = 45;
		this.imageSprites = [sprBadG1,sprBadG2];
		this.cycleTime = 20;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = greenPulse;
		this.V = createVector(1.5,0);
		this.health = 180;
		this.attackCooldown = 100; 
		this.att = sEnmAtt;
		this.dest = sEnmDestr; 
	}
}
class OrangeShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 35;
		this.h = 65;
		this.imageSprites = [sprBadBr1,sprBadBr2];
		this.cycleTime = 40;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = orangeLaser;
		this.V = createVector(0.5,1.0);
		this.health = 300;
		this.attackCooldown = 100; 
		this.att = sEnmAtt;
		this.dest = sEnmD2;
	}
	updateVelocity(){
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));
	}
}



class Eye extends Enemy{
	constructor(x, y, gridW, gridH){ 
		super(x, y, gridW, gridH);
		this.w = 70;
		this.h = 40;
		this.scaleBy = 1;
		this.imageSprites = [eye2, eye1, eye1, eye2, eyeClosed, eyeClosed, eyeClosed, eyeClosed];
		this.cycleTime = 900;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = homingMissile;
		this.V = createVector(0.25,0);
		this.health = 1200;
		this.attackCooldown = 360; 
		this.att = sEnmAtt;
		this.dest = sEnmD2;
	}
	
	//motions (currently) handled by checkSynchronizedEnemies() in game class
	movementBounds(){
		return;
	}

	checkIfAttackable(){
		(this.drawTimer < this.cycleTime/2) ?  this.takesDamage = true : this.takesDamage = false;
	}
}

class EnmBase extends Eye{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 100;
		this.h = 90;
		this.drawTimer = 0;
		this.cycleTime = 600;
		this.attackCooldown = floor(this.cycleTime/4);
		this.firingDelay = 0;
		this.imageSprites = [baseOpen, baseClosed];
		this.takesDamage = false;
	}
	attackRoll(){
		if(this.firingDelay === this.attackCooldown && this.drawTimer === this.attackCooldown){
			this.shoot();
			this.firingDelay = 0;
		}
	}	
	shoot(){	
			let P = createVector(this.P.x, this.P.y + height/2 + 4/5*this.h); 
			//normal spawn is at -height/2.  
			bads.unshift(new OrangeShip(P.x, P.y, this.w, 0));  
			this.att.play();
		}	
	
}