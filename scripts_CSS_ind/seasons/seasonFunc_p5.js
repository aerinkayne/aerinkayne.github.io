// todo
// simplify tile and obj array, screen class updates


class Button {
	constructor(config){
	this.P = createVector(floor(config.x),floor(config.y)); 
	this.w = floor(config.w);
	this.h = floor(config.h);
	this.r = config.r || 0; 				
	this.txt = config.txt || 0;
	this.txtSize = config.txtSize || config.h/2.5;
	this.txtColor = config.txtColor || [0,0,0];
	this.btnColor = config.btnColor || [0,0,0];
	this.borderColor = config.borderColor || [0,0,0];
	this.strokeW = config.strokeW || 0.75;
	this.overlayAlpha = 0;
	this.selected = false;
	this.clickTimer = 0;
	this.clickDelay = 20;	//frames 
	this.paused = false;	
	this.onClick = config.onClick || 0;
	this.onHover = config.onHover || 0;
	this.offHover = config.offHover || 0;
	}
	updateTimer(){
		if (this.clickTimer < this.clickDelay){
			this.clickTimer++;
		}
	}
	checkClicks(){  //called in draw.  frame timer used to limit calls.  works ontouch.
		if (this.mouseIsOver(mouseX, mouseY) && mouseIsPressed){
			this.clickTimer=0;
			this.onClick();
		}
	}
	checkHover(){
		if (this.mouseIsOver(mouseX, mouseY)){
			this.onHover();
		}
		else {
			this.offHover();
		}
	}
	draw(x=this.P.x, y=this.P.y){
		if (x !== this.P.x || y !== this.P.y) {
			this.P.x = x;  this.P.y = y;
		}
		if(!this.paused){
			if(this.img){
				push();
				translate(x,y);
				fill(this.btnColor);
				noStroke();
				rect( - 2,  - 2, this.w + 4, this.h + 4, this.r);
				image(this.img, 0, 0, this.w, this.h);
				fill(0,0,0, this.overlayAlpha);
				rect(0, 0, this.w, this.h);
				pop();
			}
			else {
				push();
				translate(x,y);
				strokeWeight(this.strokeW);
				stroke(this.borderColor);
				fill(this.btnColor);
				rect(0, 0, this.w, this.h, this.r);
				strokeWeight(1);
				noStroke();
				textAlign(CENTER,CENTER);
				textSize(this.txtSize);
				fill(this.txtColor);
				text(this.txt, this.w/2, this.h/2);
				pop();
			}
		}
		this.updateTimer();

		if (this.clickTimer === this.clickDelay){
			this.checkClicks();
		}
		if (this.onHover){
			this.checkHover();
		}
	}
	mouseIsOver(mouseX, mouseY){
		return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
				mouseY > this.P.y && mouseY < this.P.y + this.h);
	}
}
class LevelSelectButton extends Button {
	constructor(config, x, y, season, lvIndex, img){
		super(config);
		this.P = createVector(floor(x), floor(y));
		this.season = season;
		this.accessLevel = lvIndex;
		this.img = img;
	}	
}


class Block {  
	constructor(x,y,w,h,img){  
		this.P = createVector(x,y); 
		this.C = createVector(x + w/2, y + h/2);
		this.w=w;
		this.h=h;
		this.img=img;
		this.checkCollisionForEnemies = true;
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
                this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}

