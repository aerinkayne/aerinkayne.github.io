/* @pjs preload="sprites/spritesheet1.png"; */     //sorta working AO 031619 yay.  look into typeof.borken

var c = document.getElementById("gameCanvas");
var height = 400; //images originally drawn relative to a 400 x 400 canvas
var width = 400; 
var fullWidth = c.width; //from value in html file
var fullHeight = c.height;


void setup() {
    size(600, 400);
}

//load spritesheets and set images
PImage sprite1 = loadImage("sprites/spritesheet1.png");
imgG1 = sprite1.get(0,0,50,50);
imgG2 = sprite1.get(50,0,50,50); 
imgD1 = sprite1.get(0,50,50,50);
imgD2 = sprite1.get(50,50,50,50);
imgS1 = sprite1.get(0,100,50,50);
imgS2 = sprite1.get(50,100,50,50);
imgIce1 = sprite1.get(0,150,50,50);
imgIce2 = sprite1.get(50,150,50,50);

imgHeart = sprite1.get(100,50,50,50);
imgR1 = sprite1.get(0, 200, 50, 50);
imgR2 = sprite1.get(50, 200, 50, 50);
imgR3 = sprite1.get(0,250,50,50);
imgR4 = sprite1.get(50,250,50,50);
imgKey = sprite1.get(100, 200, 50, 50);
imgPortal = sprite1.get(100, 250, 50, 50);

var keys=[];
void keyPressed(){keys[keyCode]=true;};   
void keyReleased(){keys[keyCode]=false;};

// game state
var state="inGame";    




// Button function
var button=function(x,y,w,h,txt,txtSize){
    stroke(0);
    strokeWeight(3);
    
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h){
        fill(150);
    }
    else{
        fill(200);
    }
    
    var txtPos=h/30;
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h&&mousePressed&&mouseButton===LEFT){
        rect(x,y,w,h,10);
        
        fill(0);
        textAlign(CENTER,CENTER);
        textSize(txtSize);
        text(txt,x+(w/2),y+(h/2)+txtPos);
        textAlign(LEFT,LEFT);
        
        return true; 
    }
    
    rect(x,y,w,h,10);
    
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(txtSize);
    text(txt,x+(w/2),y+(h/2));
    textAlign(LEFT,LEFT);
    strokeWeight(1);
};

// works for (upwards) triangles and rectangles
var collide=function(obj1,obj2){ //make player consistently obj2
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
};
var onScreen = function(obj1, obj2){ //checks if obj1 and 2 are both onscreen
    return abs(obj2.P.x - obj1.P.x)<fullWidth/2 +min(fullWidth/2, abs(obj2.P.x-obj1.P.x))&&
           abs(obj2.P.y - obj1.P.y)<fullHeight/2 +min(fullHeight/2,abs(obj2.P.y-obj1.P.y));
};

//sorts an array by a property value, where str is the property name)
var sortArrByProperty = function(arr, str){
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
};


var transparency=0;
var fadeColor=color(255, 255, 255, transparency);

