class Enemy{
	constructor(x, y, gridW, gridH){
		this.w = 70;  		 //max sizes
		this.h = 70;  
		this.gridW = gridW;  //for initial enemy spacing
		this.gridH = gridH;
		this.scale = parseFloat(random(0.75, 1.049).toFixed(1));   //used for size variation 
		this.spawnPoint = floor(-height/2);
		this.spawnVelocity = 0.2;
		this.P = createVector(x, y + this.spawnPoint); 
		this.V = createVector(0.5, 0);  //generic
		this.drawTimer = undefined;     //set in setup if undefined
		this.cycleTime = 50;   		    //draw calls per animation cycle
		this.imageSprites = [sprBadR1,sprBadR2];
		this.firingTimer = 0;
		this.attackCooldown = 90;  //~60 frames per sec
		this.shotDirection = 1;    //-1 for player, 1 for enemies (weapon speed is on gun config, so sign determines direction)
		this.shotRoll = 0.5; 	   //chance of attacking each frame once attack cooldown is up
		this.takesDamage = true;
		this.points = 10;  
		this.shots = [];
		this.drop = 0;
		this.setup = false;
	}
	checkIfAttackable(){
		return;
	}
	animationSetup(){
		if(this.drawTimer===undefined){
			this.drawTimer = floor(random(0,this.cycleTime));  //randomize point in animation cycle so movements are not sync  
		}
		this.w = round(this.w*this.scale);  			       //create size variety  
		this.h = round(this.h*this.scale);
		this.P.x = this.P.x + round(this.gridW - this.w)/2;    //center according to new size.
		this.P.y = this.P.y + round(this.gridH - this.h)/2;
		this.setup = true;
	}
	spawnIn(){
		if (this.spawnPoint < 20){
			this.P.y += this.spawnVelocity;
			this.spawnPoint += this.spawnVelocity;
		}
	}
	draw(game){
		if (this.health > 0){
			let len = this.imageSprites.length;		//num sprites
			let segTime = this.cycleTime/len;  		//time for each sprite
			let i = floor(this.drawTimer/segTime);  //index in imageSprites to show
			
			push();
			translate(this.P.x, this.P.y);
			//image mode is CENTER
			image(this.imageSprites[i], this.w/2, this.h/2, this.w, this.h);
			pop();
			if (!game.paused){
				this.updateDrawTimer();
			}
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

			//check for collision with player ship and if player is damageable
			if(collide(this.shots[i], ship) && ship.dmgDelayTimer > ship.dmgDelay){
				this.shots[i].draw(this);  //draw a final time.  looks better.
				this.shots[i].hits--; 
				ship.damageTaken(this.gunType.damage);  //shield absorbs checked in damageTaken
				if (this.shots[i].hits === 0){
					this.shots.splice(i, 1);
					continue;
				}
			}
			//remove shots if they go off the level bord. extra -y distance because enemies move in from off screen
			if (this.shots[i].P.y > height || this.shots[i].P.y < -height/3 ||   
				this.shots[i].P.x < -this.shots[i].w || this.shots[i].P.x > levelW ){ 
				this.shots.splice(i, 1);
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
			this.P.y = -this.h;
		}
	}
	updatePosition(){ 
		this.P.x += this.scale*this.V.x;
		this.P.y += this.scale*this.V.y;
	}

	//update is called in Game.managescenes
	update(ship, game){  
		
		if (!this.setup){
			this.animationSetup();
		} 

		if (this.shots.length){
			this.updateShots(ship);
		}
		
		this.checkDirectCollision(ship);
		this.checkIfAttackable();
		
		//if enemy is alive and state is inGame
		if (this.health > 0){
			this.spawnIn();
			this.movementBounds();
			this.updateVelocity();
			this.updatePosition();
			
			//limit attack rate. some attacks should be synced with animation so only call if not paused and onscreen
			if (!game.paused && collide(this, gameScreen)){
				if (this.firingTimer < this.attackCooldown){
					this.firingTimer++;  
				}  
				else {
					this.attackRoll(game); //turret enemy needs game
				}
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
		this.w = 82;
		this.h = 65;
		this.imageSprites = [sprBadR1,sprBadR2];
		this.cycleTime = 32;
		this.gunType = redLaser;
		this.health = 50;
		this.att = sEnmAtt;  	
		this.dest = sEnmDestr; 
	}	
}
class BlueShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 75;
		this.h = 68;
		this.imageSprites = [sprBadB1,sprBadB2];
		this.cycleTime = 10;
		this.attackCooldown = 120;
		this.gunType = blueLaser;
		this.health = 100;
		this.att = sPhaserB;
		this.dest = sEnmD2; 
	}
	updateVelocity(){
		//XR if moving right XL if moving left
		let XR = 0.1 + 2*abs(cos(frameCount/30));  
		let XL = -XR;
		let Y = 2/3*cos(frameCount/40);    //40
		(this.V.x > 0) ? this.V.x = this.scale*XR : this.V.x = this.scale*XL;
		this.V.y = this.scale*Y;
	}
}
class CrimsonShip extends Enemy{
	constructor(x, y, gridW, gridH){
		super(x, y, gridW, gridH);
		this.w = 70;
		this.h = 60;
		this.imageSprites = [sprCrim1, sprCrim2, sprCrim3, sprCrim2];
		this.cycleTime = 90;
		this.gunType = spreader;
		this.health = 70;
		this.attackCooldown = 75; 
		this.att = sEnmCrimAtt;
		this.dest = sEnmD2; 
	}
	updateVelocity(){
		//XR if moving right XL if moving left
		let XR = 0.1 + abs(cos(frameCount/40));  
		let XL = -XR;
		let Y = 1/2*cos(frameCount/20);    
		(this.V.x > 0) ? this.V.x = this.scale*XR : this.V.x = this.scale*XL;
		this.V.y = this.scale*Y;
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
		this.w = 60;
		this.h = 44;
		this.imageSprites = [sprBadG1,sprBadG2];
		this.cycleTime = 10;
		this.gunType = greenPulse;
		this.V = createVector(1.5,0);
		this.health = 180;
		this.att = sPhaserG;
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
		this.attackCooldown = 180; 
		this.att = sPhaserY;
		this.dest = sEnmD2;
	}
	updateVelocity(){
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));
	}
}