	collideEffect(obj, Vx, Vy){ 
		//fill(200,0,0,50);
		//rect(this.P.x, this.P.y, this.w, this.h);
		if(Vy > 0){
			obj.V.y = 0;
			obj.falling = false;
			obj.P.y = this.P.y - obj.h;  
		}
		if(Vy < 0){
			obj.V.y = 0; 
			obj.P.y = this.P.y+this.h;
		}
		if(Vx < 0){
			obj.P.x = this.P.x + this.w;
			obj.checkGrounding ? obj.V.x *= -1 : obj.V.x = 0;	
		}
		if(Vx > 0){
			obj.P.x = this.P.x-obj.w;
			obj.checkGrounding ? obj.V.x *= -1 : obj.V.x = 0;
		}
	}
	draw() {
		push();
			image(this.img, this.P.x, this.P.y, this.w+1, this.h+1);  //overlap allows shading 
		pop();
	}  
}
class Mover extends Block{  
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.V = createVector(1,0);
		this.disp = floor(random(-75,75));  //so they don't all start at same P.x
		this.P.x += this.disp;
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
                this.P.y < obj.P.y + obj.h && this.P.y + this.h/2 > obj.P.y + 3/4*obj.h; //btm/4 player vs top/2 of mover
	}
	objIsOn(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
				obj.P.y === this.P.y - obj.h;
	}
	collideEffect(obj){  
		if(obj.V.y > 0){
			obj.V.y = 0;
			obj.falling = false;
			obj.P.y = this.P.y - obj.h;  
		}
		if (!obj.movements['81'] && !obj.movements['69']){
				obj.P.add(this.V);  
		}
	}
	draw(){
		push();
		fill(50, 205, 235);
		stroke(200, 255, 255);
		strokeWeight(1.5);
		rect(this.P.x, this.P.y, this.w, this.h, 4);
		strokeWeight(1);
		noStroke();
		fill(0, 0, 50,100);
		rect(this.P.x, this.P.y+3/4*this.h, this.w, this.h/4, 4);
		fill(255, 255, 255, 125);
		rect(this.P.x, this.P.y, this.w, this.h/4, 4);
		pop();
		}
	updatePosition(obj){ 
		if (this.disp > 2*this.w || this.disp < -2*this.w){
			this.V.x *= -1;
			if(this.objIsOn(obj)){
				obj.P.add(this.V);
			}
		}
		this.disp += this.V.x;
		this.P.add(this.V); 
		this.C.x = this.P.x + this.w/2;
		this.C.y = this.P.y + this.h/2;
	}
}

class Portal extends Block{
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.checkCollisionForEnemies = false;
		this.collected = false;
	}
	collideEffect(obj){
		if(obj.hasKey){
			obj.game.gameScreen.color = [255, 255, 255];
			obj.game.gameScreen.opacity += 1.5;
			if(obj.game.gameScreen.opacity > 255){
				obj.toNextLevel = true;
			} 
		}else if(!obj.hasKey){ 
			fill(0, 0, 0);
			textSize(15);
			textAlign(CENTER,CENTER);
			text("You need the key",this.P.x+this.w/2,this.P.y-this.h/2);
		}
	}
}
class Portkey extends Block{ 
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.checkCollisionForEnemies = false;
		this.collected = false;
	}
	draw() {
		if(!this.collected){
			image(this.img, this.P.x, this.P.y, this.w, this.h);
		}
	}
	collideEffect(obj){
		if(!obj.hasKey){
			soundKey.play();
			this.collected=true;
			obj.hasKey=true;
		}
	}
}

class Heart extends Block{
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.collected=false;
		this.checkCollisionForEnemies = false;
	}
	draw() {
		if (!this.collected){
			push();
			image(this.img, this.P.x, this.P.y, this.w, this.h);
			pop();
		}
	}
	collideEffect(obj){
		if(!this.collected && obj.health < obj.MAXHEALTH){
			soundHeart.play();
			obj.health++;
			this.collected = true;	
		}
	}
}

class Lava{
	constructor(x,y,w,h, arrColor){
		this.P = createVector (x,y);
		this.C = createVector (x + w/2, y + h/2);
		this.w = w;
		this.h = h;
		this.color = arrColor;
	}
	draw() {
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(this.color);
		beginShape();

		let alt = 2.5;
		for (let i=0; i<11; i++){
			vertex(i*this.w/10, alt*sin(radians(1.5*frameCount)));
			alt*=-1;
		}
		vertex(this.w, this.h);
		vertex(0, this.h);
		vertex(0,-alt*sin(radians(1.5*frameCount)));
		endShape();
		pop();
		noStroke();
	}
	collide(){
		return;  //TODO update later
	}
}