// Player Object
var Player=function(x,y,w,h){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.V = new PVector(0,0);
    this.moveSpeed=0.25;
    this.MAXSPEED=4;
    this.MAXHEALTH = 6;
    this.falling=false;
    this.gravity=0.4;
	this.keyInputs=[RIGHT,LEFT,UP,DOWN];
    this.color= (50, 50, 50);
    this.health=3;
    this.gotKey=false;
    this.delay = 36; //for damaging collisions
	this.type = "player";
};
Player.prototype.update=function(blocks){  //objects for collision
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
    
    //decelerate  add different surfaces?
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
};
Player.prototype.checkCollision=function(obj, velx, vely){  
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
};
Player.prototype.draw= function() {  
    noStroke();
    fill(this.color);
    pushMatrix();
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
    popMatrix();    
};
Player.prototype.stats=function(){
    noStroke();
    resetMatrix();
    fill(0, 0, 0,25);
    rect(0,0, fullWidth, fullHeight/10);
    fill(255, 255, 255);
    textSize(fullHeight/25);
    textAlign(LEFT,CENTER);
    text("Health ", fullWidth/50,fullHeight/35);
    
    for(var i = 0; i< this.MAXHEALTH; i++){
        rect(fullWidth/50+i*21, fullHeight/17, 20, 10, 4);
    }
    fill(200, 50, 75);
    for(var i=0; i<this.health; i++){
        rect(fullWidth/50+i*21, fullHeight/17, 20, 10, 4);
    }
    fill(255, 255, 255);
    textSize(fullHeight/25);
    text("Got Key?: ", 0.72*fullWidth,fullHeight/35);

    if(this.gotKey){
        text("Yes!",0.85*fullWidth,fullHeight/35);
    } else {
            text("NO", 0.85*fullWidth, fullHeight/35); 
            textSize(fullHeight/25);
            fill(255, 255, 255, 100*abs(sin(radians(1.5*frameCount))));
            text("Go get the key !", 0.72*fullWidth, fullHeight/15);
            }
};


var Block=function(x,y,w,h,type){  //pass image name or type
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.img=type;
        if (type === "mover"){
		this.type = "mover";
        this.disp = random(-125,125);
        this.P.x = this.P.x+this.disp;
        this.inc = 1;
    }

};
Block.prototype.draw= function() {
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
    image(this.img, this.P.x, this.P.y, this.w+1, this.h+1);  //overlap helps with tearing
	}
};    
Block.prototype.update = function(player){ //movers
    if (this.disp > 125 || this.disp < -125){
        this.inc*=-1;
    }
    this.disp+=this.inc;
    this.P.x+=this.inc;
};


var Portal=function(x,y,w,h){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.complete=false;
	this.img = imgPortal;
	this.type = "portal";
};
Portal.prototype.draw= function() {
	image(this.img, this.P.x, this.P.y, this.w, this.h);
};
Portal.prototype.update=function(player){
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
};

var Portkey=function(x,y,w,h){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.collected=false;
    this.img = imgKey;
	this.type = "portkey";
};
Portkey.prototype.draw= function(player) {
    if(!player.gotKey){
        image(this.img, this.P.x, this.P.y, this.w, this.h);
    }
};
Portkey.prototype.update=function(player){
        if(onScreen(this, player) && collide(this,player) && !player.gotKey){
                //playSound(getSound("retro/coin"));
        this.collected=true;
        player.gotKey=true;
        }
};


var Spike=function(x,y,w,h){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.type = "triangle";
};
Spike.prototype.draw= function() {
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
};
Spike.prototype.update=function(player){
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
};


var Heart = function(x,y,w,h){
this.P = new PVector(x,y);
this.w = w;
this.h = h;
this.collected = false;
this.img = imgHeart;  //heart image 
this.type = "heart";
};
Heart.prototype.draw = function() {
	if (!this.collected){
        image(this.img, this.P.x, this.P.y, this.w, this.h);
	}
};
Heart.prototype.update = function(player){
        if(onScreen(this, player) && collide(this,player) && !this.collected){
                //playSound(getSound("retro/coin"));
                    if(player.health < 6){
                        player.health++;
                        this.collected = true;
                    }
            
        }
};


var Lava = function(x,y,w,h, colorChar){
this.P = new PVector (x,y);
this.w = w;
this.h = h;
if (colorChar === "l"){
	this.color= color(180, 0, 0);
	}
if (colorChar === "p"){
	this.color= color(0, 120, 0);
	}
};
Lava.prototype.draw = function() {
    pushMatrix();
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
    popMatrix();
    noStroke();
};

//flower object by Ryan Kee
var Flower=function(x,y,w,h){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.G= random(120,175);
};
Flower.prototype.draw= function() {
    noStroke();
    fill(0, this.G, 0);
    rect(this.P.x-this.w/8,this.P.y,this.w/3.0,this.h);
    
    for(var i=0; i<6; i++){
        pushMatrix();
            translate(this.P.x,this.P.y);
            rotate(radians(i*60));
            fill(255, 255, 255);
            ellipse(5,0,this.w,this.h/2.5);
        popMatrix();
    }
    fill(214, 214, 23);
    ellipse(this.P.x,this.P.y,this.w,this.h/2);
};

