//TODO move collide into here.  add shield bar

class Enemy{
	constructor(x, y){  //ship type
		this.spawnInP = createVector(0,-height/2);
		this.spawnInV = createVector(0, 0.2);
		this.P = createVector(x,y);
		this.P.y = this.P.y+this.spawnInP.y;
		this.V = createVector(0.5,0);  //updated later
		this.scaleMod = random(0.8, 1.45);  //vary sizes somewhat
		this.w = 50;//overwrite
		this.h = 50;
		this.drawTimer = 0;
		this.cycleTime = 50;
		this.backImg = 0;
		this.takesDamage = true;
		this.points = 10;  //placeholder
		this.animationOffset = random(0,1.6);
		this.shots = [];
		this.drop = 0;
		this.firingDelay = 0;
		this.modifyLocation = 1; //0 or 1.  used as a multiplier in some statements in shot draw method
		this.shotDirection = 1;  //-1 for player ship, 1 for enemy ships
		this.powerLevel = 0;
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
			if(this.backImg){  //placeholder.  put an actual img here.
				fill(50,60,80);
				rect(-this.w/8,-this.h/8,5/4*this.w,5/4*this.h,3);
			}
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
			if(onScreen(shot,ship)){ 
				shot.draw(this);
			}
		});
	}
	updateShots(){
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
		
		this.checkDirectCollision();
		if (this.checkIfAttackable){this.checkIfAttackable();}
		
		//if enemy is alive and state is inGame
		if (this.health > 0 && invGame.gameState==="inGame"){
			this.spawnIn();
			this.movementBounds();
			this.updateVelocity();
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
							if(this.drop){this.dropItem();}
						}
					}	
				}	
			}
		}
	}
}

class RedShip extends Enemy{
	constructor(x, y){
		super(x, y);
		this.w = this.scaleMod*55;
		this.h = this.scaleMod*45;
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
	constructor(x, y){
		super(x, y);
		this.w = this.scaleMod*35;
		this.h = this.scaleMod*35;
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
	constructor(x, y){
		super(x, y);
		this.w = this.scaleMod*50;
		this.h = this.scaleMod*45;
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
	constructor(x, y){
		super(x, y);
		this.w = this.scaleMod*45;
		this.h = this.scaleMod*40;
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
	constructor(x, y){
		super(x, y);
		this.w = this.scaleMod*32;
		this.h = this.scaleMod*65;
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
	constructor(x, y, column){
		super(x, y);
		this.w = 70;
		this.h = 40;
		this.column = column;
		this.boundXL = x;
		this.boundXR = levelW - 50 - this.column * 70;  //column width in game array
		this.imageSprites = [eye2, eye1, eye1, eye2, eyeClosed, eyeClosed, eyeClosed, eyeClosed];
		this.backImg = 1;
		this.cycleTime = 1000;
		this.drawTimer = random(0,this.cycleTime);
		this.gunType = homingMissile;
		this.V = createVector(0.25,0);
		this.health = 1500;
		this.attackCooldown = 90; 
		this.att = sEnmAtt;
		this.dest = sEnmD2;
	}
	
	movementBounds(){
		if (this.P.x < this.boundXL || this.P.x > this.boundXR){
			this.V.x *= -1;
		}
	}
	checkIfAttackable(){
		(this.drawTimer < this.cycleTime/2) ?  this.takesDamage = true : this.takesDamage = false;
	}
}

class EnmBase extends Eye{
	constructor(x,y, column){
		super(x,y, column);
		this.w = 110;
		this.h = 90;
		this.backImg = 0;
		this.boundXR = levelW - 50 - this.column * 70 - 20;  //20 comes from (110-70)/2.  I'm so sorry :(
		this.attackCooldown = 1000; 
		this.imageSprites = [base1];
		this.takesDamage = false;
	}
	checkIfAttackable(){
		return false;
	}
	shoot(){										//normal spawnin is at -height/2
		let P = createVector(this.P.x + this.w/4, this.P.y + height/2 + 3/5*this.h); 
		bads.unshift(new OrangeShip(P.x, P.y, 32, 70));  
		this.att.play();
	}
}