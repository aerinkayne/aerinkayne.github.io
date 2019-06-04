// issues: mover collision of top of player from bottom needs fix (check btm of player vs top of mover) 
// notes: ObjectHandler and Game classes are in their own files.

function buttonClicked(x,y,w,h,txt){
    stroke(0);
    strokeWeight(1);
    
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h){
        fill(65,250,255);
    }
    else{
        fill(75,205,225);
    }
    
    var txtPos=h/30;
	
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h&& mouseIsPressed){
        rect(x,y,w,h,10);
        
        fill(0);
        textAlign(CENTER,CENTER);
        textSize(10);
        text(txt,x+(w/2),y+(h/2)+txtPos);
        textAlign(LEFT,LEFT);
        
        return true; 
    }
    
    rect(x,y,w,h,10);
    
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(10);
    text(txt,x+(w/2),y+(h/2));
    textAlign(LEFT,LEFT);
    strokeWeight(1);
}

// works for (upwards) triangles and rectangles
function collide(obj1,obj2){ //make player consistently obj2
    if (obj1.type !== "triangle"){
        return  obj1.P.x < obj2.P.x + obj2.w && obj1.P.x + obj1.w > obj2.P.x &&
                obj1.P.y < obj2.P.y + obj2.h && obj1.P.y + obj1.h > obj2.P.y;
        }
    else if (obj1.type === "triangle"){
        //subtracts from X collision points using char baseY of object height
        var subX;
        if (obj1.P.y + obj1.jab < obj2.P.y + obj2.h && obj1.P.y + obj1.h > obj2.P.y){
            subX =  obj1.w/2 * ( (obj1.P.y + obj1.h)-(obj2.P.y + obj2.h) ) / obj1.h;
            return  obj1.P.x + subX < obj2.P.x + obj2.w && 
                    obj1.P.x - subX + obj1.w > obj2.P.x &&
                    obj1.P.y < obj2.P.y + obj2.h && 
                    obj1.P.y + obj1.h > obj2.P.y;
        }
    }    
}

function onScreen(obj1, obj2){ //checks if obj1 and 2 are both onscreen
    return abs(obj2.P.x - obj1.P.x)<width/2 +min(width/2, abs(obj2.P.x-obj1.P.x))&&
           abs(obj2.P.y - obj1.P.y)<height/2 +min(height/2,abs(obj2.P.y-obj1.P.y));
}

//sorts an array by a property value, where str is the property name)
function sortArrByProperty(arr, str){
    var holder;
        for (var i = 0; i < arr.length; i++){
            for (var j = i+1; j < arr.length; j++) {
                if (arr[j][str] < arr[i][str]){ 
                    holder = arr[i];
                    arr[i] = arr[j];
                    arr[j] = holder;
                    }
            }
        }
}


// Player Object
class Player {
	constructor (x,y,w,h){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.V = createVector(0,0);
		this.moveSpeed=0.25;
		this.MAXSPEED=4;
		this.MAXHEALTH = 6;
		this.falling=false;
		this.gravity=0.4;
		this.keyInputs=[39,37,38,40]; //RIGHT,LEFT,UP,DOWN
		this.color= (50, 50, 50);
		this.health=3;
		this.gotKey=false;
		this.delay = 36; //for damaging collisions
		//this.img = "player";  //check if still needed
		this.z_Index = 2;
	}

