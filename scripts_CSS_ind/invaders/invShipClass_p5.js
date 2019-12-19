


//ship class
class Ship{
	constructor(x,y,w,h){
	this.P = createVector(x,y);
	this.V = createVector(0,0);
	this.w = w;
	this.h = h;
	this.type = "player";	
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
		textAlign(LEFT);
		text("score: " + this.score, width-65, height-20);
		
		fill(0,0,0);
		stroke(150,175,255);
		rect(width-65, height-10, 51, 7,2);
		noStroke();
		fill(155,0,40);
		//or map will hate you
		if (this.health < 0){
			this.health = 0;
		}
		rect(width-64, height-9, map(this.health,0,250,0,50), 5,2);
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		//noFill();
		//stroke(200,0,0);
		//rect(0,0,this.w, this.h); //hit box check
		imageMode(CENTER);
		
		//glow effects
		noStroke();
		
		fill(0, 62, 156, 30+60*abs(sin(radians(frameCount))));
		//animate thruster with UP
		if (this.move[2]){this.thruster = this.h/3;} else {this.thruster = 0;}
		rect(this.w/2-14/40*this.w, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		rect(this.w/2-2*this.w/50, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		
		fill(0, 62, 156, 25+50*abs(sin(radians(frameCount))));
		rect(this.w/2-12/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		rect(this.w/2-1/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		
		fill(0, 166, 255, 3*this.thruster+85+155*abs(sin(radians(frameCount))));
		ellipse(this.w/2-this.w/8, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		ellipse(this.w/2+this.w/7, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		
		fill(184, 230, 255);
		ellipse(this.w/2-this.w/8, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2); //left
		ellipse(this.w/2+this.w/7, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2);
		
		//adjust h+ the aprox fraction of image height not associated with the image hitbox (eg 28/123)
		if (this.firing){
			image(sprShipF, this.w/2, this.h/2, this.w, this.h+ .2275*this.h);
		}
		else {
			image(sprShip1, this.w/2, this.h/2, this.w, this.h+ .2275*this.h);
		}
		pop();	
	}	
		
		/*  original image  KEEP for more screenshots
		//thrusters and cannon
		//glow
		noStroke();
		fill(0, 62, 156, 100+100*abs(sin(radians(frameCount))));   //))))))))))))))))))
		if (!this.firing) {ellipse(this.w/2, 0, this.w/4, this.h/7);}
		
		fill(0, 62, 156, 30+60*abs(sin(radians(frameCount))));
		//animate with UP
		rect(this.w/2-14/40*this.w, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		rect(this.w/2-2*this.w/50, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		fill(0, 62, 156, 25+50*abs(sin(radians(frameCount))));
		if (!this.firing) {ellipse(this.w/2, this.h/90, this.w/3, this.h/7);}
		
		rect(this.w/2-12/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		rect(this.w/2-1/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		fill(0, 166, 255, 3*this.thruster+85+155*abs(sin(radians(frameCount))));
		if (!this.firing) {ellipse(this.w/2, 0, this.w/5, this.h/7);}
		ellipse(this.w/2-this.w/8, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		ellipse(this.w/2+this.w/7, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		fill(184, 230, 255);
		if (!this.firing) {ellipse(this.w/2, 0, this.w/10, this.h/8);}
		ellipse(this.w/2-this.w/8, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2); //left
		ellipse(this.w/2+this.w/7, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2);
		
		
		//ship thruster parts
		fill(20, 70, 100); 
		rect(this.w/2-4/20*this.w, this.h/2, this.w/6, 9/20*this.h, 2);//left
		rect(this.w/2+2*this.w/40, this.h/2, this.w/6, 9/20*this.h, 2);//right
		rect(this.w/2-this.w/12, this.h/20, this.w/6, this.h/10);//cover space between wings
		stroke(136, 159, 179);
		line(this.w/2-4/20*this.w, this.h/2, this.w/2-4/20*this.w, 19/20*this.h);
		
		//guns
		noStroke();
		fill(50, 80, 110); 
		rect(this.w/30,this.h/3.0,  this.w/12, this.h/4, 2); //left
		rect(this.w-5*this.w/40,this.h/3.0,  this.w/12, this.h/4, 2); //right
		rect(4.1*this.w/20,this.h/7,   this.w/14, this.h/4, 2); //2 from left
		rect(this.w-12*this.w/40,this.h/7,  this.w/14, this.h/4, 2); //3 from left
		
		//gun glow
		fill(60, 235, 255, 25+100*abs(sin(radians(frameCount))));
		ellipse(4*this.w/50, this.h/3, 5*this.w/50, 3.5*this.w/50);
		ellipse(this.w/4.1, this.h/7, 5*this.w/50, 3.5*this.w/50);
		ellipse(46*this.w/50, this.h/3, 5*this.w/50, 3.5*this.w/50);
		ellipse(37*this.w/50, this.h/7, 5*this.w/50, 3.5*this.w/50);
		
		//wings
		fill(100, 144, 176);
		quad(0, 4/5*this.h,  0, this.h/2+this.h/20,
			this.w/2, 0, this.w/2, this.h/2+this.h/12);
		quad(this.w, 4/5*this.h,  this.w, this.h/2+this.h/20,
			this.w/2, 0, this.w/2, this.h/2+this.h/12);
	   
		//highlights, shadow
		strokeWeight(this.w/50);
		stroke(150, 255, 255, 180);
		line(0, 4/5*this.h,  0, 28*this.h/50);  //down
		
		line(0, this.h/2+this.h/20, this.w/2, this.h/2-this.h/2);
		line(this.w, this.h/2+this.h/20, this.w/2, this.h/2-this.h/2);
		stroke(35, 50, 80, 120);
		
		line(this.w, 4/5*this.h,  this.w, 28*this.h/50);
		line(0, 4/5*this.h, this.w/2, this.h/2+this.h/12);
		line(this.w, 4/5*this.h, this.w/2, this.h/2+this.h/12);
		
		noStroke();
		
		//cockpit, midsection
		fill(176, 213, 235);
		rect(this.w/2.05-this.w/7, this.h/3.1, 13/50*this.w, 8/20*this.h, 4);  //left
		fill(38, 76, 99);
		rect(this.w/2, this.h/3.1, 8/50*this.w, 8/20*this.h, 4);  //right
		fill(100, 144, 176);
		rect(this.w/2-this.w/14, this.h/4, 7.0/50*this.w, 22/40*this.h, 4);  //mid
		stroke(0, 0, 50);
		fill(0, 0, 0);
		//btm left,                           mid                  right        
		triangle(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8, this.w/2+this.w/6, this.h/3);
		fill(0, 86, 143,55+200*abs(sin(radians(frameCount))));
		triangle(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8, this.w/2+this.w/6, this.h/3);
		fill(0, 0, 50);
		triangle(this.w/2-this.w/25, this.h/3, this.w/1.96, this.h/7, this.w/2+this.w/6, this.h/3);
		stroke(100, 255, 255,120);
		line(this.w/2-this.w/6, this.h/3, this.w/2, this.h/8);
		strokeWeight(1);
		pop();
	}
	//ship while firing.  not the actual shots.
	drawFire(){
		push();    
		translate(this.P.x, this.P.y);
		
		
		fill(60, 150, 210,210);
		stroke(60, 100, 175,150);
		strokeWeight(this.w/20);
		ellipse(4*this.w/50, this.h/3, this.w/8, this.h/8);
		ellipse(46*this.w/50, this.h/3, this.w/8, this.h/8);
		ellipse(12*this.w/50, this.h/7, this.w/8, this.h/8);
		ellipse(37*this.w/50, this.h/7, this.w/8, this.h/8);
		line(4*this.w/50, this.h/3, this.w/2, -this.h/8);
		line(46*this.w/50, this.h/3, this.w/2, -this.h/8);
		strokeWeight(this.w/40);
		stroke(60,150,210,210);
		line(4*this.w/50, this.h/3, this.w/2, -this.h/8);
		line(46*this.w/50, this.h/3, this.w/2, -this.h/8);
		fill(120, 255, 200);
		
		ellipse(this.w/2,0, this.w/6, this.h/4);
		noStroke();
		ellipse(4*this.w/50, this.h/3, 3*this.w/50, 3*this.w/50);
		ellipse(this.w/4.1, this.h/7, 3*this.w/50, 3*this.w/50);
		ellipse(46*this.w/50, this.h/3, 3*this.w/50, 3*this.w/50);
		ellipse(37*this.w/50, this.h/7, 3*this.w/50, 3*this.w/50);
		
		pop();
		*/
	/*
	//drawFire called here
	
	animate(){
		if(this.move[2]){  //up arrow true
			this.thruster = this.h/5;
		} 
		if(!this.move[2]){
			this.thruster = 0;
		}
		//if (this.firing){
		//	this.drawFire();
		//}
	}	
	*/
	
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
			if (bads.length > 0){
				for (var i = bads.length-1; i >=0; i--){
					for (var s = bads[i].shots.length-1; s>=0; s--){
						bads[i].shots.splice(s,1);
					}
					bads.splice(i,1);
				}
			}	
			if (pups.length > 0){
				for (var i = pups.length-1; i >= 0; i--){
					pups.splice(i,1);
				}
			}
			invGame.gameState = "gameOver";
		}
	}
}