class Eye extends Enemy{
	constructor(x, y, gridW, gridH){ 
		super(x, y, gridW, gridH);
		this.w = 80;
		this.h = 45;
		this.scale = random(0.75,1);
		this.imageSprites = [eye2, eye1, eye1, eye2, eyeClosed, eyeClosed, eyeClosed, eyeClosed];
		this.cycleTime = 900;
		this.gunType = homingMissile;
		this.V = createVector(0.25,0);
		this.health = 1200;
		this.attackCooldown = 360; 
		this.att = sEnmAtt;
		this.dest = sEnmD2;
	}
	updatePosition(){ 
		//don't scale velocity with size
		this.P.x += this.V.x;
		this.P.y += this.V.y;
	}
	//motion handled by checkSynchronizedEnemies() in game class (once per draw loop)
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
		this.scale = 1;
		this.drawTimer = 0;
		this.cycleTime = 600;
		this.attackCooldown = 600;
		this.firingTimer = 3/4*this.attackCooldown;
		this.shotRoll = 100;  		//base will always shoot once 1/4 through cycle
		this.imageSprites = [baseOpen, baseClosed];
		this.takesDamage = false;
	}
	shoot(){	
		let P = createVector(this.P.x, this.P.y + height/2 + 5/6*this.h); 
		//normal spawn is at -height/2. unshift to draw last so it's in front of turret 
		bads.unshift(new OrangeShip(P.x, P.y, this.w, 0));  
		this.att.play();
	}	
}