	update(blocks){  //objects for collision
		// key inputs and responses
		if(keys[this.keyInputs[0]]){
			this.V.x += this.moveSpeed;
		}
		if(keys[this.keyInputs[1]]){  //
			this.V.x -= this.moveSpeed;
		}
		if(keys[this.keyInputs[2]]&&!this.falling){ //jump
			this.V.y = -9;
			this.falling=true;
			//playSound(getSound("rpg/battle-swing"));
		}
		//  3, duck, multiple issues
		
		//decelerate.  add different surfaces?  will need block type
		if( !keys[this.keyInputs[0]] && !keys[this.keyInputs[1]]){
				if(this.V.x > 0){
					this.V.x -= this.moveSpeed;
				}
				if(this.V.x < 0){
					this.V.x += this.moveSpeed;
				}
		}

		// limit the player's horizontal speed
		if (this.V.x < -this.MAXSPEED){  
			this.V.x = -this.MAXSPEED;
		}
		if (this.V.x > this.MAXSPEED){
			this.V.x = this.MAXSPEED;
		}
		if (this.V.y > 12){
			this.V.y = 12;
		}
		
		// update the x and y positions
		this.P.x += this.V.x;
		this.checkCollision(blocks,this.V.x, 0);
		
		this.falling=true;
		this.P.y += this.V.y;
		this.checkCollision(blocks,0,this.V.y);
		
		this.V.y += this.gravity;
		
		this.delay+=1; //update damage delay 
		if (this.delay > 1000){this.delay = 36;} 
		if(this.health<=0){
			state="dead";
		}
	}
	checkCollision(obj, velx, vely){  
		for(var i=0; i<obj.length; i++){
			//don't check any blocks that aren't onscreen 
			if(onScreen(obj[i], this) && collide(obj[i], this)){
				if(vely > 0){
					this.V.y=0;
					this.falling=false;
					this.P.y=obj[i].P.y-this.h;
					if (obj[i].type==="mover"){
							this.P.x+=obj[i].inc;
					}
				}
				if(vely < 0 && obj[i].type !== "mover"){
					this.V.y=0;
					this.P.y=obj[i].P.y+obj[i].h;
				}
				if(velx < 0 && obj[i].type !== "mover"){
					this.V.x=0;
					this.P.x=obj[i].P.x+obj[i].w;
				}
				if(velx > 0 && obj[i].type !== "mover"){
					this.V.x=0;
					this.P.x=obj[i].P.x-this.w;
				}
				
			}
		}
	}
	draw() {  
		noStroke();
		fill(this.color);
		push();
		translate(this.P.x, this.P.y);
		rect(0,0,this.w,this.h,8);
		
		// eyes.  setting height relative to width so size doesn't change while ducking
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
		if (keys[this.keyInputs[0]]){
			 ellipse(this.w/2.80,this.h/3,  this.w/14,this.w/14);
			 ellipse(this.w/1.25,this.h/3,  this.w/14,this.w/14);
		}
		else if (keys[this.keyInputs[1]]){
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
		resetMatrix();
		fill(0, 0, 0,25);
		rect(0,0, width, height/10);
		fill(255, 255, 255);
		textSize(height/25);
		textAlign(LEFT,CENTER);
		text("Health ", width/50,height/35);
		
		for(var i = 0; i< this.MAXHEALTH; i++){
			rect(width/50+i*21, height/17, 20, 10, 4);
		}
		fill(200, 50, 75);
		for(var i=0; i<this.health; i++){
			rect(width/50+i*21, height/17, 20, 10, 4);
		}
		fill(255, 255, 255);
		textSize(height/25);
		text("Got Key?: ", 0.72*width,height/35);

		if(this.gotKey){
			text("Yes!",0.85*width,height/35);
		} else {
				text("NO", 0.85*width, height/35); 
				textSize(height/25);
				fill(255, 255, 255, 100*abs(sin(radians(1.5*frameCount))));
				text("Go get the key !", 0.72*width, height/15);
				}
	}
}

class Block {  
	constructor(x,y,w,h,type){  //pass image name or type
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.img=type;
			if (type === "mover"){
			this.type = "mover";  //needed for update call
			this.disp = random(-125,125);
			this.P.x = this.P.x+this.disp;
			this.inc = 1;
		}
	}


	draw() {
		if (this.img==="mover"){
			fill(50, 225, 255,125);
			stroke(200, 255, 255,150);
			strokeWeight(2);
			rect(this.P.x, this.P.y, this.w, this.h, 4);
			strokeWeight(1);
			noStroke();
			fill(0, 0, 50,100);
			rect(this.P.x, this.P.y+3/4*this.h, this.w, this.h/4, 4);
			fill(255, 255, 255,125);
			rect(this.P.x, this.P.y, this.w, this.h/4, 4);
		}
		else { 
		image(this.img, this.P.x, this.P.y, this.w, this.h);  //overlap helps with tearing
		}
	}    
	update(player){ //for moving blocks only
		if (this.type === "mover"){
			if (this.disp > 125 || this.disp < -125){
				this.inc*=-1;
			}
			this.disp+=this.inc;
			this.P.x+=this.inc;
		}
	}
}

class Portal{
	constructor(x,y,w,h){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.complete=false;
		this.img = imgPortal;
		this.type = "portal";
	}

