void setup(){
  size(400,400);
}  

int NUMBER_NEW_FISH = 8;
int CanvasSX = 400;  //set these to the canvas/setup() values
int CanvasSY = 400;  //use to refer to canvas width and height

float counter = 0;
int horizon = CanvasSY*7/8;



public void drawWaves(){
fill(229, 255, 255);
noStroke();
rect(0,0,CanvasSX,30);
fill(0, 0, 255);
beginShape();
curveVertex(-CanvasSX/4,  25);
curveVertex(0,  35+4*sin(counter));
curveVertex(CanvasSX*1/4,  25+4*sin(counter));
curveVertex(CanvasSX*1/2,  35+4*sin(counter));
curveVertex(CanvasSX*3/4,  25+4*sin(counter));
curveVertex(CanvasSX, 35+4*sin(counter));
curveVertex(CanvasSX+CanvasSX*1/4, 25+4*sin(counter));
curveVertex(CanvasSX+CanvasSX*1/4, 35-4*sin(counter));
curveVertex(CanvasSX, 25-4*sin(counter));
curveVertex(CanvasSX*3/4,  35-4*sin(counter));
curveVertex(CanvasSX*1/2,  25-4*sin(counter));
curveVertex(CanvasSX*1/4,  35-4*sin(counter));
curveVertex(0, 25-4*sin(counter));
curveVertex(-CanvasSX/4, 35);
endShape();
}

public void shadeSky(){
  fill(212, 242, 255,15);
  for (int i = 0; i<18; i++) {rect(0, 0, CanvasSX, i*18);}
}  

public void shadeGround(){
  fill(230, 230, 200);
  rect(0,horizon,CanvasSX,CanvasSY-horizon);
  fill(0, 123, 255, 61); //fill(0, 0, 0,35);
  for (int i = 1; i<5; i++) {rect(0, horizon, CanvasSX, CanvasSY/(8+10*i*i));}
  fill(255, 255, 255,180);
  ellipse(CanvasSX*1/5, CanvasSY, CanvasSX, CanvasSY*2/25);
  ellipse(CanvasSX, CanvasSY, CanvasSX*1/2, CanvasSY*2/25);
} 


public class Plant{
  public PVector P;
  public float sizeX;
  public float sizeY;
  public float sF;
  public float colorG;
  public float colorB;
  public Plant(float sF, float Yvariation){
    this.P = new PVector (1,1);
    this.P.x = random(0, CanvasSX);
    this.P.y = random(Yvariation+CanvasSY*19/20, Yvariation+CanvasSY);
    this.sizeY = random(CanvasSY*1/10,CanvasSY*1/2);
    this.sF = sF;
    this.colorG = random(50,225);
    this.colorB = random(25,75);
  }
  public void update(){
    if (this.P.x < -this.sF*20) {this.P.x = random(CanvasSX, CanvasSX*3/2);}
  }
  public void drawObject(){  
    pushMatrix();
    translate(this.P.x,this.P.y);
    scale(this.sF);
    fill(0, 0, 0,60);
    ellipse(0,2,7,2);
    stroke(0, this.colorG, this.colorB);
    strokeWeight(3.5*CanvasSX/400);
    line(0, 0, 1.5*sin(counter), -this.sizeY);
    noStroke();
    popMatrix();
    this.update();  
  }
}

Plant[] myPlantsL = new Plant[6]; { //larger plants in forground
  for (int i=0; i < myPlantsL.length; i++) {
    myPlantsL[i]= new Plant(1.6, CanvasSX/25);} 
}

Plant[] myPlantsS = new Plant[10]; { //smaller plants in background
  for (int i=0; i < myPlantsS.length; i++) {
    myPlantsS[i]= new Plant(0.5,-CanvasSX/12);} 
}


