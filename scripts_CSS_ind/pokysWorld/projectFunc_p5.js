
let getDistance = function(obj1, obj2){ //returns dist between center of two objects where P is top left corner as vector
	return sqrt(sq(obj1.P.x + obj1.w/2 -(obj2.P.x + obj2.w/2)) + 
				sq(obj1.P.y + obj1.h/2 -(obj2.P.y + obj2.h/2))); 
}

class Button{
	constructor(config){
	this.P = createVector(config.x,config.y);
	this.w = config.w;
	this.h = config.h;
	this.r = config.r;  //border radius for rectangles
	this.txt = config.txt;
	this.txtSize = config.txtSize;
	this.txtColor = config.txtColor;
	this.btnColor = config.btnColor;
	this.clickTimer = 0;
	this.clickDelay = 20;
	this.onClick = config.onClick;
	}
	checkClicks(){  //called in draw.  timer used to limit calls.  works ontouch
		if (this.clickTimer < this.clickDelay) {this.clickTimer++;}
		if (this.mouseIsOver(mouseX,mouseY) && this.clickTimer === this.clickDelay && mouseIsPressed){
			this.onClick();
			this.clickTimer=0;
		}
	}
	draw(){
		fill(this.btnColor);
		rect(this.P.x, this.P.y, this.w, this.h, this.r);
		textAlign(CENTER,CENTER);
		textSize(this.txtSize);
		fill(this.txtColor);
		text(this.txt,this.P.x+this.w/2, this.P.y+this.h/2);
		this.checkClicks();
	}
	mouseIsOver(mouseX, mouseY){
		return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
				mouseY > this.P.y && mouseY < this.P.y + this.h);
	}
}

class LevelSelectButton extends Button{
	constructor(config, number){
	super(config);
	this.accessLevel = number-1;
 this.txt = `This path leads to ${number}`;
	}
}

class MapTile {  
	constructor(x,y,w,h){  
		this.P = createVector(x,y);
		this.w = w;
		this.h = h;
		this.img = 0;
		this.sprites = [];
		this.cycleTime = 250;
		this.drawTimer = 0;
		this.frictionVal = 1;   //same as intial values of character class 
		this.jumpVal = 11; 
		this.accelerationVal = 0.5;
		this.maxSpeedVal = 3.5;
	}
	conferProperties(obj){
		obj.jumpForce = this.jumpVal;
		obj.friction = this.frictionVal;
		obj.acceleration = this.accelerationVal;
		obj.maxSpeed = this.maxSpeedVal;
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
          this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}
	collideEffect(obj, Vx, Vy){ 
		if(Vy > 0){
			obj.V.y = 0;
			obj.P.y = this.P.y - obj.h;  
			obj.canJump = true;
			obj.canSwim = false;
			this.conferProperties(obj);
		}
		if(Vy < 0){
			obj.V.y = 0;
			obj.P.y = this.P.y+this.h;
		}
		if(Vx < 0){
			obj.V.x = 0;
			obj.P.x = this.P.x + this.w;
		}
		if(Vx > 0){
			obj.V.x = 0;
			obj.P.x = this.P.x-obj.w;
		}
	}
	updateDrawTimer(){
		this.drawTimer++;
		if (this.drawTimer >= this.cycleTime){
			this.drawTimer = 0;
		}
	}
	draw() {
		push();
		translate(this.P.x, this.P.y);
		if (this.img){image(this.img, 0, 0, this.w+1, this.h+1);} //overlap covers right and bottom outline
		else if(this.sprites.length){
			let numSprites = this.sprites.length;
			let timePerSprite = this.cycleTime/numSprites;
			let i = floor(this.drawTimer/timePerSprite);
			image(this.sprites[i], 0, 0, this.w+1, this.h+1); 
			this.updateDrawTimer();
		}
		pop();
	}  
}
class MovingTile extends MapTile{
	constructor(x,y,w,h,vx,vy){
	super(x,y,w,h);
	this.V = createVector(vx,vy);
	this.Vhold = createVector(0,0);
	this.cycleTime = 600;
	this.holdTime = 100;
	this.offset = floor(random(this.holdTime, this.cycleTime));
	this.timer = this.offset;
	this.P.x += (this.timer-this.holdTime)*this.V.x;  //move location to correspond to timer value
	this.P.y += (this.timer-this.holdTime)*this.V.y; 
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
          this.P.y < obj.P.y + obj.h && this.P.y + this.h/4 > obj.P.y+obj.h/4;
	}
	collideEffect(obj){ 
		if(obj.V.y > 0){
			obj.V.y = 0;
			obj.P.y = this.P.y - obj.h;  
			obj.canJump = true;
			obj.canSwim = false;
			this.conferProperties(obj);
		}
		if (this.timer > this.holdTime){
			obj.P.x += this.V.x;
		}
	}
	updatePosition(){
		this.timer++;
		(this.timer <= this.holdTime) ? this.P.add(this.Vhold) : this.P.add(this.V);
		if(this.timer === this.cycleTime){
			this.timer = 0;
			this.V.mult(-1);
		}
	}
}
class IceMover extends MovingTile{
	constructor(x,y,w,h,vx,vy){
	super(x,y,w,h,vx,vy);
	this.img = sprMoveIce;
	}
}
class CloudMover extends MovingTile{
	constructor(x,y,w,h,vx,vy){
	super(x,y,w,h,vx,vy);
	this.jumpVal = 15;
	this.img = sprMoveCloud;
	}
}