//background / foreground objects 
var Snowflake=function(player, lvW, lvH){
    this.lvW = lvW;
    this.lvH = lvH;
    this.player = player;
    this.SF = random(0.3,1.5);
    this.P = new PVector(random(fullWidth),random(fullHeight));
    this.V = new PVector(random(-1,1),2.0);
    this.V.mult(4/5*this.SF);
};
Snowflake.prototype.update=function(){
        
    if(this.P.y > fullHeight + fullHeight/4){ 
        this.P.y = -fullHeight/4;         
    }
    if(this.P.x > fullWidth){
        this.P.x = 0;
    }
    if(this.P.x < 0){
        this.P.x = fullWidth;
    }
    
    this.P.add(this.V);

    //so falling objects don't move with char.  
    if (this.player.P.x + this.player.w/2 > fullWidth/2 &&
        this.player.P.x + this.player.w/2 < this.lvW-fullWidth/2){ 
        this.P.x-=this.player.V.x;  
    }
    if (this.player.P.y + this.player.h/2 < this.lvH-fullHeight/2) {
        this.P.y-=this.player.V.y;
    }
};
Snowflake.prototype.draw= function() {
    fill(255, 255, 255, 50+150*this.SF);
    ellipse(this.P.x, this.P.y, this.SF*random(3,5), this.SF*random(3,5));
};

var Leaf=function(player, lvW, lvH){
    this.lvW = lvW;
    this.lvH = lvH;
    this.player = player;
    this.P = new PVector(random(fullWidth), random(fullHeight));
    this.V = new PVector(random(-1,1), random(0.5, 1));
    this.w = random(5,10);
    this.h = random(5, 10);
    this.angle = 0;
    this.spinSpeed = random(1,5);
    this.R = random(150,230);
    this.G = random(50, 200);
    this.B = random(25, 50);
};
Leaf.prototype.draw= function() {
    noStroke();
    
    fill(this.R, this.G, this.B);
    pushMatrix();
        translate(this.P.x,this.P.y);
        rotate(this.angle);
        ellipse(0,0,this.w,this.h);
    popMatrix();
};
Leaf.prototype.update=function(){

    if(this.P.y>fullHeight){
        this.P.y=0;
    }
    if(this.P.x>fullWidth){
        this.P.x=0;
    }
    if(this.P.x<0){
        this.P.x=fullWidth;
    }
    this.angle+=this.spinSpeed;
    this.P.add(this.V);
    
    if (this.player.P.x + this.player.w/2 > fullWidth/2 &&
        this.player.P.x + this.player.w/2 < this.lvW-fullWidth/2){ 
        this.P.x-=this.player.V.x;  
    }
    if (this.player.P.y + this.player.h/2 < this.lvH-height/2) {
        this.P.y-=this.player.V.y;
    }
};

var Hills = function(arrPV, levelW, levelH, player, speed){  //from objecthandler per level
this.arrPV=arrPV;
this.levelW = levelW;
this.levelH = levelH;
this.player = player;
this.speed = speed;
this.x = 0;
this.y = 0;
this.lake = false;
}; 
Hills.prototype.draw = function(R, G, B) {
    pushMatrix();
    
    if (this.player.P.x + this.player.w/2 > fullWidth/2 &&
        this.player.P.x + this.player.w/2 < this.levelW-fullWidth/2){ 
            translate(this.speed*(fullWidth/2-this.player.w/2-this.player.P.x),   0);
            }
    if (this.player.P.x + this.player.w/2 >= this.levelW-fullWidth/2) {
            translate(this.speed*(-this.levelW+fullWidth),   0);
            }        
    if (this.player.P.y + this.player.h/2 < this.levelH-fullHeight/2){
            translate(0,   this.speed*(this.levelH-fullHeight/2-this.player.h/2-this.player.P.y));
            }

    
    noStroke();
    fill(R, G, B);
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
		fill(0, 123, 199);
		rect(this.arrPV[0].x, this.arrPV[0].y+66, this.levelW, this.levelH-this.arrPV[0].y);
        fill(R, G, B,50);
            for (var i = 1; i<6; i++){
                rect(0, this.arrPV[0].y+66, this.levelW, height/(5+5*i*i));
            }
    }
    popMatrix();   
};