public class Fish {
  public PVector P;
  public float sizeX;  
  public float sizeY;
  public float colorR;
  public float colorG;
  public float colorB;
  public float stripeR;
  public float stripeG;
  public float stripeB;
  public Fish(float X, float Y){
    this.P = new PVector (X, Y);
    this.colorR = random(0,125);
    this.colorG = random(0,125);
    this.colorB = random(0,125);
    this.stripeR = random(0,255);
    this.stripeG = random(0,255);
    this.stripeB = random(0,255);
    this.sizeX = random(CanvasSX/10,CanvasSX/7); 
    this.sizeY = random(CanvasSY/20, CanvasSY/13);
  }
  public void update(){
    this.P.x += 1.5*abs(sin(counter/5))+random(1,2);
    if (this.P.x > CanvasSX+60){ this.P.x = -80;}
  }
  public void drawObject(){
    pushMatrix();
    translate(this.P.x, this.P.y);
    //triangles for fins
    fill(this.colorR,this.colorG,this.colorB, 100);
    triangle(0, 0,  -this.sizeX, -this.sizeY*2/3,  -this.sizeX*3/4, 0);
    triangle(0, 0,  -this.sizeX, this.sizeY*2/3,  -this.sizeX*3/4, 0);
    triangle  (-this.sizeX*3/10, -this.sizeY/3,  //top  
               -this.sizeX*2/10-abs(sin(counter)*this.sizeX/10), -this.sizeY*8/9+abs(sin(counter)*this.sizeX/10),  
                this.sizeX/6, -this.sizeY/2);     
    triangle  (this.sizeX*2/5, this.sizeY/3,   
               -this.sizeX*1/10-abs(sin(counter)*this.sizeX/10), this.sizeY*8/9-abs(sin(counter)*this.sizeX/10),   
               -this.sizeX/20, this.sizeY/2);    
    triangle  (-this.sizeX*3/10, this.sizeY/3,   
               -this.sizeX*4/10-abs(sin(counter)*this.sizeX/8), this.sizeY*6/9-abs(sin(counter)*this.sizeX/10),   
               -this.sizeX/5, this.sizeY*2/5);    
    //main body, tail, head are three ellipses
    fill(this.colorR,this.colorG,this.colorB);
    ellipse(0, 0, this.sizeX, this.sizeY);
    ellipse(this.sizeX/5, 0, this.sizeX*2/3, this.sizeY*3/5);
    ellipse(-this.sizeX/4, 0, this.sizeX*3/4, this.sizeY*4/5);
    //random body stripes
    stroke(this.stripeR, this.stripeG, this.stripeB);
    strokeWeight(4);
    line(this.sizeX*1/9, -this.sizeY*3/10,   this.sizeX/20, this.sizeY*2/7);
    line(-this.sizeX*1/25, -this.sizeY*3/10,   -this.sizeX*2/20, this.sizeY*2/7);
    line(-this.sizeX*2/9, -this.sizeY*1/10,   -this.sizeX*5/20, this.sizeY*1/7);
    noStroke();
    //scales
    fill(235, 255, 255, 180);
    ellipse(this.sizeX/4, -this.sizeY/4, this.sizeX/25, this.sizeX/25);
    ellipse(this.sizeX/11, -this.sizeY/6, this.sizeX/25, this.sizeX/25);
    ellipse(-this.sizeX*1/10, -this.sizeY/4, this.sizeX/25, this.sizeX/25);
    ellipse(-this.sizeX*1/4, -this.sizeY/6, this.sizeX/25, this.sizeX/25);
    ellipse(-this.sizeX*5/12, -this.sizeY/6, this.sizeX/25, this.sizeX/25);
    //eyes
    noStroke();
    fill(255, 255, 0);
    ellipse(this.sizeX*3/10, 0, this.sizeX/10, this.sizeX/10); 
    fill(0, 0, 0);
    ellipse(this.sizeX*3/10, 0, this.sizeX/20, this.sizeX/20);
    popMatrix();
    this.update();
  }
}  

Fish[] myFish = new Fish[3]; {
  for (int i=0; i < myFish.length; i++){
    myFish[i]= new Fish(random(0,CanvasSX),random(CanvasSY/4,CanvasSY*3/4));
  } 
}


public class Bubble{
  public PVector P;
  public PVector V;
  public PVector A;
  public float sF;
  public float rot;
  public float sizeX;  
  public float sizeY;
  public Bubble(float X, float Y, float sF, float rot){
    this.P = new PVector (X, Y);
    this.V = new PVector (0, 0);
    this.A = new PVector (0, 0);
    this.sF = sF;
    this.rot = rot;
    this.sizeX = random(CanvasSX*1/80,CanvasSX*3/60);
    this.sizeY = this.sizeX; //width and height are the same for this object
  }  
  public void update(){
    this.sizeX+=sin(random(-2,2)*counter)/10;
    this.sizeY = this.sizeX;
    this.P.x+=sin(counter/2)/4+random(-0.4,0.6);
    this.P.y-=1*this.sizeX/25+random(0,0.5);
  }
  public void checkBounds(){
    if (this.P.y < 1.5/10*CanvasSY){this.P.y = CanvasSY+this.sizeY;}
    if (this.P.x + this.sizeX < 0){this.P.x = CanvasSX + this.sizeX;}
    if (this.P.x - this.sizeX > CanvasSX){this.P.x = - this.sizeX ;}
  }
  public void drawObject(){
    pushMatrix();
    translate(this.P.x, this.P.y);
    scale(this.sF);
    stroke(120, 240, 255, 150); 
    strokeWeight(1);
    fill(0, 35, 191,50);
    ellipse(0,0,this.sizeX, this.sizeX);
    noStroke();
    fill(27, 0, 84,70);
    ellipse(0.12*this.sizeX,0.12*this.sizeX,this.sizeX/1.5, this.sizeX/1.5);
    fill(255, 255, 255, 230);
    ellipse(-0.12*this.sizeX,-0.28*this.sizeX,this.sizeX/7, this.sizeX/7);
    ellipse(-0.25*this.sizeX,-4,this.sizeX/12, this.sizeX/12);
    popMatrix();
    this.update();
    this.checkBounds();
  }
}

