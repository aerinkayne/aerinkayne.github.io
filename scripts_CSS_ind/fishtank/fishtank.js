let addObjectsToArr = function(number, arr, obj){
	while(number>0){
	arr.push(new obj);
	number--;
	}
}

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

let gradientH = function(colorStart, colorEnd, distance, H,Y){
	let num = ceil(distance/H);  //num rects over canvas
	let shiftColor;
	for (let i = 0; i< num; i++){
		shiftColor = lerpColor(color(colorStart), color(colorEnd), i/num);
		fill(shiftColor);
		rect(0, Y + i*H, width, H);
	}
} 

class Waves{
	constructor(x, y, divWidth, amp){
		this.P = createVector(x,y);
		this.waveColor = [125, 140, 250];
		this.amplitude = amp;
		this.divisionWidth = divWidth;
	}
	draw(){
		noStroke();
		fill(this.waveColor);
		push();
		translate(this.P.x, this.P.y);
		beginShape();
		let d = this.divisionWidth;
		let D = width/d;
		curveVertex(0, this.amplitude*sin(radians(frameCount)));
		for (let i = 0; i <= D; i++){  //2PI
			curveVertex(i*d, this.amplitude*sin(radians(frameCount) + i * PI));
		}
		for (let i = D; i >= 0; i--){
			curveVertex(i*d, -this.amplitude*sin(radians(frameCount) + i * PI));
		}
		curveVertex(0, -this.amplitude*sin(radians(frameCount)));
		endShape(CLOSE);
		pop();
	}
}
class Plant{
	constructor(){
		this.scaleMin = 0.5;
		this.scaleMax = 1;
		this.scale = random(this.scaleMin, this.scaleMax);
		this.w = this.scale*width/60;
		this.h = this.scale*2/3*height;
		this.P = createVector(random(width), map(this.scale, this.scaleMin, this.scaleMax, horizon, height));
		this.opacity = map(this.scale, this.scaleMin, this.scaleMax, 50,255);
		this.color = [0, random(50,175),random(25,100), this.opacity];
	}
	draw(){  
		push();
		translate(this.P.x,this.P.y);
		fill(0, 0, 0, 50);
		ellipse(0, 2*this.scale, this.w+4*this.scale,3*this.scale);
		stroke(this.color);
		strokeWeight(this.w);
		line(0, 0, 3*this.scale*sin(radians(frameCount)), -this.h);
		strokeWeight(1);
		noStroke();
		pop();
	}
}

class Fish {
	constructor(x,y){
		this.P = createVector(x || random(width),y || random(height/7,7/8*height));
		this.color = [random(125),random(125),random(125)];
		this.stripeColor = [random(255),random(255),random(255)];
		this.w = random(40,60);
		this.h = random(20,30);
		this.animationOffset = random(PI);
	}
	updatePosition(){
    this.P.x += 0.5 + 1.5*abs(sin(radians(frameCount/4)+this.animationOffset));
	}
	checkBounds(){
		if (this.P.x > width + this.w){
			this.P.x = -this.w;
		}	
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		//fins
		fill(this.color[0],this.color[0],this.color[0], 100);
		triangle(0, 0,  -this.w, -this.h*2/3,  -this.w*3/4, 0);
		triangle(0, 0,  -this.w, this.h*2/3,  -this.w*3/4, 0);
		triangle  (-this.w*3/10, -this.h/3,  //top  
				   -this.w*2/10-abs(sin(radians(frameCount))*this.w/10), -this.h*8/9+abs(radians(sin(frameCount))*this.w/10),  
					this.w/6, -this.h/2);     
		triangle  (this.w*2/5, this.h/3,   
				   -this.w*1/10-abs(sin(radians(frameCount))*this.w/10), this.h*8/9-abs(radians(sin(frameCount))*this.w/10),   
				   -this.w/20, this.h/2);    
		triangle  (-this.w*3/10, this.h/3,   
				   -this.w*4/10-abs(sin(radians(frameCount))*this.w/8), this.h*6/9-abs(radians(sin(frameCount))*this.w/10),   
				   -this.w/5, this.h*2/5);    
		//main body, tail, head are three ellipses
		fill(this.color);
		ellipse(0, 0, this.w, this.h);
		ellipse(this.w/5, 0, this.w*2/3, this.h*3/5);
		ellipse(-this.w/4, 0, this.w*3/4, this.h*4/5);
		//random body stripes
		stroke(this.stripeColor);
		strokeWeight(4);
		line(this.w*1/9, -this.h*3/10,   this.w/20, this.h*2/7);
		line(-this.w*1/25, -this.h*3/10,   -this.w*2/20, this.h*2/7);
		line(-this.w*2/9, -this.h*1/10,   -this.w*5/20, this.h*1/7);
		noStroke();
		//scales
		fill(235, 255, 255, 180);
		ellipse(this.w/4, -this.h/4, this.w/25, this.w/25);
		ellipse(this.w/11, -this.h/6, this.w/25, this.w/25);
		ellipse(-this.w*1/10, -this.h/4, this.w/25, this.w/25);
		ellipse(-this.w*1/4, -this.h/6, this.w/25, this.w/25);
		ellipse(-this.w*5/12, -this.h/6, this.w/25, this.w/25);
		//eyes
		noStroke();
		fill(255, 255, 0);
		ellipse(this.w*3/10, 0, this.w/10, this.w/10); 
		fill(0, 0, 0);
		ellipse(this.w*3/10, 0, this.w/20, this.w/20);
		pop();
		this.updatePosition();
		this.checkBounds();
	}
}  


class Bubble{
	constructor(x,y){
    this.P = createVector(x || random(width), y || random(height/5,height));
	this.scaleMin = 0.6;
	this.scaleMax = 1;
	this.scale = random(this.scaleMin, this.scaleMax);
    this.w = this.scale*width/15;
	this.animationOffset = random(PI);
	}  
	updatePosition(){
		let P2 = createVector(1/2*sin(radians(frameCount) + this.animationOffset), -this.w/25);
		this.P.add(P2);
	}
	checkBounds(){
    if (this.P.y < height/5){
		this.P.y = height + this.w;
		this.w = random(this.scaleMin, this.scaleMax)*width/15;
		this.P.x = random(width);
	}
    if (this.P.x + this.w < 0){this.P.x = width + this.w;}
    if (this.P.x - this.w > width){this.P.x = - this.w ;}
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);
		stroke(120, 240, 255, 150); 
		strokeWeight(1);
		fill(0, 35, 190,50);
		ellipse(0,0,this.w, this.w);
		noStroke();
		fill(30, 0, 85,70);
		ellipse(0.12*this.w,0.12*this.w, this.w/1.5, this.w/1.51);
		fill(255);
		ellipse(-0.12*this.w,-0.28*this.w,this.w/7, this.w/7);
		ellipse(-0.25*this.w,-4,this.w/12, this.w/12);
		pop();
		this.updatePosition();
		this.checkBounds();
	}
}