var ObjectHandler=function(max, levelW, levelH, player){ //handle background object arrays
    this.levelW = levelW;  //get from game in loadmap function
    this.levelH = levelH;
    this.max = max;
	this.player = player;
    this.snow=[];
    this.fgSnow=[];
    this.leaves=[];
    this.fgLeaves=[];
    this.hills=[];
};
ObjectHandler.prototype.initHills = function(speed){
    if (this.hills.length===0){ //make three hills
        var incX = this.levelW/25;  //20, 9, 5
        var speed = speed;
        for (var j=0; j<3; j++){
            var arrPV = [];  
            incX+=75*j;  
            for (var i = 0; i*incX < this.levelW; i++){  
                arrPV.push(new PVector (i*incX, height/4+incX/1.5+random(-15-20*j, 15+20*j)));
            }
            this.hills.push(new Hills(arrPV, this.levelW, this.levelH, this.player, speed));
            speed*=2;
            
        }
    }
    
};
ObjectHandler.prototype.add=function(type){  
    if (type==="snow"){
        if (this.snow.length < this.max) {    
            this.snow.push(new Snowflake(this.player, this.levelW, this.levelH));
        }
        
        if(this.fgSnow.length<this.max/10){
            this.fgSnow.push(new Snowflake(this.player, this.levelW, this.levelH));
            this.fgSnow[this.fgSnow.length-1].SF=1.6;
            this.fgSnow[this.fgSnow.length-1].V.mult(1.6);
        }
    }
    if (type==="leaves"){
        if (this.leaves.length < this.max/10) {
            this.leaves.push(new Leaf(this.player, this.levelW, this.levelH));
        }
        
        if (this.fgLeaves.length<this.max/20){
            this.fgLeaves.push(new Leaf(this.player, this.levelW, this.levelH));
            this.fgLeaves[this.fgLeaves.length-1].SF=2.0;
            this.fgLeaves[this.fgLeaves.length-1].V.mult(2.0);
        }
    }
};
ObjectHandler.prototype.shadeSky = function(R,G,B){
	noStroke();      
	fill(R, G, B, 4); //0,145,255,5
	for (var i = 0; i<14; i++){
		rect(0, 0, fullWidth, i*25);}
};


//decorative images with draw method or sprite but no updates
var Deco = function(x,y,w,h, color, img, z_Index){
    this.P = new PVector(x,y);
    this.w=w;
    this.h=h;
    this.img = img;
    this.color = color;
    this.z_Index = z_Index;
}; 


var flowers= [];
var lava = [];
var portkeys =[];
var hearts = [];
var spikes = [];
var portals = [];
var players = [];
var blocks = [];
var decoImages = [];


