//functions: camera, sort, collision, onscreen

//camera
var gameCamera = function(ship){
	let shipC = ship.P.x + ship.w/2;
	let bordL = width/2;
	let bordR = levelW - width/2;
	
	if(shipC > bordL){    
        translate(-(shipC-bordL), 0);  
    }
	                           
    if(shipC > bordR){   
        translate(shipC-bordR, 0);  
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
var onScreen = function(obj1, obj2){ //checks if obj1 and 2 are both onscreen
    return abs(obj2.P.x-obj1.P.x)<width/2+min(width/2,abs(obj2.P.x-obj1.P.x))&&
           abs(obj2.P.y-obj1.P.y)<height/2+min(height/2,abs(obj2.P.y-obj1.P.y));
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
		this.P = [];  //array of number Pvecs

		for (var i = 0; i < number; i++){
			this.P[i] = createVector(random(0,levelW),random(0,levelH));
			
			//~75% small, 20% medium, 5% large stars, with dif base color for each size.
			var sizeRoll = random(0,number);
			if (sizeRoll < 3/4*number) {
				this.P[i].s = 1.75;
				this.P[i].R = 0;
				this.P[i].G = 80;
				this.P[i].B = 200;
			}
			else if (sizeRoll < 19/20*number){
				this.P[i].s = 2.5;
				this.P[i].R = 25;
				this.P[i].G = 150;
				this.P[i].B = 200;
			}
			else {
				this.P[i].s = 5;
				this.P[i].R = 200;
				this.P[i].G = 150;
				this.P[i].B = 150;
			}
			this.P[i].alph = this.P[i].s*75;  
		}
		
		
	}
	draw(){
		
		for (var i = 0; i< this.P.length; i++){
			strokeWeight(this.P[i].s);
			stroke(random(this.P[i].R-75,this.P[i].R+75), 
				random(this.P[i].G-75,this.P[i].G+75),
				random(this.P[i].B-90,this.P[i].B+90), this.P[i].alph);
			point(this.P[i].x, this.P[i].y);
			
		}
		strokeWeight(1);
	}	
	update(){
		for (var i = 0; i< this.P.length; i++){
			this.P[i].y += 0.15*(this.P[i].s-1.0);
			if (this.P[i].y > levelH){
				this.P[i].y = 0;
				this.P[i].x = random(0, levelW);
			} 
		}
	}	
}	


class Laser{
	constructor(vessel){
		this.w = vessel.weaponW; //change with powerups later, pass type
		this.h = vessel.weaponH;
		this.P = createVector(vessel.P.x+vessel.w/2-this.w/2,vessel.P.y+vessel.h/2);
		this.V = createVector(0,-vessel.weaponSpeed); //change with powerups 
		this.C = vessel.weaponColor;
		this.hits = vessel.weaponHits;  //number of times shot can do damage before it's spliced
	}
	draw(){
		noStroke();
		fill(this.C);
		rect(this.P.x, this.P.y, this.w, this.h);
		strokeWeight(1);
		fill(255,255,255,150);
		rect(this.P.x+this.w/3, this.P.y, this.w/3, this.h);
	}
	
	update(vessel){
		
		if (vessel.type==="ship5"){
			this.targetShot(vessel);
		}
		this.P.add(this.V);	
		
	}
	
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