	draw() {
		image(this.img, this.P.x, this.P.y, this.w, this.h);
	}
	update(player){
		if(collide(this,player)&&player.gotKey){
				fadeColor=color(255, 255, 255, transparency);
				transparency+=5;
				if(transparency>255){
					this.complete=true;
				}
			}else if(collide(this,player)&&!player.gotKey){
				fill(0, 0, 0);
				textSize(15);
				textAlign(CENTER,CENTER);
				text("You need the key",this.P.x+this.w/2,this.P.y-this.h/2);
			}
	}
}

class Portkey{
	constructor(x,y,w,h){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.collected=false;
		this.img = imgKey;
		this.type = "portkey";
	}

	draw(player) {
		if(!player.gotKey){
			image(this.img, this.P.x, this.P.y, this.w, this.h);
		}
	}
	update(player){
			if(onScreen(this, player) && collide(this,player) && !player.gotKey){
					//playSound(getSound("retro/coin"));
			this.collected=true;
			player.gotKey=true;
			}
	}
}

class Spike{
	constructor(x,y,w,h){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.type = "triangle";
	}

	draw() {
		noStroke();
		this.jab = 2.5*abs(sin(radians(1/2*frameCount*2%100))*this.h/6);

		fill(212, 232, 255);
		triangle(this.P.x,this.P.y+this.h,
				this.P.x+this.w,this.P.y+this.h,
				this.P.x+this.w/2,this.P.y + this.jab);
		fill(22, 124, 171);
		triangle(this.P.x+this.w/2,this.P.y+this.h,
				this.P.x+this.w-this.w/15,this.P.y+this.h,
				this.P.x+this.w/2,this.P.y + this.jab);
		stroke(255, 255, 255);
		strokeWeight(2);
		line(this.P.x, this.P.y+this.h-1, 
			this.P.x+this.w/2, this.P.y+1+ this.jab);
		
		line(this.P.x+this.w/2, this.P.y+this.h-1, 
			this.P.x+this.w/2, this.P.y+2+ this.jab);
		strokeWeight(1);
		noStroke();
	}
	update(player){
		if(onScreen(this, player)&& collide(this,player)&& player.delay >35){ 
			this.hurt=true;
			transparency=150;  
			player.health--;
			player.delay = 0;
				//playSound(getSound("rpg/hit-splat"));
		}
	   
		if(this.hurt){
			fadeColor=color(255, 0, 0,transparency);
			transparency-=15;
			if(transparency<0){
				transparency=0;
				fadeColor=color(255, 255, 255,transparency);
				this.hurt=false;
			}
		}
	}
}

class Heart{
	constructor(x,y,w,h){
		this.P = createVector(x,y);
		this.w = w;
		this.h = h;
		this.collected = false;
		this.img = imgHeart;  //heart image 
		this.type = "heart";
	}