Bubble[] myBubbles = new Bubble[5];{
  for (int i=0; i < myBubbles.length; i++){
    myBubbles[i]= new Bubble(random(0,460),400,1,0);
  } 
}



public class Rock{
  public PVector P;
  public PVector V;
  public PVector A;
  public float sF;
  public float rot;
  public float sizeX;  
  public float sizeY;
  public float colorR;
  public float colorG;
  public float colorB;
  public Rock (float sF, float Yvariation){
    this.P = new PVector (0, 0);
    this.V = new PVector (0, 0);
    this.A = new PVector (0, 0);
    this.P.x = random(0,400);
    this.P.y = random(Yvariation+CanvasSY*19/20, Yvariation+CanvasSY);
    this.colorR = random(100,125);
    this.colorG = random(100,125);
    this.colorB = random(100,125);
    this.sF = sF + random(-0.3,0.3); //randomize size a little
    this.rot = radians(-45); //I don't want to draw this again it's easier to just rotate the original
  }
  public void update(){
    if (this.P.x < -CanvasSX*1/5){this.P.x = random(CanvasSX, CanvasSX*3/2);}
  }
  public void drawObject(){
    pushMatrix();
    translate(this.P.x, this.P.y);
    scale(this.sF);
    fill(0, 0, 0,110);
    ellipse(20,13,36,5);
    rotate(this.rot);
    strokeWeight(0.5);
    stroke(20, 20, 20);
    fill(this.colorR,this.colorG,this.colorB);
    beginShape();
    curveVertex(0,15);
    curveVertex(0,8);
    curveVertex(10,8);
    curveVertex(20,22);
    curveVertex(20,28);
    curveVertex(12,28);
    curveVertex(0,18);
    curveVertex(0,8);
    endShape(CLOSE);
    noStroke();
    fill(this.colorR+100,this.colorG+100,this.colorB+100,150);
    beginShape();
    curveVertex(4,18);
    curveVertex(1,9);
    curveVertex(10,9);
    curveVertex(20,23);
    curveVertex(16,25);
    curveVertex(7,19);
    curveVertex(2,13);
    endShape(CLOSE);
    fill(255, 255, 255,170);
    rotate(-this.rot);
    ellipse(16,2,12,5);
    ellipse(26,3,8,3);
    ellipse(16,1,6,2);
    fill(0, 0, 0,80);
    ellipse(18,11,18,3);
    ellipse(27,10,8,3);
    popMatrix();
    this.update(); 
  }
}

Rock[] myRocksL = new Rock[3]; { //larger Rocks in forground
  for (int i=0; i < myRocksL.length; i++) {
    myRocksL[i]= new Rock(2, 0);} 
}
Rock[] myRocksS = new Rock[5]; { //smaller Rocks in background
  for (int i=0; i < myRocksS.length; i++) {
    myRocksS[i]= new Rock(0.5, -25);} 
}



public int fishAdded = 0;
public Fish[] addedFish = new Fish [NUMBER_NEW_FISH];
//add up to NUMBER_NEW_FISH with mouseclick. fishAdded tracks instances.
public void drawAddedFish(){
  for (int i = 0; i < fishAdded; i++) {addedFish[i].drawObject();}
}

//myArrays:  myBubbles, myFish, myPlantsL, myPlantsS
public void drawArrays(){
  for (int i = 0; i < myPlantsS.length; i++){myPlantsS[i].drawObject();}
  for (int i = 0; i < myRocksS.length; i++){myRocksS[i].drawObject();}
  for (int i = 0; i < myFish.length; i++){myFish[i].drawObject();}
  if (fishAdded > 0){drawAddedFish();} // do not call this unless there is a fish added to the array!
  for (int i = 0; i < myPlantsL.length; i++){myPlantsL[i].drawObject();}
  for (int i = 0; i < myRocksL.length; i++){myRocksL[i].drawObject();}
  for (int i = 0; i < myBubbles.length; i++){myBubbles[i].drawObject();}
}

void mouseClicked (){
  if ( mouseY > height/8 && mouseY < CanvasSY*5/6 && fishAdded < 8){
    fishAdded+=1;
    addedFish[fishAdded-1] = new Fish(mouseX, mouseY);
  }
}



void draw(){
background(0, 120, 210);
drawWaves();
shadeSky();
shadeGround();
drawArrays();

counter+=radians(1); //convert counter variable from original code to radians.
if (counter > 360) {counter = 0;}
}