class SpikeU extends Block{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.tipMin = 0.3*h; 
		this.tipAmpl = 0.7*h; 
		this.tip;
		this.timer = 0;
		this.color = [180, 200, 240];
		this.damage = 1;
		this.health = 1;
		this.checkCollisionForEnemies = false;
	}
	collide(obj) {
		let subX;
		//first checks if player is between the spike's tip and its base
        if (this.P.y + this.tip < obj.P.y + obj.h && this.P.y + this.h > obj.P.y) {
			//1/2 spike base * (spike base - player base)/current spike height = amount to subtract from each side of the width
			subX =  this.w/2 * max((this.P.y + this.h)-(obj.P.y + obj.h), 0) / (this.h - this.tip);
            return  this.P.x + subX < obj.P.x + obj.w && this.P.x - subX + this.w > obj.P.x;
        }
	}
	updateTimer(){
		this.timer++;
		if (this.timer > 170){
			this.timer = 0;
		}
	}
	draw() {
		push();
		translate(this.P.x, this.P.y);		                 
		this.tip =  this.h - this.tipMin - this.tipAmpl*cos(radians(min(90, this.timer))); 
		stroke(255, 255, 255);
		strokeWeight(1);
		fill(this.color);
		triangle(0, 		this.h,
				 this.w,  	this.h,
				 this.w/2,	this.tip);
		noStroke();
		fill(20, 100, 170, 175);
		triangle(this.w/2,	this.h,
				 this.w-this.w/15,this.h,
				 this.w/2,	this.tip + this.h/30); 
		pop();
		this.updateTimer();
	}
	collideEffect(obj){
		obj.takeDamage(this, soundSpike);
	}
}
class SpikeD extends SpikeU{
	constructor(x,y,w,h){
		super(x,y,w,h);
	}
	collide(obj) {
		let subX;
        if (obj.P.y < this.P.y + this.tip && obj.P.y + obj.h > this.P.y) {
			subX =  this.w/2 * max((obj.P.y - this.P.y),0) / this.tip;
            return  this.P.x + subX < obj.P.x + obj.w && this.P.x - subX + this.w > obj.P.x;
        }
    }
	draw() {
		push();
		translate(this.P.x, this.P.y);
		this.tip =  this.tipMin + this.tipAmpl*cos(radians(min(90, this.timer))); 
		stroke(255, 255, 255);
		strokeWeight(1);
		fill(this.color);
		triangle(0,         0,
				 this.w,  	0,
				 this.w/2,	this.tip);
		fill(20, 100, 170, 175);
		noStroke();
		triangle(this.w/2,	0,
				 this.w - this.w/15,0,
				 this.w/2,	this.tip - this.h/30); 
		pop();
		this.updateTimer();
	}
}	

class SpikeL extends SpikeU{  //seems ok
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.tipMin = 0.3*w; 
		this.tipAmpl = 0.7*w; 
		this.tip;
	}
	collide(obj) {
		let subY;
        if (obj.P.x + obj.w > this.P.x + this.tip && obj.P.x < this.P.x + this.w) {
			subY =  this.h/2 * (max(this.P.x + this.w)-(obj.P.x + obj.w), 0) / (this.w - this.tip);
            return  obj.P.y + obj.h > this.P.y + subY && obj.P.y < this.P.y + this.h - subY ;
        }
    }
	draw() {
		push();
		translate(this.P.x, this.P.y);		                 
		this.tip =  this.w - this.tipMin - this.tipAmpl*cos(radians(min(90, this.timer))); //range 0-90 
		stroke(255, 255, 255);
		strokeWeight(1);
		fill(this.color);
		triangle(this.w, 		0,
				 this.w,  	this.h,
				 this.tip, this.h/2);
		noStroke();
		fill(20, 100, 170, 175);
		triangle(this.w, this.h/2,
				 this.w, this.h-this.h/15,
				 this.tip + this.w/30, this.h/2); 
		pop();
		this.updateTimer();
	}
}
class SpikeR extends SpikeU{  //check this
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.tipMin = 0.3*w; 
		this.tipAmpl = 0.7*w; 
		this.tip;
	}
	collide(obj) {
		let subY;
        if (obj.P.x + obj.w > this.P.x && obj.P.x < this.P.x + this.tip) {
			subY =  this.h/2 * max((obj.P.x - this.P.x), 0) / this.tip;
            return  obj.P.y + obj.h > this.P.y + subY && obj.P.y < this.P.y + this.h - subY;
        }
	}
	draw() {
		push();
		translate(this.P.x, this.P.y);   
		this.tip =  this.tipMin + this.tipAmpl*cos(radians(min(90, this.timer))); 
		stroke(255, 255, 255);
		strokeWeight(1);
		fill(this.color);
		triangle(0,         0,
				 0,  	this.h,
				 this.tip, this.h/2);
		fill(20, 100, 170, 175);
		noStroke();
		triangle(0, this.h/2,
				 0, this.h - this.h/15,
				 this.tip - this.h/30, this.h/2);
		pop();
		this.updateTimer();
	}
}