	draw() {
		if (!this.collected){
			image(this.img, this.P.x, this.P.y, this.w, this.h);
		}
	}
	update(player){
		if(onScreen(this, player) && collide(this,player) && !this.collected){
			//playSound(getSound("retro/coin"));
			if(player.health < 6){
				player.health++;
				this.collected = true;
			}
				
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
		fill(this.color);
		stroke(this.color);
		beginShape();

		var alt = 2.5;
		for (var i=0; i<11; i++){
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

//background and foreground objects 
class Snowflake{
	constructor(player, lvW, lvH){
		this.lvW = lvW;
		this.lvH = lvH;
		this.player = player;
		this.SF = random(0.3,1.5);
		this.P = createVector(random(width),random(height));
		this.V = createVector(random(-1,1),2.0);
		this.V.mult(4/5*this.SF);
	}

	update(){
			
		if(this.P.y > height + height/4){ 
			this.P.y = -height/4;         
		}
		if(this.P.x > width){
			this.P.x = 0;
		}
		if(this.P.x < 0){
			this.P.x = width;
		}
		
		this.P.add(this.V);

		//so falling objects don't move with char.  
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.lvW-width/2){ 
			this.P.x-=this.player.V.x;  
		}
		if (this.player.P.y + this.player.h/2 < this.lvH-height/2) {
			this.P.y-=this.player.V.y;
		}
	}
	draw() {
		fill(255, 255, 255, 50+150*this.SF);
		ellipse(this.P.x, this.P.y, this.SF*random(3,5), this.SF*random(3,5));
	}
}

class Raindrop{
	constructor(player, lvW, lvH){
		this.lvW = lvW;
		this.lvH = lvH;
		this.player = player;
		this.SF = random(0.3,1.3);
		this.P = createVector(random(width),random(height));
		this.V = createVector(4,10);
		this.V.mult(4/5*this.SF);
	}

	update(){
			
		if(this.P.y > height + height/4){ //player can pass snow if quickly climbing 
			this.P.y = -height/4;         //or falling, so increasing loop height
		}
		if(this.P.x > width){
			this.P.x = 0;
		}
		if(this.P.x < 0){
			this.P.x = width;
		}
		
		this.P.add(this.V);

		//so falling objects don't move with char.  
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.lvW-width/2){ 
			this.P.x-=this.player.V.x;  
		}
		if (this.player.P.y + this.player.h/2 < this.lvH-height/2) {
			this.P.y-=this.player.V.y;
		}
	}
	draw() {
		stroke(186, 219, 255, 50+150*this.SF);
		push();
		translate(this.P.x, this.P.y);
		line(0,0,this.V.x,this.V.y);
		pop();
	}
}


class Leaf{
	constructor(player, lvW, lvH){
		this.lvW = lvW;
		this.lvH = lvH;
		this.player = player;
		this.P = createVector(random(width), random(height));
		this.V = createVector(random(-1,1), random(0.5, 1));
		this.w = random(5,10);
		this.h = random(5, 10);
		this.angle = 0;
		this.spinSpeed = random(1,5);
		this.R = random(150,230);
		this.G = random(50, 200);
		this.B = random(25, 50);
	}

	draw() {
		noStroke();
		
		fill(this.R, this.G, this.B);
		push();
			translate(this.P.x,this.P.y);
			rotate(this.angle);
			ellipse(0,0,this.w,this.h);
		pop();
	}
	update(){

		if(this.P.y>height){
			this.P.y=0;
		}
		if(this.P.x>width){
			this.P.x=0;
		}
		if(this.P.x<0){
			this.P.x=width;
		}
		this.angle+=this.spinSpeed;
		this.P.add(this.V);
		
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.lvW-width/2){ 
			this.P.x-=this.player.V.x;  
		}
		if (this.player.P.y + this.player.h/2 < this.lvH-height/2) {
			this.P.y-=this.player.V.y;
		}
	}
}

class Hills {  
	constructor(arrPV, levelW, levelH, player, speed){ //lvW,H,player from objecthandler per level
		this.arrPV=arrPV;
		this.levelW = levelW;
		this.levelH = levelH;
		this.player = player;
		this.speed = speed;
		this.x = 0;
		this.y = 0;
		this.lake = false;
	}

	draw(color) {
		push();
		
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.levelW-width/2){ 
				translate(this.speed*(width/2-this.player.w/2-this.player.P.x),   0);
				}
		if (this.player.P.x + this.player.w/2 >= this.levelW-width/2) {
				translate(this.speed*(-this.levelW+width),   0);
				}        
		if (this.player.P.y + this.player.h/2 < this.levelH-height/2){
				translate(0,   this.speed*(this.levelH-height/2-this.player.h/2-this.player.P.y));
				}

		
		noStroke();
		fill(color);
		beginShape();
		curveVertex(0, this.levelH);
		curveVertex(0, this.levelH);
		curveVertex(this.arrPV[0].x, this.arrPV[0].y);
			for (var i = 0; i < this.arrPV.length; i++){
				curveVertex(this.arrPV[i].x,  this.arrPV[i].y); 
			}
		curveVertex(this.levelW, this.arrPV[this.arrPV.length-1].y);
		curveVertex(this.levelW, this.levelH);
		curveVertex(this.levelW, this.levelH);
		endShape(CLOSE); 
		if (this.lake){
			fill(30, 100, 150);
			rect(this.arrPV[0].x, this.arrPV[0].y+66, this.levelW, this.levelH-this.arrPV[0].y);
			fill(150, 190, 220, 60);  //was (color, 60), but alpha not working with argument color pass
				for (var i = 1; i<6; i++){
					rect(0, this.arrPV[0].y+66, this.levelW, height/(5+5*i*i));
				}
		}
		pop();   
	}
}

//decorative images with draw method or sprite but no updates
class Deco{
	constructor(x,y,w,h, img){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.img = img; //pass string name to assign image and z_Index.  fix naming.
		if(img === "wood"){this.z_Index=0;}
		else if(img === "brick"){this.z_Index=0;}
		else if(img === "glass"){this.z_Index=1;}
		else if(img === "flower"){this.img=imgFlower; this.z_Index=3;}
		else if(img === "water"){this.z_Index=3;}
	}
 