var Game=function(){ 
	players.push(new Player(0,0,30,30));
    this.player = players[0];
    this.ts = 50;  //tile size
    this.currentLevel=0;   
    /*
     * 1: player        2: dirt block       3: grass block      4: ice block
     * 5: snow block    6: rock grass block 7: portal           8: spike
     * 9: key           m: moving block     l: lava/poison      R: rocks1
	 * r: rocks2		0: rock grass2
    */
    this.levels=[
        //   0        1         2         3         4
        //   1234567890123456789012345678901234567890
        [  
            "                    5                   ",    //1
            "                    4                   ",    //2
            "    8  8            4                  7",    //3
            "   555555  55  5    4          8  8  555",    //4
            "5               5  54         5555555   ",    //5 
            "                4   4      55           ",    //6
            " 5              45  4                   ",    //7
            "   55           4  94    5              ",    //8
            "                4555444444              ",    //9
            "      55                    55          ",    //0
            "                                        ",    //1
            "   555                         55       ",    //2
            "                                        ",    //3
            "5                                  55   ",    //4
            " 555                            55      ",    //5 
            "                                       5",    //6
            "1     5                 m     5         ",    //7
            "    5   5    m    55          4      5  ",    //8
            "    48            44        554h 8 8    ",    //9
            "55l5455555llllllll44llllllll444555555555",    //0

        ],

        [
            "                      73",
            "                   f3332",
            "                  332  2",
            "             3 f 32 2 92",
            "             2333      2",
            "        f 8832        32",
            "    f  3333322 3 3333  2",
            "31 33882       282  23 2",
            "2   2332      f 2   2  2",
            "233 2        33       32",
            "  2  f    f 828      f 2",
            "  23333  333323333 3 332"
        ],
		
		
        [
        //   0        1         2         3         4
        //   1234567890123456789012345678901234567890
            "                              ", //25
            "                              ",
            "                              ",
            "                              ",
            "                              ",
            "                              ", //20
            "                              ",
            "   m                          ",
            "                              ",
            "666                           ",
            "   0                          ",
            "        m                     ",
            "                    b b b b b ",
            "          66        bgbgbgbgbg",
            "               6    b b b b b ",
            "               r              ", //10
            "1             6R00060606660660",
            "    7      80               9r",
            "660006   600                 R",
            "        6          8  8   066R",
            "                  660060     r",
            "      0        m             R",
            "       6                     R",
            "h  88       m                r",
            "6006600060lllllllllllllllllllR"
        ],

        [   
            "h                       ",
            "3                       ",
            "                        ",
            "   m                    ",
            "                        ",
            "     m                  ",
            "                 9      ",
            "3   3   3     3  33     ",
            "2            3 88  3    ",
            "2         333233333233  ",
            "2    3   3             3",
            "2  3     2 7          3 ",
            "2  2    323333  38338   ",
            "2 32    2 1      3  3333",
            "2  28 832               ",
            "23 23332233333333333    ",
            "   2                    ",
            "  3             3 3  3  ",
            "      8        8 8 8 8  ",
            "666666666   666666666666"
        ],
        [
            "1"
        ]
    ];
    this.levelW = 0;
    this.levelH = 0;
	this.mapTiles = [lava, flowers, blocks, portals, spikes, portkeys, hearts, decoImages];
};

Game.prototype.removeMap = function(arr){
    for(var i=0; i<arr.length; i++){
        for(var j=0; j<arr[i].length; j++){
            arr[i].splice(j,arr[i].length);
        }
    }
};

Game.prototype.renderArr = function(arrToRender, arrSupport){  //supportForParams
    for (var p = 0; p< arrSupport.length; p++){
        for(var i=0; i<arrToRender.length; i++){
            if (onScreen(arrToRender[i], arrSupport[p])){
                arrToRender[i].draw(arrSupport[p]);
            }
			//call update method if there is one
            if (onScreen(arrToRender[i], arrSupport[p]) &&
			
             //typeof arrToRender[i].update === "function"){ //not currently working (?)
				(arrToRender[i].type==="mover"   || //work around
                 arrToRender[i].type==="portal"  || 
                 arrToRender[i].type==="triangle"||
                 arrToRender[i].type==="portkey" ||
                 arrToRender[i].type==="heart"   ||
                 arrToRender[i].type==="player")
				 
                ){ 
					arrToRender[i].update(arrSupport[p]);
            }        
        }
    }
};


