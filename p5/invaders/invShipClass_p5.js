


//ship class
class Ship{
	constructor(x,y,w,h){
	this.P = createVector(x,y);
	this.V = createVector(0,0);
	this.w = w;
	this.h = h;	
	this.length = 0; //for laser update function. maybe
	this.move = [false,false,false,false];  //R,L,U,D
	this.acc = 1.0;
	this.dec = 0.25;
	this.MAXSP = 4;
	this.thruster = 0; 
	this.shots = [];
	this.firing = false;
	this.firingDelay = 0;
	this.health = 250;
	this.score = 0;
	this.dmgDelay = 41;
	this.dest = sShipDestr;
	
	//weapon stats
	this.gunType = "0"; //not currently used
	this.weaponSound = sPhaser;
	this.weaponHits = 1;
	this.weaponColor = color(0,200,185);
	this.weaponW = 5;
	this.weaponH = 10;
	this.weaponSpeed = 10; //speed of projectile.  higher is faster.
	this.weaponRecharge = 15; //weap recharge time.  lower allows faster shots. 
	this.weaponDamage = 10;
	}
	shoot(){
		this.shots.push(new Laser(this));
	}
	healthBar(){
		noStroke();
		fill(225,225,255);
		text("score: " + this.score, width-50, height-20);
		
		fill(0,0,0);
		stroke(150,175,255);
		rect(width-70, height-10, 51, 7,2);
		noStroke();
		fill(155,0,40);
		//or map will hate you
		if (this.health < 0){
			this.health = 0;
		}
		rect(width-69, height-9, map(this.health,0,250,0,50), 5,2);
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		//fill(255, 0, 0,50);      /**hit box reference**/ 
		//rect(0,0,this.w,this.h); //..................
		
		//thrusters and cannon
		//glow
		noStroke();
		fill(0, 62, 156, 100+100*abs(sin(radians(frameCount/3))));   //)))))))))))
		if (!this.firing) {ellipse(this.w/2, 0, this.w/4, this.h/7);}
		
		fill(0, 62, 156, 30+60*abs(sin(radians(frameCount/3))));
		//animate with UP
		rect(this.w/2-15/40*this.w, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 15);
		rect(this.w/2-2*this.w/50, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 15);
		fill(0, 62, 156, 25+50*abs(sin(radians(frameCount/3))));
		if (!this.firing) {ellipse(this.w/2, this.h/90, this.w/3, this.h/7);}
		rect(this.w/2-13/40*this.w, this.h-this.h/10, this.w/3, this.h/3+this.thruster/2, 15);
		rect(this.w/2+-2/40*this.w, this.h-this.h/10, this.w/3, this.h/3+this.thruster/2, 15);
		fill(0, 166, 255, 3*this.thruster+85+155*abs(sin(radians(frameCount/3))));
		if (!this.firing) {ellipse(this.w/2, 0, this.w/5, this.h/7);}
		ellipse(this.w/2-this.w/7, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		ellipse(this.w/2+this.w/7, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		fill(184, 230, 255);
		if (!this.firing) {ellipse(this.w/2, 0, this.w/10, this.h/8);}
		ellipse(this.w/2-this.w/7, this.h, this.w/10, this.h/10);
		ellipse(this.w/2+this.w/7, this.h, this.w/10, this.h/10);
		//ship thruster parts
		fill(53, 80, 97); 
		rect(this.w/2-4/20*this.w, this.h/2, this.w/6, 9/20*this.h, 2);//left
		rect(this.w/2+2*this.w/40, this.h/2, this.w/6, 9/20*this.h, 2);//right
		rect(this.w/2-this.w/12, 0, this.w/6, this.h/10);//cover space between wings
		stroke(136, 159, 179);
		line(this.w/2-4/20*this.w, this.h/2, this.w/2-4/20*this.w, 19/20*this.h);
		
		//guns
		noStroke();
		rect(this.w/30,this.h/3.0,this.w/10, this.h/4, 2);
		rect(this.w-6*this.w/40,this.h/3.0,this.w/10, this.h/4, 2);
		rect(this.w/5,this.h/7,this.w/14, this.h/4, 2);
		rect(this.w-12*this.w/40,this.h/7,this.w/14, this.h/4, 2);
		fill(120, 255, 200, 50+100*abs(sin(radians(2*frameCount))));
		ellipse(4*this.w/50, this.h/3, 5*this.w/50, 4*this.w/50);
		ellipse(this.w/4.1, this.h/7, 5*this.w/50, 4*this.w/50);
		ellipse(46*this.w/50, this.h/3, 5*this.w/50, 4*this.w/50);
		ellipse(37*this.w/50, this.h/7, 5*this.w/50, 4*this.w/50);
		
		//wings
		fill(100, 144, 176);
		quad(0, 4/5*this.h,  0, this.h/2+this.h/20,
			this.w/2, 0, this.w/2, this.h/2+this.h/12);
		quad(this.w, 4/5*this.h,  this.w, this.h/2+this.h/20,
			this.w/2, 0, this.w/2, this.h/2+this.h/12);
	   
		//highlights, shadow
		strokeWeight(1);
		stroke(255, 255, 255, 200);
		line(0, 3/4*this.h,  0, this.h/2+this.h/20);
		line(0, this.h/2+this.h/20, this.w/2, this.h/2-this.h/2);
		line(this.w, this.h/2+this.h/20, this.w/2, this.h/2-this.h/2);
		stroke(0, 0, 50, 200);
		line(this.w, 3/4*this.h,  this.w, this.h/2+this.h/20);
		line(0, 4/5*this.h, this.w/2, this.h/2+this.h/12);
		line(this.w, 4/5*this.h, this.w/2, this.h/2+this.h/12);
		noStroke();
		
		//cockpit, midsection
		fill(176, 213, 235);
		rect(this.w/2-this.w/7, this.h/3, 13/50*this.w, 8/20*this.h, 4);
		fill(38, 76, 99);
		rect(this.w/2, this.h/3, 8/50*this.w, 8/20*this.h, 4);
		fill(100, 144, 176);
		rect(this.w/2-this.w/14, this.h/4, 8/50*this.w, 22/40*this.h, 4);
		stroke(0, 0, 50);
		fill(0, 0, 0);
		triangle(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8, this.w/2+this.w/6, this.h/3);
		fill(0, 86, 143,55+200*abs(sin(radians(frameCount))));
		triangle(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8, this.w/2+this.w/6, this.h/3);
		fill(0, 0, 50);
		triangle(this.w/2+this.w/14, this.h/3, this.w/2, this.h/8, this.w/2+this.w/6, this.h/3);
		stroke(0, 255, 255);
		line(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8);

		pop();
	}
	//ship while firing.  not the actual shots.
	drawFire(){
		push();    
		translate(this.P.x, this.P.y);
		fill(50, 50, 175);
		stroke(50, 50, 175);
		strokeWeight(2);
		ellipse(4*this.w/50, this.h/3, this.w/8, this.h/8);
		ellipse(46*this.w/50, this.h/3, this.w/8, this.h/8);
		ellipse(12*this.w/50, this.h/7, this.w/8, this.h/8);
		ellipse(37*this.w/50, this.h/7, this.w/8, this.h/8);
		line(4*this.w/50, this.h/3, this.w/2, -this.h/8);
		line(46*this.w/50, this.h/3, this.w/2, -this.h/8);
		fill(120, 255, 200);
		ellipse(this.w/2,0, this.w/5, this.h/4);
		noStroke();
		ellipse(4*this.w/50, this.h/3, 3*this.w/50, 3*this.w/50);
		ellipse(this.w/4.1, this.h/7, 3*this.w/50, 3*this.w/50);
		ellipse(46*this.w/50, this.h/3, 3*this.w/50, 3*this.w/50);
		ellipse(37*this.w/50, this.h/7, 3*this.w/50, 3*this.w/50);
		pop();
}
	//drawFire called here
	animate(){
		if(this.move[2]){  //up arrow true
			this.thruster = this.h/5;
		} 
		if(!this.move[2]){
			this.thruster = 0;
		}
		if (this.firing){
			this.drawFire();
		}
	}	
	
	update(){
		//constrain
		this.P.x= constrain(this.P.x, 0, levelW-this.w);
		this.P.y= constrain(this.P.y, 0, levelH-this.h);
		//accelerate according to speed and arrow keys specified in sketch keypressed function
		if (this.move[0]){this.V.x+=this.acc;}
		if (this.move[1]){this.V.x-=this.acc;}
		if (this.move[2]){this.V.y-=this.acc;}
		if (this.move[3]){this.V.y+=this.acc;}
		this.V.limit(this.MAXSP);

		this.P.add(this.V);

		//slow down if key not pressed
		if (!this.move[0] && this.V.x < 0){this.V.x+=this.dec;}
		if (!this.move[1] && this.V.x > 0){this.V.x-=this.dec;}
		if (!this.move[2] && this.V.y > 0){this.V.y-=this.dec;}
		if (!this.move[3] && this.V.y < 0){this.V.y+=this.dec;}
		//keeps ship from sliding (possibly a vector/float related issue)
		if (!this.move[0] && !this.move[1] && this.V.x < 0.5 && this.V.x > -0.5){this.V.x=0;}
		if (!this.move[2] && !this.move[3] && this.V.y < 0.5 && this.V.y > -0.5){this.V.y=0;}
		

		
		//limit firing rate
		if (this.firingDelay < this.weaponRecharge+1){
			this.firingDelay++;  
		}  
		if (this.firingDelay > this.weaponRecharge){
			this.firing=false;
		}
		
		//fire gun
		if (mouseIsPressed && !this.firing && this.health >= 0){ //change with pwrups
			this.weaponSound.play(); 
			this.shoot(); 
			this.firing = true;
			this.firingDelay = 0;
		}
		
		//update shots fired
		if (this.shots.length>0){
			for (var i = this.shots.length-1; i >= 0; i--){
				this.shots[i].draw();
				if(invGame.gameState==="inGame"){
					this.shots[i].update(this);
				}
				
				if (this.shots[i].P.y < -100){ 
					this.shots.splice(i,1);
				}
			}
		}
		
		
		//direct collision of ship with bads
		for (var i = bads.length-1; i>=0; i--){
			if (collide(bads[i], this) && this.dmgDelay > 40){
				this.health-=50;
				this.dmgDelay=0;
				bads[i].health-=50;
				sEnmDmg.play();
			}
		}
		
		//dmgDelay update
		if(this.dmgDelay < 41){this.dmgDelay++}
		
		//end game if no health remaining
		if(this.health<=0){
			
			this.dest.play();
			
			for (var i = bads.length-1; i >=0; i--){
				for (var s = bads[i].shots.length-1; s>=0; s--){
					bads[i].shots.splice(s,1);
				}
				bads.splice(i,1);
			}
			invGame.gameState = "gameOver";
		}
	}
}