	glass(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(100,150,200);
		rect(0,0,this.w,this.h);
		for (var r = 0; r < 2; r++){  //pane row position
			for (var c = 0; c < 2; c++){  //pane col position
				noStroke();
				fill(0, 0, 40, 75);
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
	wood(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(148, 107, 75);
		rect(0,0, 2*this.w,this.h);

		
		fill(156, 129, 91);
		rect(2*0.5/50*this.w, 0.5/50*this.h, 2*49/50*this.w,24/50*this.h);
		rect(0, 25/50*this.h, 2*24.5/50*this.w,25/50*this.h);
		rect(2*25.0/50*this.w, 25/50*this.h, 2*25/50*this.w,24.5/50*this.h); 

		stroke(255,255,255,55);
		line(2*1/50*this.w,0.5/50*this.h,2*49/50*this.w,0.5/50*this.h);
		line(2*0.5/50*this.w,1/50*this.h,2*0.5/50*this.w,23/50*this.h);
		line(0,25/50*this.h,2*24/50*this.w,25/50*this.h);
		line(2*25.5/50*this.w, 25/50*this.h, 2*this.w,25/50*this.h);
		line(2*25.5/50*this.w,25/50*this.h,2*25.5/50*this.w,49/50*this.h);
		stroke(0, 0, 0,25);
		strokeWeight(2);
		point(2*3/50*this.w, 5/50*this.h);
		point(2*47/50*this.w, 5/50*this.h);
		point(2*22/50*this.w, 29/50*this.h);
		point(2*29/50*this.w, 29/50*this.h);
		point(2*22/50*this.w, 46/50*this.h);
		point(2*29/50*this.w, 46/50*this.h);
		strokeWeight(1);
		noStroke();
		pop();
	}
	brick(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(0,0,0);
		rect(0,0, this.w,this.h);
		for (var i = 0; i<this.h; i+=this.h/2){
			noStroke();
			fill(156, 129, 91);
			rect(0, 0+i, 49/50*this.w,11.5/50*this.h);
			rect(0, 12.5/50*this.h+i, 25.0/50*this.w,11/50*this.h);
			rect(25.5/50*this.w, 12.5/50*this.h+i, 25.0/50*this.w,11/50*this.h); 
			stroke(255,255,255,175);
			line(1/50*this.w,1/50*this.h+i,48/50*this.w,1/50*this.h+i);
			line(1/50*this.w,1/50*this.h+i,1/50*this.w,11/50*this.h+i);
			line(0,14/50*this.h+i,24/50*this.w,14/50*this.h+i);
			line(27.5/50*this.w, 14/50*this.h+i, 49/50*this.w,14/50*this.h+i);
			line(27.5/50*this.w,15/50*this.h+i,27.5/50*this.w,23/50*this.h+i);
		}
		pop();
	}
	water(){
		var waveH = this.w/12.5;
		push();

		translate(this.P.x, this.P.y);
		fill(76, 117, 222,170);
		rect(0,0,this.w+0.49,this.h);
		fill(225, 235, 255);
		beginShape(); 
		
		curveVertex(0,0);
		curveVertex(0,0);
		curveVertex(this.w/4,  waveH*sin(radians(frameCount)));
		curveVertex(this.w/2, 0);
		curveVertex(3/4*this.w,  waveH*sin(radians(frameCount)));
		curveVertex(this.w,0);
		waveH = -waveH;
			
		curveVertex(this.w,0);
		curveVertex(3/4*this.w,  waveH*sin(radians(frameCount)));
		curveVertex(this.w/2,0);
		curveVertex(this.w/4,  waveH*sin(radians(frameCount)));
		curveVertex(0,0);
		curveVertex(0,0);
		this.waveH = -waveH;
		
		endShape();
		pop();
		strokeWeight(1);
	}
	draw() {  
		//non sprites
		if (this.img === "glass"){
			this.glass();
		}
		else if (this.img === "wood"){
			this.wood();
		}
		else if (this.img === "brick"){
			this.brick();
		}
		else if (this.img === "water"){
			this.water();
		}
		//sprites
		else {image(this.img, this.P.x, this.P.y, this.w, this.h);}
	}
}