class Enemy{
	constructor(x, y, w, h){
		this.P = createVector(x, y);
		this.PosLast = 0;
		this.collisionTiles = [];
		this.V = createVector(-0.75, 0);
		this.C = createVector(x+w/2, y+h/2);
		this.w = w;
		this.h = h;
		this.gravity = 0.4;
		this.checkGrounding = true;
		this.grounded = true;
		this.falling = false;
		this.distMax = 2*w;  //update later.  should be ok for now.
		this.dead = false;
		this.damage = 1;
		this.damageDelay = 40; 
		this.damageDelayTimer = this.damageDelay + 1;
		this.health = 1;
		this.frameCycleTime = 30;  //@60frames per second
		this.frameTime = 0;
		this.sprites = [imgEnm1L, imgEnm2L, imgEnm1R, imgEnm2R];
		this.img = imgEnm1L;
	}
	updateSprites(){
		if (this.V.x < 0){
			this.frameTime/this.frameCycleTime < 0.5 ? this.img = this.sprites[0] : this.img = this.sprites[1];
		} else {
			this.frameTime/this.frameCycleTime < 0.5 ? this.img = this.sprites[2] : this.img = this.sprites[3];
		}
	}
	updateFrameTime(){
		this.frameTime++;
		if (this.frameTime === this.frameCycleTime){
			this.frameTime = 0;
		}
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		image(this.img, 0,0,this.w, this.h)
		//fill(150,0,0);
		//rect(this.P.x, this.P.y, this.w, this.h, 3);
		pop();
		this.updateFrameTime();
		this.updateSprites();
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
				this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}
	takeDamage(source, sound = 0){
		if (this.damageDelayTimer > this.damageDelay){
			if (sound){sound.play();}
			this.health-=source.damage;
			if (this.health <= 0){
				this.dead = true
			}
			source.V.y = -source.h/7;
			this.damageDelayTimer = 0;
		}
	}
	collideEffect(obj){
		obj.P.y + obj.h < this.P.y + this.h/2 ?
		this.takeDamage(obj, soundSquish) : obj.takeDamage(this, soundSqueak);
	}
	getCollisionTiles(game){
		this.collisionTiles = game.mapTiles.filter(tile=>{
			return dist(tile.C.x, tile.C.y, this.C.x, this.C.y) < this.distMax && tile.checkCollisionForEnemies && tile !== game.player;
		});
	}
	update(game){
		if (!this.dead){
			//filter mapTiles if PosNow is still 0, or if mob has moved more than 1 width since last filtering
			if (!this.PosLast || dist(this.P.x, this.P.y, this.PosLast.x,this.PosLast.y) >= this.w ){
				this.PosLast = createVector(this.P.x, this.P.y); 	//create or update PosLast	
				this.updateCenterPosition();				 		//updateC for tile check
				this.getCollisionTiles(game);				        //get tiles to check
			}
			//update x position
			this.P.x += this.V.x;
			//check for new x collisions (V.x)
			this.checkMapCollision(this.V.x, 0); 
			//update y
			this.falling = true;
			this.V.y += this.gravity;
			this.P.y += this.V.y;
			//check for new y collision (V.y)  
			this.checkMapCollision(0, this.V.y); 
			this.checkGroundingPoints();
			//flip x direction if not grounded
			if (!this.grounded && !this.falling){
				this.V.x *= -1;
			}
		} else {
			this.V.y += this.gravity;
			this.P.y += this.V.y;
		}
	}
	updateCenterPosition(){
		this.C.x = this.P.x + this.w/2;
		this.C.y = this.P.y + this.h/2;
	}
	checkGroundingPoints(){
		this.updateCenterPosition();
		this.grounded = false; 
		this.collisionTiles.forEach(tile=>{
			//rect(tile.P.x, tile.P.y, tile.w, tile.h);
			if (tile.C.y-this.C.y > 0 && tile.C.y-this.C.y < tile.h && this.C.x >= tile.P.x && this.C.x <= tile.P.x + tile.w){
				this.grounded = true;  
			}
		});
	}
	checkMapCollision(Vx, Vy){      
		this.collisionTiles.forEach(tile=> {
			//stroke(0);  //call range check
			//line(this.C.x, this.C.y, tile.C.x, tile.C.y);		 
			if (tile.collide(this)){
				tile.collideEffect(this, Vx, Vy);
			} 
		});
	}
}
class SpikedEnemy extends Enemy{
	constructor(x, y, w, h){
		super(x, y, w, h);
		this.sprites = [imgEnSpike1L, imgEnSpike2L, imgEnSpike1R, imgEnSpike2R];
		this.img = imgEnSpike1L;
	}
	collideEffect(obj){
		obj.takeDamage(this, soundSqueak);
	}
}