class DirtTile extends MapTile{
	constructor(x,y,w,h, img){
	super(x,y,w,h);
	this.img = img;
	}
}
class CloudTile extends MapTile{
	constructor(x,y,w,h, arrSprites){
	super(x,y,w,h);
	this.sprites = arrSprites;
	this.jumpVal = 15;
	}
}
class IceTile extends MapTile{
	constructor(x,y,w,h, img){
	super(x,y,w,h);
	this.img = img;
	this.frictionVal = 0.05;   
	this.accelerationVal = 0.1;
	this.maxSpeedVal = 5;
	}
}
class ClimbTile extends MapTile{
	constructor(x,y,w,h, img){
	super(x,y,w,h);
	this.img = img;
	}
	collideEffect(obj){
		obj.canClimb = true;
		this.conferProperties(obj);
	}
}
class WaterTile extends MapTile{
	constructor(x,y,w,h,hasSurface){
		super(x,y,w,h);
		this.hasSurface = hasSurface;
		this.fatigue = 1;
		this.jumpVal = 8;
		this.color = [60,95,205, 140];
		this.surfaceColor = [220,230,255];
	}
	collideEffect(obj){
		obj.canSwim = true;  
		if(obj.V.y > 0){
			obj.canJump = true;
		}
		if(obj.V.y > 1.5){
			obj.V.y = 1.5;
		}
		if(obj.fatigueTimer === obj.fatigueDelay){  
			obj.takeFatigue(this.fatigue);
		}
		this.conferProperties(obj);
		
	}	
	draw() {
  noStroke();
		fill(this.color);
		push();
		translate(this.P.x, this.P.y);
		if(this.hasSurface){
			let alt = 2;
			rect(0,alt*sin(radians(frameCount)), this.w, this.h-alt*sin(radians(frameCount)));
			fill(this.surfaceColor);
			beginShape();
			curveVertex(0, 1.5*alt*sin(radians(frameCount))+alt*sin(radians(frameCount)));
			for (let i=0; i <=4; i++){
				curveVertex(i*this.w/4, 1.5*alt*sin(radians(frameCount)) + alt*sin(radians(frameCount) + i*PI/2));
			}
			for (let i=4; i>0; i--){
				curveVertex(i*this.w/4, 1.5*alt*sin(radians(frameCount)) - alt*sin(radians(frameCount) + i*PI/2));
			}
			curveVertex(0, 1.5*alt*sin(radians(frameCount))-alt*sin(radians(frameCount)));
			endShape(CLOSE);
		}
		else{rect(0,0,this.w,this.h);}
		pop();
	}
}
class LavaTile extends MapTile{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.alt = 4;
		this.damage = 5;
		this.color = [225,50,10];
	}
	collideEffect(obj){
		if(obj.V.y > 0 && obj.P.y + obj.h > this.P.y + 3/4*this.h){
			obj.V.y = 0;
			obj.P.y = this.P.y + 3/4*this.h - obj.h;  
			obj.canJump = true;
			if(obj.damageTimer === obj.damageDelay){
				obj.takeDamage(this.damage);
			}
			this.conferProperties(obj);
		}
	}	
	draw() {
		fill(this.color);
		noStroke();
		push();
		translate(this.P.x, this.P.y);

		beginShape();

		for (let i=0; i<11; i++){
			vertex(i*this.w/10, this.alt*sin(radians(2*frameCount)));
			this.alt*=-1;
		}
		vertex(this.w, this.h);
		vertex(0, this.h);
		vertex(0,-this.alt*sin(radians(2*frameCount)));
		this.alt*=-1;
		endShape();
		pop();
	}
}
class HealthSpringTile extends LavaTile{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.alt = 1.5;
		this.damage = -5;
		this.color = [0,200,225, 125];
	}
	collideEffect(obj){
		if(obj.damageTimer === obj.damageDelay){
			obj.takeDamage(this.damage);
		}
	}
}

//*************************************

class Collectable extends MapTile{
	constructor(x,y,w,h){
	super(x,y,w,h);
	this.collected = false;
	}
	modHealth(obj){
		
	}
	modMana(obj){
		
	}
	modInventory(obj){
		
	}
	collideEffect(obj){
		this.collected = true;
	}
	draw() {
		if (!this.collected){
			push();
			translate(this.P.x, this.P.y);
			if (this.img){image(this.img, 0, 0, this.w, this.h);} 
			else if(this.sprites.length){
				let numSprites = this.sprites.length;
				let timePerSprite = this.cycleTime/numSprites;
				let i = floor(this.drawTimer/timePerSprite);
				image(this.sprites[i], 0, 0, this.w, this.h); 
				this.updateDrawTimer();
			}
			pop();
		}
	} 
}
class Heart extends Collectable{
	constructor(x,y,w,h){
	super(x,y,w,h);	
	this.cycleTime = 50;
	this.numberVal = 10;
	this.sprites = [sprHeart1, sprHeart2];
	}
	collideEffect(obj){
		if(!this.collected && obj.health < obj.maxHealth){
			this.collected = true;
			obj.health += this.numberVal;
			if(obj.health > obj.maxHealth){
				obj.health = obj.maxHealth;
			}
		}
	}
}
class ImageTile extends MapTile{
	constructor(x,y,w,h){
	super(x,y,w,h);	
	}
	collide(){
		return 0;
	}
}
class GrassTile extends ImageTile{
	constructor(x,y,w,h){
	super(x,y,w,h);	
	this.img = sprGrass1;
	}
}
class CloverTile extends ImageTile{
	constructor(x,y,w,h){
	super(x,y,w,h);	
	this.img = sprClover1;
	}
}