//functions: camera, sort, collision, onscreen

//camera
var gameCamera = function(ship){
	let shipCX = ship.P.x + ship.w/2;
	let bordL = width/2;
	let bordR = levelW - width/2;
	
	if(shipCX > bordL){    
        translate(-(shipCX-bordL), 0);  
    }
	                           
    if(shipCX > bordR){   
        translate(shipCX-bordR, 0);  
    }
}

//sorts an array by a property value (str is property name)
var sortArrByProp = function(arr, str){
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

//rect collision.
var collide = function(obj1,obj2){ 
    return  obj1.P.x < obj2.P.x + obj2.w && obj1.P.x + obj1.w > obj2.P.x &&
            obj1.P.y < obj2.P.y + obj2.h && obj1.P.y + obj1.h > obj2.P.y;
}

//onscreen check

var onScreen = function(obj1, obj2){ //check if 1 and 2 are both onscreen.  player is 2.  no vertical scrolling.
	//top and left side
	if (obj1.P.y+obj1.h > 0 && obj2.P.x + obj2.w/2 <= width/2){
		return obj1.P.x + obj1.w > 0 && obj1.P.x < width;
		}
	//top and center
	else if (obj1.P.y+obj1.h > 0 && obj2.P.x + obj2.w/2 > width/2 && obj2.P.x + obj2.w/2 < levelW-width/2 ){
		return (abs(obj2.P.x+obj2.w/2 -(obj1.P.x+obj1.w)) < width/2 ||
				abs(obj2.P.x+obj2.w/2 -obj1.P.x) < width/2);
		}
	//top and right side	
    else if (obj1.P.y+obj1.h > 0 && obj2.P.x + obj2.w/2 >= levelW - width/2) {
		return obj1.P.x < levelW && obj1.P.x + obj1.w > levelW - width; 
		}
};


//classes:  button, stars, laser, powerup
class Button{
	constructor(x,y,w,h,r,txt){
	this.P = createVector(x,y);
	this.w = w;
	this.h = h;
	this.r = r;  //border radius for rectangles
	this.txt = txt;
	}
	draw(color){
		
		stroke(0,0,0);
		strokeWeight(1);
		fill(color);
		rect(this.P.x, this.P.y, this.w, this.h, this.r);
		noStroke();
		
		textAlign(CENTER,CENTER);
		textSize(this.h/2);
		fill(0,0,0);
		text(this.txt,this.P.x+this.w/2, this.P.y+this.h/2);
	}
	isClicked(mouseX, mouseY){
		return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
				mouseY > this.P.y && mouseY < this.P.y + this.h);
	}
}

class StarField{
	constructor(number){
		//this seems convoluted but whatever
		this.stars = [];  //array of number Pvecs

		for (var i = 0; i < number; i++){
			this.stars.push(new Object());
			this.stars[i].P = createVector(random(0,levelW),random(0,levelH));
			
			//~75% small, 20% medium, 5% large stars, with dif base color for each size.
			var sizeRoll = random(0,number);
			if (sizeRoll < 3/4*number) {
				this.stars[i].w = this.stars[i].h = 1.75;
				this.stars[i].R = 0;
				this.stars[i].G = 80;
				this.stars[i].B = 200;
			}
			else if (sizeRoll < 19/20*number){
				this.stars[i].w = this.stars[i].h = 2.5;
				this.stars[i].R = 25;
				this.stars[i].G = 150;
				this.stars[i].B = 200;
			}
			else {
				this.stars[i].w = this.stars[i].h = 5;
				this.stars[i].R = 200;
				this.stars[i].G = 150;
				this.stars[i].B = 150;
			}
			this.stars[i].alph = this.stars[i].w*75;  
		}
		
		
	}
	draw(){
		
		for (var i = 0; i< this.stars.length; i++){
			if(onScreen(bg_stars.stars[i], ship)){
				strokeWeight(this.stars[i].w);
				stroke(random(this.stars[i].R-75,this.stars[i].R+75), 
				random(this.stars[i].G-75,this.stars[i].G+75),
				random(this.stars[i].B-90,this.stars[i].B+90), this.stars[i].alph);
				point(this.stars[i].P.x, this.stars[i].P.y);
			}
		}
		strokeWeight(1);
	}	
	update(){
		for (var i = 0; i< this.stars.length; i++){
			this.stars[i].P.y += 0.15*(this.stars[i].w-1.0);
			if (this.stars[i].P.y > levelH){
				this.stars[i].P.y = 0;
				this.stars[i].P.x = random(0, levelW);
			} 
		}
	}	
}	

