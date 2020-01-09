//TODO fix this disaster
class Enemy{
	constructor(x, y, w, h){  //ship type
		this.spawnInP = createVector(0,-height/2);
		this.spawnInV = createVector(0, 0.2);
		this.P = createVector(x,y);
		this.P.y = this.P.y+this.spawnInP.y;
		this.V = createVector(0.5,0);  //updated later
		this.scaleMod = random(0.8, 1.2);  //vary sizes somewhat
		this.w = w*this.scaleMod;
		this.h = h*this.scaleMod;
		this.drawTimer = 0;
		this.cycleTime = 50;
		this.takesDamage = true;
		this.points = 10;  //placeholder
		this.animationOffset = random(0,1.6);
		this.shots = [];
		this.drop = false;
		this.firingDelay = 0;
		this.modifyLocation = 1; //0 or 1.  used as a multiplier in some statements in draw method
		this.shotDirection = 1;  //-1 for player ship, 1 for enemy ships
		this.powerLevel = 1;
		this.shotRoll = 0.3; //used for chance of attacking once attackcooldown is up
	}
	spawnIn(){
		if (this.spawnInP.y < 0){
			this.spawnInP.add(this.spawnInV);
			this.P.add(this.spawnInV);
		}
	}
	draw() {
		if (this.health>0){
			let len = this.imageSprites.length;
			let segTime = this.cycleTime/len;
			let i = floor(this.drawTimer/segTime);
			push();
			translate(this.P.x, this.P.y);
			image(this.imageSprites[i], this.w/2, this.h/2, this.w, this.h);
			pop();		
		}
	}
	shoot(){
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y + this.h*this.modifyLocation);
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
		pups.push(new PowerUp(this));
	}
	updateDrawTimer() {
		this.drawTimer ++;
		if (this.drawTimer >= this.cycleTime) {
			this.drawTimer = 0;
		}
	}
	updateV(){
		return;
	}
	updateShots(){
		//draw. update P if inGame. decrement to avoid problems from shots being spliced out  
		for (let i = this.shots.length-1; i >= 0; i--){
			if(onScreen(this.shots[i],ship)){ 
				this.shots[i].draw(this);
			} 
			if(invGame.gameState==="inGame"){
				this.shots[i].update(this);
			}	
			//check for collision with player ship.  update shot.hits.  remove shot if collision && shot.hits 0
			if(collide(this.shots[i], ship) && ship.dmgDelayTimer > ship.dmgDelay){
				this.shots[i].draw(this);  //draw a final time.  looks better.
				this.shots[i].hits--; 
				ship.damageTaken(this.gunType.damage);
				if (this.shots[i].hits <= 0){
					this.shots.splice(i,1);
					continue;
				}
			}
			//remove shots if they go off the level bord. extra -y distance because enemies move in from off screen
			if (this.shots[i].P.y > height || this.shots[i].P.y < -height/2 ||   
				this.shots[i].P.x < -this.shots[i].w || this.shots[i].P.x > levelW ){ 
				this.shots.splice(i,1);
			}
		}
	}
	checkDirectCollision(){
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
	
	//called in Game.managescenes, through loop of bads.length
	update(){  
		if (this.shots.length > 0 ){
			this.updateShots();
		}
		this.updateDrawTimer();
		this.checkDirectCollision();
		if (this.checkIfAttackable){this.checkIfAttackable();}
		
		//if enemy is alive and state is inGame
		if (this.health > 0 && invGame.gameState==="inGame"){
			this.spawnIn();
			this.movementBounds();
			this.updateV();
			this.P.add(this.V);
			
			
			//limit attack rate
			if (this.firingDelay <= this.attackCooldown){
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
							if(this.drop === true){this.dropItem();}
						}
					}	
				}	
			}
		}
	}
}


class RedShip extends Enemy{
	constructor(x, y, w, h, type){
		super(x, y, w, h, type);
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
	constructor(x, y, w, h){
		super(x, y, w, h);
		this.imageSprites = [sprBadB1,sprBadB2];
		this.cycleTime = 30;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = blueLaser;
		this.health = 100;
		this.attackCooldown = 100; 
		this.att = sEnmAtt2;
		this.dest = sEnmD2; 
	}
	updateV(){
		//if moving right vs if moving left
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));
		this.V.y = cos(frameCount/40);
	}
}
class GreenShip extends Enemy{
	constructor(x, y, w, h){
		super(x, y, w, h);
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
	constructor(x, y, w, h){
		super(x, y, w, h);
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
	updateV(){
		(this.V.x >= 0) ? this.V.x = abs(cos(frameCount/20)) : this.V.x = -abs(cos(frameCount/20));
	}
}
class Eye extends Enemy{
	constructor(x, y, w, h){
		super(x, y, w, h);
		this.imageSprites = [eye2, eye1, eye1, eye2, eyeClosed, eyeClosed, eyeClosed, eyeClosed];
		this.cycleTime = 1000;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = homingMissile;
		this.V = createVector(0.5,0);
		this.health = 1500;
		this.attackCooldown = 90; 
		this.att = sEnmAtt;
		this.dest = sEnmD2;
	}
	checkIfAttackable(){
		(this.drawTimer < this.cycleTime/2) ?  this.takesDamage = true : this.takesDamage = false;
	}
}
