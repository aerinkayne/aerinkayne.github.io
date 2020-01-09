//anon functions: sort, collision, camera, onscreen check

//bubble sorts an array by the given key's value
let sortArrByProp = function(arr, str){
    let holder;
    for (let i = 0; i < arr.length; i++){
        for (let j = i+1; j < arr.length; j++) {
            if (arr[j][str] < arr[i][str]){ 
                holder = arr[i];
                arr[i] = arr[j];
                arr[j] = holder;
            }
        }
    }
}

//rect collision.  
let collide = function(obj1,obj2){ 
    return  obj1.P.x < obj2.P.x + obj2.w && obj1.P.x + obj1.w > obj2.P.x &&
            obj1.P.y < obj2.P.y + obj2.h && obj1.P.y + obj1.h > obj2.P.y;
}

let gameCamera = function(player) {
		//no Y camera translation
		let playerCenterX = player.P.x + player.w/2;
	
		if (playerCenterX  > bordL && playerCenterX < bordR){    
			translate(-(playerCenterX - bordL), 0);  
		}						   
		else if (playerCenterX >= bordR){   
			translate(-(levelW - width), 0);  
		}
	}

let onScreen = function(obj, player){ 
		let playerCenterX = player.P.x + player.w/2;
		return ( 
			//no Y translation so just check between 0-height
			obj.P.y + obj.h > 0 && obj.P.y < height && 
			(abs(playerCenterX-(obj.P.x + obj.w/2)) - obj.w/2 < width/2 + max(0,bordL-playerCenterX) + max(0, playerCenterX-bordR))		
		);	
	}



//classes:  button, stars, Weapon, Powerup
class Button{
	constructor(x,y,w,h,r,txt){
	this.P = createVector(x,y);
	this.w = w;
	this.h = h;
	this.r = r;  //border radius for rectangles
	this.txt = txt;
	this.txtColor = [0,0,0];
	}
	draw(color){
		
		fill(color);
		rect(this.P.x, this.P.y, this.w, this.h, this.r);
		
		textAlign(CENTER,CENTER);
		textSize(this.h/2);
		fill(this.txtColor);
		text(this.txt,this.P.x+this.w/2, this.P.y+this.h/2);
	}
	isClicked(mouseX, mouseY){
		return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
				mouseY > this.P.y && mouseY < this.P.y + this.h);
	}
}

class StarField{
	constructor(number){
		this.stars = [];  //for array of objects 
		this.planets = []; //soon (TM)
		for (let i = 0; i < number; i++){ //how many from param
			this.stars.push(new Object());
			this.stars[i].P = createVector(random(0, levelW), random(0, levelH));
			
			//~75% small, 22.5% medium, 2.5% large stars, vary colors for each size somewhat.
			let sizeRoll = random(0,number);
			if (sizeRoll < 3/4*number) {
				this.stars[i].w = this.stars[i].h = random(1.5, 2.5);
				this.stars[i].color = [random(0, 25), random(50,100), random(125, 175)];
			}
			else if (sizeRoll < 19.5/20*number){
				this.stars[i].w  = this.stars[i].h = random(2, 4);
				this.stars[i].color = [random(0, 50), random(75,150), random(150, 225)];
			}
			else {
				this.stars[i].w = this.stars[i].h = random(5,8);
				this.stars[i].color = [255, random(125,200), random(100, 200)];
			}
		}	
	}
	draw(){
		for (let i = 0; i< this.stars.length; i++){
			if(onScreen(bg_stars.stars[i], ship)){
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
	}	
	update(){
		for (let i = 0; i< this.stars.length; i++){
			this.stars[i].P.y += 0.3*sqrt((this.stars[i].h));
			if (this.stars[i].P.y > levelH + this.stars[i].h){
				this.stars[i].P.y = -this.stars[i].h;
				this.stars[i].P.x = random(0, levelW);
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
		if(this.gunType === greenPulse){
			noFill();
			stroke(c[0], c[1], c[2], 55+200*sin(frameCount/2));
			strokeWeight(w/2);

			ellipse(this.P.x + w/2, this.P.y + h/2, w, min(abs(this.yInitial - this.P.y), h));
			stroke(200,255,255,170);
			strokeWeight(w/8);
			ellipse(this.P.x + w/2, this.P.y + h/2, w, min(abs(this.yInitial - this.P.y), h));
			strokeWeight(1);
			noStroke();
		}
		else if (this.gunType === homingMissile){
			fill(c);
			rect(this.P.x, this.P.y, w, h, 5);
			fill(255,255,255,random(0,255));
			rect(this.P.x + w/4, this.P.y, w/2, h, 10);
		}
		else{
			noStroke();
			fill(c);
			rect(this.P.x, this.P.y, w, min(abs(this.yInitial - this.P.y), h), 5);
			fill(255,255,255,160);
			rect(this.P.x + w/3, this.P.y, w/3, min(abs(this.yInitial - this.P.y), h), 5);
			fill(255,255,255);
			ellipse(this.P.x + w/2, this.P.y + h*vessel.modifyLocation, 2/3*w, w/2);  //yes w
		}	
	}
	update(vessel){
		this.P.add(this.V);	
		//moves shot with vessel's P.x until fully fired.
		if (this.gunType !== homingMissile && abs(this.yInitial - this.P.y) < this.gunType.h){
			this.P.x += vessel.V.x;
		}
		if (this.targeted){ 
			this.targetShot(this, ship);  //works because ship is in scope.  fix params later.  need way to get a target if used by player
		}
		
	}
	//sets shot's vector direction towards target ship
	targetShot(shotSource, targetVessel){ 
		let source = createVector(shotSource.P.x + shotSource.w/2, shotSource.P.y + shotSource.h/2);
		let target = createVector(targetVessel.P.x + targetVessel.w/2, targetVessel.P.y + targetVessel.h/2);
		let dirP = target.sub(source);
		this.V = dirP.setMag(this.gunType.speed);
		
		this.timer ++;
		if (this.timer > 300){  //estimated 60fps, ~5sec track
			this.targeted = false;
		}	
	}
}


class PowerUp{
	constructor(vessel){ //param is vessel that drops the item
		this.P = createVector(vessel.P.x,vessel.P.y+vessel.h/2);
		this.w = 25;
		this.h = 8;
		this.gunType = vessel.gunType;
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
	modShip(playerShip){ 
		if (playerShip.gunType === this.gunType && playerShip.powerLevel < playerShip.powerLevelMAX){
			playerShip.powerLevel++;
		}
		if (playerShip.gunType !== this.gunType) {
			playerShip.gunType = this.gunType;
			playerShip.powerLevel = 0;
		}
	}
}
