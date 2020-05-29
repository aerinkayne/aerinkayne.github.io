//rectangle collision.  
let collide = function(obj1, obj2){ 
    return  obj1.P.x < obj2.P.x + obj2.w && obj1.P.x + obj1.w > obj2.P.x &&
            obj1.P.y < obj2.P.y + obj2.h && obj1.P.y + obj1.h > obj2.P.y;
}
//camera
let gameCamera = function(ship) {
		translate(-ship.T.x, -ship.T.y);
	}


//classes:  Buttons, GameScreen, Weapon, Powerup, Shield
class Button {
	constructor(config, img){
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
	this.clickDelay = 20;	//frames ~1/3 sec
	this.paused = false;	
	this.onClick = config.onClick || 0;
	this.onHover = config.onHover || 0;
	this.offHover = config.offHover || 0;
	this.img = img || 0;
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
	//can pass location params or supply alternative coords in draw
	draw(x=this.P.x, y=this.P.y){
		if (x !== this.P.x || y !== this.P.y) {
			this.P.x = x;  this.P.y = y;
		}
		if(!this.paused){
			if(this.img){
				push();
				translate(x+this.w/2,y+this.h/2);  //image mode is center
				image(this.img, 0, 0, this.w, this.h);
				noStroke();
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
class GunBtn extends Button{
	constructor(config, img, gunType){
		super(config, img);
		this.gunType = gunType;
		this.powerLevel = -1;
		this.powerLevelMAX = 2;
		this.overlayAlpha = 125;
	}
	drawPowerLevels(){
		push();
		translate(this.P.x, this.P.y);
		(this.powerLevel >-1) ? this.overlayAlpha = 30 : this.overlayAlpha = 125;
		fill(0,0,0, this.overlayAlpha);
		rect(0, 0, this.w, this.h, 2);
		fill(255);
		for (let i=0; i <= this.powerLevel; i++){
			ellipse(this.w/4+i*this.w/4, 8/10*this.h,this.w/6, this.w/6);
		}
		noFill();
		stroke(255);
		if (this.selected){rect(0,0,this.w, this.h,2);}
		pop();
	}
}


class GameScreen{
	constructor(){
		this.P = createVector(0, 0);
		this.w = width;
		this.h = height;
		this.numStars = 70;
		this.stars = this.addStars();  
	}
	addStars(){
		let stars = [];
		for (let i = 0; i < this.numStars; i++){ //how many from param
			stars.push(new Object());
			stars[i].P = createVector(random(this.w), random(this.h));
			
			//~75% small, 22.5% medium, 2.5% large stars, vary colors for each size somewhat.
			let sizeRoll = random(0,this.numStars);
			if (sizeRoll < 3/4*this.numStars) {
				stars[i].w = stars[i].h = random(1.5, 2.5);
				stars[i].color = [random(0, 25), random(50,100), random(125, 175)];
			}
			else if (sizeRoll < 19.5/20*this.numStars){
				stars[i].w  = stars[i].h = random(2, 4);
				stars[i].color = [random(0, 50), random(75,150), random(150, 225)];
			}
			else {
				stars[i].w = stars[i].h = random(5,8);
				stars[i].color = [255, random(150,225), random(100, 210)];
			}
		}
		stars.sort((a,b)=> a.w - b.w);	
		return stars;
	}
	updatePosition(ship){
		this.P.x = ship.T.x;
		this.P.y = ship.T.y;
	}
	checkBounds(obj){
		if (obj.P.x + obj.w/2 < this.P.x){
			obj.P.x = this.P.x + this.w + obj.w/2;
		}
		if (obj.P.x - obj.w/2 > this.P.x + this.w){
			obj.P.x = this.P.x - obj.w/2;
		}
		if (obj.P.y + obj.h/2 < this.P.y){
			obj.P.y = this.P.y + this.h + obj.h/2;
		}
		if (obj.P.y - obj.h/2 > this.P.y + this.h){
			obj.P.y = this.P.y - obj.h/2;
		}
	}
	backgroundImg(BG){
		imgStarBG = BG.get(this.P.x/3, 0, 1.5*width, 1.5*height);
		push();
		translate(this.P.x, this.P.y);
		image(imgStarBG, width/2, height/2, width, height);   //imagemode is center
		pop();
	} 
	drawStars(){
		for (let i = 0; i< this.stars.length; i++){
			this.checkBounds(this.stars[i]);
			let c = this.stars[i].color; 
			let s = this.stars[i].w;
			strokeWeight(s);
			//divided by size so that large stars twinkle less than smaller ones.
			stroke(c[0]+random(-175/s, 175/s), c[1]+random(-175/s,175/s), c[2]+random(-175/s,175/s));
			point(this.stars[i].P.x, this.stars[i].P.y); 
			strokeWeight(1);
			noStroke();
		}
	}	
	updateStars(){
		for (let i = 0; i< this.stars.length; i++){
			this.stars[i].P.y += 0.2*sqrt((this.stars[i].h));
			if (this.stars[i].P.y > levelH + this.stars[i].h){
				this.stars[i].P.y = -this.stars[i].h;
				this.stars[i].P.x = random(this.P.x, this.P.x+this.w);
			} 
		}
	}	
}	



class WeaponShot{
	//vessel that fired the shot, location of shot, velocity of shot
	constructor(vessel, P, V){  
		this.gunType = vessel.gunType;
		this.P = createVector(P.x, P.y);   
		this.V = createVector(V.x, V.y);
		this.yInitial = this.P.y;
		this.w = this.gunType.w; //needed for collision method
		this.h = this.gunType.h; //needed for collision method 
		this.hits = this.gunType.hits;  //get as primitive
		this.targeted = this.gunType.targeted;
		this.timer = 0; //used for targeted shots.  ++ in targetShot()
	}
	draw(vessel){
		let c = this.gunType.weaponColor;
		let w = this.gunType.w;
		let h = this.gunType.h;
		if(this.gunType.name === "greenPulse"){
			noFill();
			stroke(c[0], c[1], c[2], 55+200*sin(frameCount/2));
			strokeWeight(w/2);

			ellipse(this.P.x + w/2, this.P.y + h/2, w+w/4*cos(frameCount/2), min(abs(this.yInitial - this.P.y), h+h/4*cos(frameCount)));
			stroke(200,255,255,170);
			strokeWeight(w/8);
			ellipse(this.P.x + w/2, this.P.y + h/2, w+w/4*cos(frameCount/2), min(abs(this.yInitial - this.P.y), h+h/4*cos(frameCount)));
			strokeWeight(1);
			noStroke();
		}
		else if (this.gunType.name === "homingMissile"){
			fill(c);
			rect(this.P.x, this.P.y, w, h, 5);
			fill(255,200,255,random(0,255));
			rect(this.P.x + w/4, this.P.y + h/8, w/2, 3*h/4, 5);
		}
		else{
			let H = this.h;
			if (vessel === invShip){
				H = 0;
			}
			noStroke();
			fill(c[0],c[1],c[2],255-80*abs(cos(frameCount/15)));
			rect(this.P.x, this.P.y, w, min(abs(this.yInitial - this.P.y), h), 3);
			fill(255,255,255,130);
			rect(this.P.x + 3*w/8, this.P.y, w/4, min(abs(this.yInitial - this.P.y), h), 5);
			fill(255,255,255);
			ellipse(this.P.x + w/2, this.P.y + H, 2/3*w, w/4);  
		}	
	}
	update(vessel, target){  //vessel shooting, target for targeted weapons
		this.P.add(this.V);	
		//moves shot with vessel's P.x until fully fired.
		if (this.gunType.name !== "homingMissile" && abs(this.yInitial - this.P.y) < this.gunType.h){
			this.P.x += vessel.V.x;
		}
		if (this.targeted && target){ 
			this.targetShot(this, target, this.gunType.trackTime); 
		}
		
	}

	//sets shot's vector direction towards target ship
	targetShot(shotSource, targetVessel, trackTime){ 
		let source = createVector(shotSource.P.x + shotSource.w/2, shotSource.P.y + shotSource.h/2);
		let target = createVector(targetVessel.P.x + targetVessel.w/2, targetVessel.P.y + targetVessel.h/2);
		let dirP = target.sub(source);
		this.V = dirP.setMag(this.gunType.speed);
			
		this.timer ++;
		if (this.timer > trackTime){  //estimated 60fps, ~4sec track
			this.targeted = false;
		}	
	}
}


class PowerUp{
	constructor(vessel){ //param is vessel that drops the item
		this.P = createVector(vessel.P.x,vessel.P.y+vessel.h/2);
		this.w = 22;
		this.h = 8;
		if (vessel.drop === "gun"){
			this.gunType = vessel.gunType;
		}	
	}
	draw(){
		let c = this.gunType.weaponColor;
		stroke(random(50,200),random(50,200),random(50,200));
		fill(c);
		rect(this.P.x, this.P.y, this.w, this.h, 6);
		noStroke();
	}
	update(){
		this.P.x += sin(frameCount/10); 
		this.P.y += 0.5;
	}
	//mod inventory
	modShip(playerShip){ 
		sPup.play();
		playerShip.gunz.forEach(gun => {
			if (this.gunType.name === gun.gunType.name && gun.powerLevel < gun.powerLevelMAX){
				gun.powerLevel++;
			}
		});
		//so that player does not need to reselect the gun they have to inc its power
		if (playerShip.gunType.name === this.gunType.name && playerShip.powerLevel < playerShip.powerLevelMAX){
			playerShip.powerLevel++;
		}
	}
}
class ShieldDrop extends PowerUp{
	constructor(vessel){
		super(vessel);
		this.w = 12;
		this.h = 12;	
	}
	modShip(playerShip){
		sPup.play();
		playerShip.shielded = true;
		playerShip.shield.absorb = playerShip.shield.absorbMax;
	}
	draw(){
		stroke(random(50,200),random(50,200),random(50,200));
		fill(225, 60, 200, 100+100*sin(frameCount/10));
		rect(this.P.x, this.P.y, this.w, this.h, 12);
		noStroke();
	}
}


class Gun {
	constructor(config){
		this.name = config.name;
		this.w = config.w;
		this.h = config.h;
		this.speed = config.speed;
		this.weaponColor = config.weaponColor;
		this.pushNumber = config.pushNumber;
		this.hits = config.hits;
		this.rechargeTime = config.rechargeTime ;
		this.damage = config.damage;
		this.targeted = config.targeted;
		this.trackTime = config.trackTime;
		this.spreadAngle = config.spreadAngle;
		this.weaponSound = config.weaponSound;
	}

}

class Shield {
	constructor(x,y,w,h){
		this.P = createVector (x,y);
		this.w = w;
		this.h = h;	
		this.r = w;
		this.s = round(w/3);
		this.c = [225,60,200];
		this.absorb = 0;
		this.absorbMax = 200;
	}
	updatePosition(playerShip){
		this.P.x = playerShip.P.x;
		this.P.y = playerShip.P.y;
	}
	draw(){
		let c = this.c;
		stroke(255,255,255, 125+55*sin(frameCount/10));
		fill(c[0], c[1], c[2], 175+75*sin(frameCount/10));
		ellipse(this.w/2+this.r*cos(frameCount/5), this.h/2+this.r*sin(frameCount/5), this.s, this.s);
		noStroke();
	}
}