//fix ellpise based collision oy
class Laser{
	constructor(vessel){
		this.w = vessel.weaponW; //change with powerups later, pass type
		this.h = vessel.weaponH;
		this.type = vessel.type;
		//always use location compatible with rect collision
		this.P = createVector(vessel.P.x+vessel.w/2-this.w/2,vessel.P.y+vessel.h/2);
		this.V = createVector(0,-vessel.weaponSpeed); //change with powerups 
		this.C = vessel.weaponColor;
		this.hits = vessel.weaponHits;  //number of times shot can do damage before it's spliced
	}
	draw(){
		
		if(this.type === "ship3"){
			noFill();
			stroke(this.C);
			strokeWeight(this.w/2);
			//correct the drawing for ellipse here
			ellipse(this.P.x+this.w/2, this.P.y+this.h/2, this.w, this.h);
			stroke(255,255,255,150);
			strokeWeight(this.w/6);
			ellipse(this.P.x+this.w/2, this.P.y+this.h/2, this.w, this.h);
			
		}	
		else{
			
			noStroke();
			fill(this.C);
			rect(this.P.x, this.P.y, this.w, this.h);
			strokeWeight(1);
			fill(255,255,255,150);
			rect(this.P.x+this.w/3, this.P.y, this.w/3, this.h);
		}	
	}
	
	update(vessel){
		
		if (this.type==="ship5"){ //070319
			this.targetShot(vessel);
		}
		this.P.add(this.V);	
		
	}
	//sets shot's vector direction towards player ship
	targetShot(vessel){
		var shipP = createVector(ship.P.x+ship.w/2, ship.P.y+ship.h/2);
		var sourceP = createVector(vessel.P.x+vessel.w/2, vessel.P.y+vessel.h/2);
		var dirP = sourceP.sub(shipP);
		this.V = dirP.setMag(vessel.weaponSpeed);
	}
	
}

class PowerUp{
	constructor(vessel){
		this.P = createVector(vessel.P.x,vessel.P.y+vessel.h/2);
		this.w = 25;
		this.h = 8;
		this.type = vessel.type;
		this.c = vessel.weaponColor;
		this.Lw = vessel.weaponW;
		this.Lh = vessel.weaponH;
		this.Ls = -vessel.weaponSpeed; //ship vals are opposite Y vec
		this.dmg = vessel.weaponDamage;
		this.weaponHits = vessel.weaponHits;
		
		if(vessel.type==="ship1"){
			this.Lchrg = 10;
			this.sound = sPhaser;	//change later		
		}
		else if(vessel.type==="ship2"){
			this.Lchrg = 18;
			this.sound = sPhaser;
		}
		else if(vessel.type==="ship3"){
			this.Lchrg = 25;	
			this.sound = sPhaserG;
		}
		else if(vessel.type==="ship4"){
			this.Lchrg = 40;
			this.sound = sPhaserY;
		}
	}
	draw(){
		strokeWeight(2);
		stroke(random(50,220),random(50,220),random(50,220));
		fill(this.c);
		rect(this.P.x, this.P.y, this.w, this.h, 6);
		noStroke();
	}
	update(){
		this.P.x+= 3/4*sin(invGame.timer);
		this.P.y+= 0.5;
	}
	modShip(){
		ship.type = this.type; //070419
		ship.weaponHits = this.weaponHits;
		ship.weaponColor = this.c;
		ship.weaponSound = this.sound;
		ship.weaponW = this.Lw;
		ship.weaponH = this.Lh;
		ship.weaponSpeed = this.Ls;    //speed of projectile.  higher is faster.
		ship.weaponRecharge = this.Lchrg; //weap recharge time.  lower allows faster shots. 
		ship.weaponDamage = this.dmg;
	}
}
