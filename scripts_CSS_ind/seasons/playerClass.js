class Player {
	constructor (x,y,w,h, game){
  		this.P = createVector(x,y);
		this.C = createVector(x+w/2, y+h/2);  
		this.T = createVector(0,0); 		  
  		this.game = game;
  		this.PosLast = 0;
  		this.collisionTiles = [];
		this.w = w;
		this.h = h;
		this.distMax = 3*w;
		this.z_Index = 2;
		this.V = createVector(0,0);
		this.moveSpeed = 0.25;
		this.MAXSPEED = 4;
		this.MAXHEALTH = 6;
		this.hurt = false;
		this.falling = false;
		this.hidden = false;
		this.gravity = createVector(0,0.4);
		this.movements = {81:false, 69:false, 32:false}; //q e space
		this.color = (50, 50, 50);
        this.health = 3;
        this.hurt = false;
		this.hasKey = false;
        this.toNextLevel = false;
        this.damage = 1;
		this.damageDelay = 40; //used to limit calls for damaging collisions
		this.damageDelayTimer = this.damageDelay + 1;
		this.checkGrounding = false;
		this.z_Index = 2;
    }
	updateTranslation(){
		this.T.x = (this.C.x >= this.game.levelW - width/2) ? 
			this.game.levelW-width : round(max(0, this.C.x - width/2));
		this.T.y = (this.C.y >= this.game.levelH - height/2)? 
			this.game.levelH-height : round(this.C.y - height/2);  //no upper bound
	} 
	updateCenterPosition(){
		this.C.x = this.P.x + this.w/2;
		this.C.y = this.P.y + this.h/2;
    }
    getCollisionTiles(){
        let mobs = this.game.onScreenMobs.filter(tile=>{
            return dist(tile.C.x, tile.C.y, this.C.x, this.C.y) < this.distMax;
        });    
		let tiles = this.game.onScreenTiles.filter(tile=>{
			return dist(tile.C.x, tile.C.y, this.C.x, this.C.y) < this.distMax && tile !== this;
        });
        this.collisionTiles = [...tiles, ...mobs];
	}
	manageUpdates(){  
        //update collisionTiles if player has moved more than a width since last filter.
        if (!this.PosLast || dist(this.P.x, this.P.y, this.PosLast.x,this.PosLast.y) > this.w ){
			this.PosLast = createVector(this.P.x, this.P.y); 	//create or update PosLast	
			this.updateCenterPosition();				 		//updateC for tile check
			this.getCollisionTiles();				            //get tiles to check
		}

		//horizontal constrain
		this.P.x = constrain(this.P.x, 0, this.game.levelW-this.w);
		//check if player has fallen.  
		if(this.P.y > this.game.levelH + height){this.health = 0;}
		//check health
		if(this.health <= 0 ){
			this.game.gameScreen.color = [0,0,0];
			this.game.gameScreen.opacity = 255;
			this.game.gameState="gameOver";
		}
		//manage movement input
		if(this.movements['69']){  //69 e
			this.V.x += this.moveSpeed;
		}
		if(this.movements['81']){  //81 q
			this.V.x -= this.moveSpeed;
		}
		if(this.movements['32'] && !this.falling){ //38 jump
			this.V.y = -this.h/3.11;  
			this.falling=true;
			soundJump.play();
		}
		//limit horizontal and falling speed
		if (this.V.x < -this.MAXSPEED){  
			this.V.x = -this.MAXSPEED;
		}
		if (this.V.x > this.MAXSPEED){
			this.V.x = this.MAXSPEED;
		}
		if (this.V.y > 3/7*this.h){
			this.V.y = 3/7*this.h;
		}
		
		//update x position
		this.P.x += floor(this.V.x);
		//check x collision 
		this.checkMapCollision(this.V.x, 0); 
		//update y position
		this.falling=true;
		this.V.add(this.gravity);
		this.P.y += this.V.y;
		//check y collision
		this.checkMapCollision(0, this.V.y);  
		
		//decelerate.  TODO vary friction with different surfaces
		if(!this.movements['69'] && !this.movements['81']){
			if(this.V.x > 0){
				this.V.x -= this.moveSpeed;
			}
			if(this.V.x < -0){
				this.V.x += this.moveSpeed;
			}
		}
		this.updateCenterPosition();
		this.updateTranslation();
		//dmg delay timer
		if (this.damageDelayTimer <= this.damageDelay){
			this.damageDelayTimer ++;
		}
		this.overlayEffect();  //screen effects if damaged, and during level transitions.	
    }
    takeDamage(source, sound=0){
        if (this.damageDelayTimer > this.damageDelay && !this.hidden && source.health > 0){
            if (sound){
                sound.play();
            }
            this.hurt = true;
            this.game.gameScreen.opacity = 150; 
            this.health -= source.damage;
            this.damageDelayTimer = 0;
        }
    }
	checkMapCollision(Vx, Vy){  
		this.collisionTiles.forEach(tile=> { 
			if (tile.collide(this)){  
				tile.collideEffect(this, Vx, Vy);
			}
		});
	}
	overlayEffect(){  //during damage
		if(this.hurt && this.health > 0){
			this.game.gameScreen.color = [255, 0, 0];
			this.game.gameScreen.opacity -= 10;
			if(this.game.gameScreen.opacity < 0){
				this.game.gameScreen.opacity = 0;
				this.game.gameScreen.color = [255, 255, 255];
				this.hurt = false;
			}
		}
	}
	draw() {  
		noStroke();
		fill(this.color);
		push();
		translate(this.P.x, this.P.y);
		rect(0,0,this.w,this.h,8);
		
		//eyes.  set height relative to width so size doesn't change while ducking
		fill(59, 255, 180);
		if( sin(radians(frameCount/2))>0 && sin(radians(frameCount/2))< 0.05 ) {
		ellipse(this.w/3.3,this.h/3,  this.w/3,this.w/15);
		ellipse(this.w/1.4,this.h/3,  this.w/3,this.w/15);
		}
		else {
		ellipse(this.w/3.5,this.h/3,  this.w/4,this.w/4.2);
		ellipse(this.w/1.4,this.h/3,  this.w/4,this.w/4.2);
		}
		fill(0, 0, 0);
		if (this.movements['69']){ 
			 ellipse(this.w/2.80,this.h/3,  this.w/14,this.w/14);
			 ellipse(this.w/1.25,this.h/3,  this.w/14,this.w/14);
		}
		else if (this.movements['81']){ 
			 ellipse(this.w/4.80,this.h/3,  this.w/14,this.w/14);
			 ellipse(this.w/1.55,this.h/3,  this.w/14,this.w/14);
		}
			else {
				ellipse(this.w/3.19,this.h/3,  this.w/14,this.w/14);
				ellipse(this.w/1.34,this.h/3,  this.w/14,this.w/14);
			}
		pop();    
	}
	stats(){
		noStroke();
		fill(255, 255, 255);
		textSize(height/25);
		textAlign(LEFT,CENTER);
		text("Health ", width/50,height/35);
		
		for(let i = 0; i< this.MAXHEALTH; i++){
			rect(width/50+i*21, height/17, 20, 10, 3);
		}
		fill(200, 50, 75);
		for(let i=0; i<this.health; i++){
			rect(width/50+i*21, height/17, 20, 10, 3);
		}
		//change to inventory slots with images 
		fill(255, 255, 255);
		textSize(height/25);
		text("Got Key?: ", 0.78*width,height/35);

		if(this.hasKey){
			text("Yes!",0.91*width,height/35);
		} else {
				text("NO", 0.91*width, height/35); 
				textSize(height/25);
				fill(255, 255, 255, 100*abs(sin(radians(1.5*frameCount))));
				text("Get the key !", 0.78*width, height/15);
				}
	}
}