Game.prototype.camera = function(player){
    
    //horizontal constrain
    player.P.x= constrain(player.P.x, 0, this.levelW-player.w);  
    
    //camera
    if(player.P.x + player.w/2 > fullWidth/2){
        translate((fullWidth/2-(player.P.x + player.w/2)), 0);
    }
    if(this.levelW - (player.P.x + player.w/2) < fullWidth/2){
        translate(fullWidth/2-(this.levelW - player.P.x - player.w/2), 0);
    }
    
    translate(0, fullHeight/2-(player.P.y + player.h/2));
    
    if(this.levelH - (player.P.y+player.h/2) < fullHeight/2){
       translate(0, fullHeight/2-(this.levelH - player.P.y - player.h/2));
    }

    // if player falls down
    if(player.P.y > this.levelH + height){
        player.health=0;
    }
};

Game.prototype.bgManager = function(objectHandler){  //BG_Object
    
    if(this.currentLevel===0){ /**************************/
        background(9, 32, 61);
        objectHandler.initHills(0.15);
        for(var i = 0; i < objectHandler.hills.length; i++){
			objectHandler.hills[i].draw(70+30*i,80+50*i,125+60*i);
				if (i===1){objectHandler.shadeSky(0,145, 255);}
        }
        objectHandler.add("snow"); 
            for(var i=0; i< objectHandler.snow.length; i++){
                objectHandler.snow[i].update();
                objectHandler.snow[i].draw();
            }
    }
    if(this.currentLevel===1){ /**************************/
        background(245, 250, 255);
        objectHandler.initHills(0.15);
            for(var i = 0; i < objectHandler.hills.length; i++){
                objectHandler.hills[i].draw(130-50*i,180-40*i,140-35*i);
					if (i===1){objectHandler.shadeSky(0,145, 255);}
            }
    }
    if(this.currentLevel===2){ /**************************/
        background(237, 247, 255);
        objectHandler.initHills(0.15);
            for(var i = 0; i < objectHandler.hills.length; i++){
				objectHandler.hills[0].lake = true;
                objectHandler.hills[i].draw(185-90*i,215-40*i,235-60*i);}
					if (i===1){objectHandler.shadeSky(0,145, 255);}
			}
    if(this.currentLevel===3){ /**************************/
        background(242, 252, 255);
        objectHandler.initHills(0.15);
            for(var i = 0; i < objectHandler.hills.length; i++){
                objectHandler.hills[i].draw(160-30*i,175-25*i,140-20*i);    
					if (i===1){objectHandler.shadeSky(89, 216, 255);}
            }
        objectHandler.add("leaves");  
            for(var i=0; i< objectHandler.leaves.length; i++){
                objectHandler.leaves[i].update();
                objectHandler.leaves[i].draw();
            }
    }
};
Game.prototype.fgManager = function(objectHandler){  
    
    if(this.currentLevel===0){ /**************************/
        objectHandler.add("snow"); //should already be there but shouldn't add if it is
            for(var i=0; i< objectHandler.fgSnow.length; i++){
                objectHandler.fgSnow[i].update();
                objectHandler.fgSnow[i].draw();
            }
    }
    if(this.currentLevel===1){ /**************************/
    }
    if(this.currentLevel===2){ /**************************/
    }
    if(this.currentLevel===3){ /**************************/
        objectHandler.add("leaves");  
            for(var i=0; i< objectHandler.fgLeaves.length; i++){
                objectHandler.fgLeaves[i].update();
                objectHandler.fgLeaves[i].draw();
            }
    }
};



