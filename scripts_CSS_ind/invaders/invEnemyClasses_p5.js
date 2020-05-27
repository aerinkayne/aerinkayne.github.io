//TODO: fix all the things.
class Enemy{
	constructor(x, y, gridW, gridH){
		this.w = 70;  //max sizes
		this.h = 70;  
		this.gridW = gridW;  //W/H for initial enemy spacing
		this.gridH = gridH;
		this.scaleBy = random(0.6, 1);  //used for size variation 
		this.scaleVelocity = false;      //whether to scale velocity with size

		this.spawnPoint = floor(-height/2);
		this.spawnVelocity = 0.2;
		this.P = createVector(x, y + this.spawnPoint); 
		this.V = createVector(0.5, 0);  //generic

		this.drawTimer = 0;     //randomized in animationSetup
		this.cycleTime = 50;   	//draw calls per animation cycle
		this.imageSprites = [sprBadR1,sprBadR2];
		
		this.firingTimer = 0;
		this.attackCooldown = 50; 
		this.shotDirection = 1;  //-1 for player, 1 for enemies (weapon speed is on gun config, so sign determines direction)
		this.shotRoll = 0.3; 	 //chance of attacking each frame once attack cooldown is up
		this.takesDamage = true;
		this.points = 10;  
		this.shots = [];
		this.drop = 0;
		this.setup = false;
	}

	animationSetup(){
		this.drawTimer = floor(random(0,this.cycleTime));  //randomize point in animation cycle so they are not sync
		this.w = round(this.w*this.scaleBy);  			   //create size variety + center according to new size. 
		this.h = round(this.h*this.scaleBy);
		this.P.x = this.P.x + round(this.gridW - this.w)/2;
		this.P.y = this.P.y + round(this.gridH - this.h)/2;
		if (this.scaleVelocity){   //scale velocity if set to true in enemy constructor
			this.V.x = parseFloat((this.scaleBy*this.V.x).toFixed(1));
			this.V.y = parseFloat((this.scaleBy*this.V.y).toFixed(1));
		}
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
			this.firingTimer = 0;
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
		if (this.drawTimer === this.cycleTime) {
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
		this.P.x += this.V.x;
		this.P.y += this.V.y;
	}
	//update is called in Game.managescenes, through loop of bads.length.  todo: fix this disaster.
	update(ship){  
		
		if (!this.setup){
			this.animationSetup();
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
			if (this.firingTimer < this.attackCooldown){
				this.firingTimer++;  
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
		this.gunType = redLaser;
		this.health = 50;
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
		this.gunType = blueLaser;
		this.health = 100;
		this.attackCooldown = 100; 
		this.att = sEnmAtt2;
		this.dest = sEnmD2; 
	}
	updateVelocity(){
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));

		this.V.y = parseFloat(cos(frameCount/40).toFixed(1));
	}
}
class CrimsonShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 55;
		this.h = 50;
		this.imageSprites = [sprCrim1, sprCrim2, sprCrim3, sprCrim2];
		this.cycleTime = 90;
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
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y + this.h);
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
		this.scaleVelocity = true; 
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
		this.w = 75;
		this.h = 42;
		this.scaleBy = random(0.75,1);
		this.scaleVelocity = false;
		this.imageSprites = [eye2, eye1, eye1, eye2, eyeClosed, eyeClosed, eyeClosed, eyeClosed];
		this.cycleTime = 900;
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
		super(x, y+25, gridW, gridH);
		this.w = 100;
		this.h = 100;
		this.scaleBy = 1;
		this.drawTimer = 0;
		this.cycleTime = 600;
		this.attackCooldown = 600;
		this.firingTimer = 450;		// 1/4 time remaining to fire
		this.shotRoll = 100;  		//base will always shoot once 1/4 through cycle
		this.imageSprites = [baseOpen, baseClosed];
		this.takesDamage = false;
	}
	
	shoot(){	
			let P = createVector(this.P.x, this.P.y + height/2 + 4/5*this.h); 
			//normal spawn is at -height/2.  
			bads.unshift(new OrangeShip(P.x, P.y, this.w, 0));  
			this.att.play();
		}	
	
}