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
	this.clickDelay = 20;	
	this.paused = false;	
	this.onClick = config.onClick || 0;
	this.onHover = config.onHover || 0;
	this.offHover = config.offHover || 0;
	}
	checkClicks(){  //called in draw.  timer used to limit calls.  works ontouch
		if (this.clickTimer < this.clickDelay) {this.clickTimer++;}
		if (this.mouseIsOver(mouseX, mouseY) && this.clickTimer === this.clickDelay && mouseIsPressed){
			this.onClick();
			this.clickTimer=0;
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
	draw(){
		
		if(this.img){
			fill(this.btnColor);
			noStroke();
			rect(this.P.x - 2, this.P.y - 2, this.w + 4, this.h + 4, this.r);
			image(this.img, this.P.x, this.P.y, this.w, this.h);
			fill(0,0,0,this.overlayAlpha);
			rect(this.P.x, this.P.y, this.w, this.h);
		}
		else {
			strokeWeight(this.strokeW);
			stroke(this.borderColor);
			fill(this.btnColor);
			rect(this.P.x, this.P.y, this.w, this.h, this.r);
			strokeWeight(1);
			noStroke();
			textAlign(CENTER,CENTER);
			textSize(this.txtSize);
			fill(this.txtColor);
			text(this.txt,this.P.x+this.w/2, this.P.y+this.h/2);
		}
		
		this.checkClicks();
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





class Player {
	constructor (x,y,w,h){
		this.P = createVector(x,y);
		this.T = createVector(0,0); //holds translation vals.  update in setup
		this.w = w;
		this.h = h;
		this.V = createVector(0,0);
		this.moveSpeed = 0.25;
		this.MAXSPEED = 4;
		this.MAXHEALTH = 6;
		this.falling = false;
		this.gravity = createVector(0,0.4);
		this.movements = {81:false, 69:false, 32:false}; //q e space
		//[39,37,38,40]; //RIGHT,LEFT,UP,DOWN
		 
		this.color = (50, 50, 50);
		this.health = 3;
		this.hasKey = false;
		this.toNextLevel = false;
		this.damageDelay = 40; //limits calls for damaging collisions
		this.damageDelayTimer = this.damageDelay + 1;
		this.z_Index = 2;
	}
	
	updateTranslation(game){
		this.T.x = (this.P.x + this.w/2 >= game.levelW - width/2) ? 
			game.levelW-width : round(max(0, this.P.x + this.w/2 - width/2));
		this.T.y = (this.P.y + this.h/2 >= game.levelH - height/2)? 
			game.levelH-height : round(this.P.y + this.h/2 - height/2);  //no upper bound
	} 

	update(arr, game){  
		//horizontal constrain
		this.P.x = constrain(this.P.x, 0, game.levelW-this.w);
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
		//limit horizontal speed
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
		this.checkMapCollision(arr, this.V.x, 0); 
		//update y position
		this.falling=true;
		this.V.add(this.gravity);
		this.P.y += this.V.y;
		//check y collision
		this.checkMapCollision(arr, 0, this.V.y);  
		
		//decelerate.  TODO vary friction with different surfaces
		if(!this.movements['69'] && !this.movements['81']){
			if(this.V.x > 0){
				this.V.x -= this.moveSpeed;
			}
			if(this.V.x < -0){
				this.V.x += this.moveSpeed;
			}
		}
		this.updateTranslation(game);
		//dmg delay timer
		if (this.damageDelayTimer <= this.damageDelay){
			this.damageDelayTimer ++;
		}	
	}
	
	//collision with map tiles that affect position.  check x and y separately in player.update.
	checkMapCollision(arr, Vx, Vy){  
		for(let i=0; i<arr.length; i++){
			//don't bother checking collision for blocks that are more than a few tiles away
			if(abs(arr[i].P.dist(this.P)) < 2*arr[i].w && arr[i].collide(this)){ 
				arr[i].collideEffect(this, Vx, Vy);
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
			rect(width/50+i*21, height/17, 20, 10, 4);
		}
		fill(200, 50, 75);
		for(let i=0; i<this.health; i++){
			rect(width/50+i*21, height/17, 20, 10, 4);
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




class Block {  
	constructor(x,y,w,h,img){  
		this.P = createVector(x,y); 
		this.w=w;
		this.h=h;
		this.img=img;
	}
	collide(obj){
		//rect(this.P.x, this.P.y, this.w, this.h);  //call distance check
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
                this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}
	collideEffect(obj, Vx, Vy){ 
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
			obj.V.x = 0;
			obj.P.x = this.P.x + this.w;
		}
		if(Vx > 0){
			obj.V.x = 0;
			obj.P.x = this.P.x-obj.w;
		}
	}
	draw() {
		push();
			image(this.img, this.P.x, this.P.y, this.w+1, this.h+1);  //overlap helps with spaces
		pop();
	}  
}
class Mover extends Block{  
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.V = createVector(1,0);
		this.img = img;  //needed for now for char position updates
		this.disp = floor(random(-75,75));  //so they don't all start at same P.x
		this.P.x += this.disp;
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
                this.P.y < obj.P.y + obj.h && this.P.y + this.h/2 > obj.P.y + 3/4*obj.h; //btm/4 player vs top/2 of mover
	}
	collideEffect(obj, Vx, Vy){ //moving platforms are checked along with other map tiles 
		if(Vy > 0){
			obj.V.y = 0;
			obj.falling=false;
			obj.P.y = this.P.y - obj.h;  
		}
		if (!obj.movements['81'] && !obj.movements['69']){
				obj.V.x = this.V.x*(1+obj.moveSpeed);  //accounts for deceleration
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
	update(player){ 
		if (this.disp > 4*player.w || this.disp < -4*player.w){
			this.V.x *= -1;
			this.P.x -= 2*this.V.x; //fixes turn around jitter
		}
		this.disp += this.V.x;
		this.P.add(this.V); 
	}
}
class Portal extends Block{
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.collected=false;
	}
	//replace this with collideEffect and check collision in player update
	update(player){
		if(this.collide(player) && player.hasKey){
			canvasOverlay=color(255, 255, 255, transparency);
			transparency+=10;
			if(transparency>255){
				player.toNextLevel = true;
			} 
		}else if(this.collide(player) && !player.hasKey){ 
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
		this.collected=false;
	}
	draw() {
		if(!this.collected){
			image(this.img, this.P.x, this.P.y, this.w, this.h);
		}
	}
	update(player){
		if(!player.hasKey && this.collide(player)){
			soundKey.play();
			this.collected=true;
			player.hasKey=true;
		}
	}
}

class SpikeU extends Block{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.jab;
		this.hurt;
	}
	collide(obj) {
		//rect(this.P.x, this.P.y+this.jab, this.w, this.h-this.jab); //uncomment to check height and dist from player when called
		let subX;
		//checks if y range of player is between tip (P.y+variable y amount) and spike's base
        if (this.P.y + this.jab < obj.P.y + obj.h && this.P.y + this.h > obj.P.y){
			//1/2 base * distance of player's base from spike's base / current spike height = amount to subtract from normal x range
            subX =  this.w/2 * ( (this.P.y + this.h)-(obj.P.y + obj.h) ) / (this.h - this.jab);
			//rect(this.P.x + subX, this.P.y, this.w-2*subX, 4);  //check range 
            return  this.P.x + subX < obj.P.x + obj.w && this.P.x - subX + this.w > obj.P.x;
        }
    }
	draw() {
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		this.jab = 1.8/3*this.h*abs(sin(radians(1/2*frameCount*2%100))); 
		
		fill(210, 230, 255);
		triangle(0, 		this.h,
				 this.w,  	this.h,
				 this.w/2,	this.jab);
		fill(20, 100, 170,200);
		triangle(this.w/2,	this.h,
				 this.w-this.w/15,this.h,
				 this.w/2,	this.jab + this.h/30);
		stroke(255, 255, 255,200);
		strokeWeight(1);
		line(0, this.h,  	this.w/2, this.jab);
		line(this.w/2,this.h, 	this.w/2, this.jab); 
		strokeWeight(1);
		noStroke();
		pop();
	}
	update(player){
		if(abs(player.P.dist(this.P)) < 5/4*this.h && this.collide(player) && player.damageDelayTimer > 40){ 
			this.hurt=true;
			transparency=150;  
			player.health--;
			player.damageDelayTimer = 0;
			soundSpike.play();
		}
		//todo: add to screen class
		if(this.hurt){
			canvasOverlay=color(255, 0, 0,transparency);
			transparency-=15;
			if(transparency<0){
				transparency=0;
				canvasOverlay=color(255, 255, 255,transparency);
				this.hurt=false;
			}
		}
	}
}
class SpikeD extends SpikeU{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.jab;
		this.hurt;
	}
	collide(obj) {
		//fill(255,20,20,50);
		//rect(this.P.x, this.P.y, this.w, this.h-this.jab); //to check height and dist from player when called
		let subX;
        if (this.P.y < obj.P.y + obj.h && this.P.y + this.h - this.jab > obj.P.y){
            subX =  this.w/2 * (obj.P.y - this.P.y) / (this.h - this.jab);
			//fill(255,0,0);
			//rect(this.P.x + subX, this.P.y, this.w-2*subX, 4);  //check range 
            return  this.P.x + subX < obj.P.x + obj.w && this.P.x - subX + this.w > obj.P.x;
        }
    }
	draw() {
		push();
		translate(this.P.x, this.P.y);
		
		noStroke();
		this.jab = 1.8/3*this.h*abs(sin(radians(1/2*frameCount*2%100))); 
		
		fill(210, 230, 255);
		triangle(0,         0,
				 this.w,  	0,
				 this.w/2,	this.h-this.jab);
		fill(20, 100, 170, 200);
		triangle(this.w/2,	0,
				 this.w - this.w/15,0,
				 this.w/2,	this.h-this.jab - this.h/30);
		stroke(255, 255, 255, 200);
		strokeWeight(1);
		line(0, 0, 		 this.w/2, this.h-this.jab);
		line(this.w/2, 0, this.w/2, this.h-this.jab);
		strokeWeight(1);
		noStroke();
		pop();
	}
}	
class Heart extends Block{
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.collected=false;
	}
	draw() {
		if (!this.collected){
			push();
			image(this.img, this.P.x, this.P.y, this.w, this.h);
			pop();
		}
	}
	update(player){
		if(!this.collected && player.health < player.MAXHEALTH && this.collide(player) ){
			soundHeart.play();
			player.health++;
			this.collected = true;	
		}
	}
}

class Lava{
	constructor(x,y,w,h, colorChar){
		this.P = createVector (x,y);
		this.w = w;
		this.h = h;
		if (colorChar === "l"){
			this.color= color(180, 0, 0);
		}
		if (colorChar === "p"){
			this.color= color(0, 120, 0);
		}
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
}

//background/foreground objects.  
class Snowflake{
	constructor(x,y, min, max){
		this.P = createVector(x,y);
		this.scale = random(min, max);  
		this.V = createVector(this.scale*random(-1,1), this.scale*2);
		this.w = this.h = ceil(5*this.scale);  //for bounds check
		this.opacity = 75 + 180*this.scale;
		
	}
	update(gameScreen){  
		if (this.P.x + this.w < gameScreen.P.x){
			this.P.x = gameScreen.P.x + gameScreen.w + this.w;
		}
		if (this.P.x - this.w > gameScreen.P.x + gameScreen.w){
			this.P.x = gameScreen.P.x - this.w;
		}
		if (this.P.y + this.h < gameScreen.P.y){
			this.P.y = gameScreen.P.y + gameScreen.h + this.h;
		}
		if (this.P.y - this.h > gameScreen.P.y + gameScreen.h){
			this.P.y = gameScreen.P.y - this.h;
		}
		this.P.add(this.V);

	}
	draw() {
		noStroke();
		fill(255, 255, 255, this.opacity);
		push();
		translate(this.P.x, this.P.y);
		ellipse(0,0,this.w/2+random(this.w/2), this.h/2+random(this.h/2));
		pop();
	}
}
class Raindrop extends Snowflake{
	constructor(x,y, min, max){
		super(x,y, min, max);
		this.V = createVector(4,10);
		this.opacity = 75 + 100*this.scale;
	}
	draw() {
		stroke(186, 219, 255, this.opacity);
		push();
		translate(this.P.x, this.P.y);
		line(0,0,this.V.x,this.V.y);
		pop();
	}
}

class Leaf extends Snowflake{
	constructor(x,y){
		super(x,y);
		this.V = createVector(random(-1,1), random(0.5, 1));
		this.w = random(3.5, 11); 
		this.h = random(3.5, 11);
		this.angle = 0;
		this.spinSpeed = random(1,5);
		this.color = [random(150,230), random(50, 200), random(25, 50)];
	}
	draw() {
		this.angle += this.spinSpeed; //updating spin here
		noStroke();
		fill(this.color);
		push();
		translate(this.P.x,this.P.y);
		rotate(radians(this.angle));
		ellipse(0,0, this.w, this.h);
		pop();
	}
}

class Hills {  
	constructor(game, arrPV, speed){ //lvW,H,player,level from gameScreen
		this.arrPV = arrPV;
		this.levelW = game.levelW;
		this.levelH = game.levelH;
		this.player = game.player;
		this.currentLevel = game.currentLevel;
		this.speed = speed;
	}
	draw(color, lakeBool) {  //currently called from screenEffects 
		push();
		//parallax effect 
		translate(-this.speed*this.player.T.x, 0);
		//subtract height because T is h/2 less than P, and only increments until h/2 before levelH
		translate(0, this.speed*(this.levelH-height-this.player.T.y));
		
		fill(color);
		beginShape();
		curveVertex(0, this.levelH);
		curveVertex(0, this.levelH);
		curveVertex(0, this.arrPV[0].y); 
		
			for (let i = 0; i < this.arrPV.length; i++){
				curveVertex(this.arrPV[i].x,  this.arrPV[i].y); 
			}
			
		curveVertex(this.levelW, this.arrPV[this.arrPV.length-1].y);
		curveVertex(this.levelW, this.levelH);
		curveVertex(this.levelW, this.levelH);
		endShape(CLOSE); 
		
		//draw a lake effect if it has been set to true.  TODO needs rework.
		if (levelData[this.currentLevel].hasLake && lakeBool){
			fill(30, 100, 150);
			rect(this.arrPV[0].x, this.arrPV[0].y+66, this.levelW, this.levelH-this.arrPV[0].y);
			fill(150, 190, 220, 60);  
				for (let i = 1; i<6; i++){
					rect(0, this.arrPV[0].y+66, this.levelW, height/(5+5*i*i));
				}
		}
		pop();
	}
}

//decorative objs with draw method or sprite and z index for additional effects
class Deco{
	constructor(x, y, w, h, img, z){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.img = img; 
		this.z_Index = z;
	}
	draw(){
		image(this.img, this.P.x, this.P.y, this.w+1, this.h);
	}
}	
class Glass extends Deco{
	constructor(x, y, w, h, img, z){
		super(x, y, w, h, img, z);
	}	
	draw(){  //TODO sprite me!
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(100,150,200);
		rect(0,0,this.w,this.h);
		for (let r = 0; r < 2; r++){  		//pane row position
			for (let c = 0; c < 2; c++){    //pane col position
				noStroke();
				fill(0, 0, 30, 125);
				rect(13/50*this.w+c*this.w/2, 13/50*this.h+r*this.h/2, 1/5*this.w, 1/5*this.h);
				fill(245, 245, 255, 200);
				rect(1/25*this.w+c*this.w/2, 1/25*this.h+r*this.h/2, 1/5*this.w, 1/5*this.h);
				stroke(204, 238, 255);
					line(this.w/2*c, 0,  this.w/2*c, this.h);
			}
			line(0, this.w/2*r,  this.w, this.w/2*r);
		}
		line(this.w, 0,  this.w, this.h);
		line(0, this.h,  this.w, this.h);
		noStroke();
		pop();
	}
}
class Water extends Deco{
	constructor(x, y, w, h, img, z){
		super(x, y, w, h, img, z);
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