//decorative objs with draw method or sprite and z index
class Deco{
	constructor(x, y, w, h, img, z){
		this.P = createVector(x,y);
		this.C = createVector(x+w/2, y+h/2);
		this.w=w;
		this.h=h;
		this.img = img; 
		this.checkCollisionForEnemies = false;
		this.z_Index = z;
	}
	draw(){
		image(this.img, this.P.x, this.P.y, this.w, this.h);
	}
	collide(){
		return;
	}
}	
class LeafPile extends Deco{
	constructor(x, y, w, h){  //uses size for collision, draw modified so that image extends beyond edges
		super(x, y, w, h);
		this.img = imgLeafP;
		this.z_Index = 3;
	}
	draw(){
		image(this.img, this.P.x - this.w/4, this.P.y, 3/2*this.w, this.h); 
	}
	isInside(obj){
		return 	obj.P.x >= this.P.x && obj.P.x + obj.w <= this.P.x + this.w &&
				obj.P.y >= this.P.y && obj.P.y + obj.h <= this.P.y + this.h;
	}
	collide(obj){
		if(this.isInside(obj)){
			if (!obj.hidden){soundLeaves.play();}
			obj.hidden = true;
		} else {obj.hidden = false;}  //TODO check this in player too at other times
	}
}
class Water extends Deco{
	constructor(x, y, w, h){
		super(x, y, w, h);
		this.z_Index = 3;
		this.color = [76, 117, 222,150];
		this.surfaceColor = [230, 245, 255];
	}	
	draw(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(this.color);
		let waveH = this.w/15;
		rect(0,waveH*sin(radians(frameCount)), this.w, this.h-waveH*sin(radians(frameCount)));
		
		fill(this.surfaceColor);
		beginShape();
		curveVertex(0, 1.5*waveH*sin(radians(frameCount))+waveH*sin(radians(frameCount)));
		for (let i=0; i <=4; i++){
			curveVertex(i*this.w/4, 1.5*waveH*sin(radians(frameCount)) + waveH*sin(radians(frameCount) + i*PI/2));
		}
		for (let i=4; i>0; i--){
			curveVertex(i*this.w/4, 1.5*waveH*sin(radians(frameCount)) - waveH*sin(radians(frameCount) + i*PI/2));
		}
		curveVertex(0, 1.5*waveH*sin(radians(frameCount))-waveH*sin(radians(frameCount)));
		endShape(CLOSE);
		pop();
	}
}	
