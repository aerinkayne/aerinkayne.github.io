class Player{
	constructor(x,y){
	this.P = createVector(x,y);
	this.T = createVector(0,0);
	this.V = createVector(0,0);
	this.w = 30;
	this.h = 35;
	this.acceleration = 0.5;
	this.friction = 1;
	this.gravity = .75;
	this.maxSpeed = 3.5;
	this.MAXFALLSPEED = 12;
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.maxMana = 100;
	this.mana = this.maxMana;
	this.canJump = false;
	this.canClimb = false;
	this.canSwim = false;
	this.movements = {81:false, 69:false, 87: false, 32:false}; //q e w space
	this.jumpForce = 13;
	this.sprites = [pokyRunR1];
	this.damageDelay = 30; //for damage and health regen
	this.damageTimer = this.damageDelay;
	this.fatigueDelay = 30; 
	this.fatigueTimer = this.damageDelay;
	this.baseCycleTime = 40;
	this.cycleTime = this.baseCycleTime;
	this.drawTimer = 0;
	}
	updateDrawTimer(){
		this.drawTimer++;
		this.updateCycleTime();
		if (this.drawTimer >= this.cycleTime){
			this.drawTimer = 0;
		}
	}
	updateDamageTimer(){
		if (this.damageTimer < this.damageDelay){
			this.damageTimer++;
		}
		if (this.fatigueTimer < this.fatigueDelay){
			this.fatigueTimer++;
		}
	}
	updateCycleTime(){
		this.cycleTime = this.baseCycleTime - 2*this.V.mag();
	}
	setSize(w,h){
		this.w = w;
		this.h = h;
	}
	draw(){
		let numSprites = this.sprites.length;
		push();
		translate(this.P.x, this.P.y);
		if(numSprites > 1){
			let timePerSprite = this.cycleTime/numSprites;
			let i = floor(this.drawTimer/timePerSprite);
			image(this.sprites[i], 0, 0, this.w, this.h); 
			this.updateDrawTimer();
		}
		else {image(this.sprites[0], 0, 0, this.w, this.h);}
		pop();
	}
	manageSprites(){
		//todo  w/87 for up, decrease speed while swimming.
		(this.canSwim) ? this.setSize(35,35) : this.setSize(30,35);
		
		if(this.V.x > 0 && this.canJump){
			(this.canSwim) ? this.sprites = [pokySwimR1, pokySwimR2] : this.sprites = [pokyRunR2, pokyRunR1];
		}
		if(this.V.x < 0 && this.canJump){
			(this.canSwim) ? this.sprites = [pokySwimL1, pokySwimL2] : this.sprites = [pokyRunL2, pokyRunL1];
		}
		if(this.V.x > 0 && !this.canJump){this.sprites = [pokyJumpR];}
		if(this.V.x < 0 && !this.canJump){this.sprites = [pokyJumpL];}
		if(this.V.x===0 && this.canJump){
			if (this.sprites[0]===pokyRunR2 || this.sprites[0]===pokyJumpR) {this.sprites = [pokyRunR1];}
			if (this.sprites[0]===pokyRunL2 || this.sprites[0]===pokyJumpL) {this.sprites = [pokyRunL1];}
		}
		if(this.V.x===0 && !this.canJump){
			if (this.sprites[0]===pokyRunR1) {this.sprites = [pokyJumpR];}
			if (this.sprites[0]===pokyRunL1) {this.sprites = [pokyJumpL];}
		}
		if(this.V.x===0 && this.canSwim){
			if (this.sprites[0]===pokyRunR1) {this.sprites = [pokySwimR1];}
			if (this.sprites[0]===pokyRunL1) {this.sprites = [pokySwimL1];}
		}
		if(this.V.x===0 && !this.canSwim){
			if (this.sprites[0]===pokySwimR1) {this.sprites = [pokyRunR1];}
			if (this.sprites[0]===pokySwimL1) {this.sprites = [pokyRunL1];}
		}
		if(this.canClimb && this.movements['87']){this.sprites = [pokyClimb1, pokyClimb2];}
	}
	bound(game){
		this.P.x= constrain(this.P.x, 0, game.levelW-this.w);
		this.P.y= constrain(this.P.y, -height, game.levelH-this.h);
	}
	managePlayer(game){
		if (!game.paused){
			this.move();
			this.manageSprites();
			this.updatePosition(game);
			this.updateTranslation(game);
			this.updateDamageTimer();
			this.bound(game);
		}
	}
	move(){
		if (this.movements['81']){ //q
			this.V.x -= this.acceleration;
			if (this.V.x < -this.maxSpeed){
				this.V.x = -this.maxSpeed;
				}
			}
		if (this.movements['69']){  //e
			this.V.x += this.acceleration;
			if (this.V.x > this.maxSpeed){
				this.V.x = this.maxSpeed;
				}
			}
		if (this.movements['32'] && this.canJump){this.jump();}   //space
		if (this.movements['87'] && this.canClimb){this.climb();} //w
	}
	jump(){
		this.V.y -= this.jumpForce;
		this.canJump = false;
		this.canClimb = false;
	}
	climb(){
		this.V.y = -1.5;
	}
	takeDamage(dmg){
		this.health -= dmg;
		this.damageTimer = 0;
		if(this.health < 0){this.health = 0;}
		if(this.health > this.maxHealth){this.health = this.maxHealth;}
	}
	takeFatigue(ftg){
		this.mana -= ftg;
		this.fatigueTimer = 0;
		if(this.mana < 0){this.mana = 0;}
		if(this.mana > this.maxMana){this.mana = this.maxMana;}
	}
	healthBar(){
		push();
		fill(0);
		stroke(0);
		rect(width/50, height/40, width/8, height/50, 2);
		fill(255,100,175);
		noStroke();
		rect(width/50, height/40, map(this.health, 0, this.maxHealth, 0, width/8), height/50, 2);
		pop();
	}
	manaBar(){
		push();
		fill(0);
		stroke(0);
		rect(width/50, 2.2*height/40, width/8, height/50, 2);
		fill(100,225,255);
		noStroke();
		rect(width/50, 2.2*height/40, map(this.mana, 0, this.maxMana, 0, width/8), height/50, 2);
		pop();
	}
	addFriction(){           //q                       e
		if (!this.movements['81'] && !this.movements['69']){
			if(this.V.x < 0){
				this.V.x += this.friction;
				if (this.V.x > 0){this.V.x = 0;}
			}
			if(this.V.x > 0){
				this.V.x -= this.friction;
				if (this.V.x < 0){this.V.x = 0;}
			}
		}
	}
	updatePosition(game){
		this.canJump = false;
		this.addFriction();
		
		this.P.x+=this.V.x;
		game.mapCollision("X");
		
		if (!this.canJump && !(this.canClimb && this.movements['87'])){
			this.V.y += this.gravity;
		}
			
		if (this.V.y > this.MAXFALLSPEED){this.V.y = this.MAXFALLSPEED;}
		this.P.y+=this.V.y;
		
		this.canClimb = false;
		this.canSwim = false;
		game.mapCollision("Y");
	}
	updateTranslation(game){
		this.T.x = (this.P.x + this.w/2 >= game.levelW-width/2) ? game.levelW-width  : round(max(0, this.P.x + this.w/2 - width/2));
		this.T.y = (this.P.y + this.h/2 >= game.levelH-height/2)? game.levelH-height : round(this.P.y + this.h/2 - height/2);  //no upper bound
	}
}	