Game.prototype.loadMap=function(){ 
    //recalc level width and height for each level 
    this.levelW = this.levels[this.currentLevel][0].length*this.ts;
    this.levelH = this.levels[this.currentLevel].length*this.ts;
    var S = this.ts;  //map tile size
    for(var col=0; col<this.levels[this.currentLevel].length; col++){
        for(var row=0; row<this.levels[this.currentLevel][col].length; row++){
            var s=this.levels[this.currentLevel][col][row];  //array character
            if(s==="1"){
                this.player.P.x = row*S;
                this.player.P.y = col*S;
            }
			if(s==="0"){
                blocks.push(new Block(row*S,col*S,S,S,imgR1)); //rocks w grass
            }
            if(s==="2"){
                blocks.push(new Block(row*S,col*S,S,S,imgD1)); //dirt 
            }
            if(s==="3"){
                blocks.push(new Block(row*S,col*S,S,S,imgG1)); // dirt w grass
            }
            if(s==="4"){
                blocks.push(new Block(row*S,col*S,S,S,imgIce1)); //ice
            }
            if(s==="5"){
                blocks.push(new Block(row*S,col*S,S,S,imgS1)); //ice w snow
            }
            if(s==="6"){
                blocks.push(new Block(row*S,col*S,S,S,imgR2)); //rocks w grass2
            }
			if(s==="R"){
                blocks.push(new Block(row*S,col*S,S,S,imgR3)); //rocks1
            }
			if(s==="r"){
                blocks.push(new Block(row*S,col*S,S,S,imgR4)); //rocks2
            }
            if(s==="m"){
                blocks.push(new Block(row*S,col*S,3/2*S,S/3,"mover"));
            }
            if(s==="7"){
                portals.push(new Portal(row*S,col*S,S,S));
            }
            if(s==="8"){
                spikes.push(new Spike(row*S+(S-S/1.75)/2.0, col*S-1.25*S, S/1.75, 2.25*S));
            }
            if(s==="9"){
                portkeys.push(new Portkey (row*S,col*S,S,S));
            }
            if(s==="l"){  //L
                lava.push(new Lava(row*S,col*S+S/5,S,S-S/5, "l"));
            }
            if(s==="h"){
                hearts.push(new Heart(row*S+S/4,col*S+S/4,S/2,S/2));
            }
			//decorative
			if(s==="f"){  
                flowers.push(new Flower(row*S+S/2,col*S+S/2,S/4,S/2));
            }
			
        }
    }
    //reload object handler with correct level size
    this.objectHandler = new ObjectHandler(80, this.levelW, this.levelH, this.player);
};




Game.prototype.runGame=function(){

    this.bgManager(this.objectHandler); //background effects
    this.camera(this.player);

    //draw and update objects of map
    for (var i=0; i<this.mapTiles.length; i++){
        this.renderArr(this.mapTiles[i], players);
    }

    this.player.draw();
    this.player.update(blocks);
    this.player.stats();
    
    this.fgManager(this.objectHandler);  //forground effects

    // manage level transitions
    for(var i=0; i<portals.length; i++){
        if(portals[i].complete){
            transparency=0;
            fadeColor=color(255, 255, 255, transparency);
            this.currentLevel++; 
            this.removeMap(this.mapTiles);
            this.loadMap(); 
            this.player.gotKey=false;
        } 
    }
    
    // create an invisible screen for fading when needed
    resetMatrix();
    fill(fadeColor);
    rect(0,0,fullWidth,fullHeight);
    
    if(this.currentLevel===4){
        state="win";
    }
        
};

// create a game
var game=new Game();

//fill array objects before main
game.loadMap();
void draw() {
    
    if(state==="inGame"){
        // apply the game to the draw loop
        game.runGame();
    }
    if(state==="dead"){
        if(button(fullWidth/2-50,fullHeight/2-15,100,30,"Click to restart",12)){
            game.removeMap(game.mapTiles);
            game.player.health = 3;
            game.loadMap();
            state="inGame";
            transparency=0;
            fadeColor=color(255, 255, 255,transparency);
        }else{
            noStroke();
            fill(255, 0, 0,1);
            rect(0,0,fullWidth,fullHeight);
            fill(255, 255, 255);
            textSize(50);
            textAlign(CENTER,CENTER);
            text("You Died!",fullWidth/2,1/3*fullHeight);
        }
    }
    if(state==="win"){
        fill(0, 200, 0,1);
        noStroke();
        rect(0,0,fullWidth,fullHeight);
        fill(0, 0, 0);
        textAlign(CENTER,CENTER);
        textSize(50);
        text("You Win!",fullWidth/2,fullHeight/2);
    }
};
