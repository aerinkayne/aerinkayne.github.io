void setup(){
  size(400,400); 
}

float counter = 0.0;

//pretty messy, didn't think picture would get this involved!

public class Waves {
  public int Xpos;
  public int Ypos;
  public float sF;
  public Waves(int X, int Y, float sF){
  this.Xpos = X;
  this.Ypos = Y;
  this.sF = sF;
  }
  public void drawObject(){
  stroke(0, 50, 155, 230);
  fill(2, 0, 71,130);
  pushMatrix();
  translate(this.Xpos, this.Ypos);
  scale(this.sF);
  beginShape();
  curveVertex(0,  0);
  curveVertex(0,  0);
  curveVertex(100,  -10+4*sin(4*counter));
  curveVertex(200,  10+4*sin(4*counter));
  curveVertex(300,  -10+4*sin(4*counter));
  curveVertex(400, 10+4*sin(4*counter));
  curveVertex(500, 0);
  curveVertex(500, 0);
  curveVertex(400, -10-4*sin(4*counter));
  curveVertex(300,  10-4*sin(4*counter));
  curveVertex(200,  -10-4*sin(4*counter));
  curveVertex(100,  10-4*sin(4*counter));
  curveVertex(0, 0);
  curveVertex(0, 0);
  endShape();
  popMatrix();
  }
  public void highLights(){
  pushMatrix();
  noStroke();
  translate(this.Xpos, this.Ypos);
  scale(this.sF);
  for (int i = 0; i < 2; i++){
    fill(112, 200, 255,70*cos(4*counter));     
    ellipse(88+215*i,-4,40+8*sin(4*counter),8-3*sin(4*counter));
    fill(112, 200, 255,70*sin(4*counter));
    ellipse(200+210*i,-6,40+8*cos(4*counter),8-2*cos(4*counter));
    }
    for (int i = 0; i < 2; i++){
    fill(0, 0, 0,120*sin(4*counter));    
    ellipse(103+213*i,1,45+10*cos(4*counter),8-3*cos(4*counter));
    fill(0, 0, 0,120*cos(4*counter));
    ellipse(215+213*i,1,45+10*sin(4*counter),8-2*sin(4*counter));
    }
  popMatrix();
  }
 }
Waves waves1 = new Waves(-41,283,0.8);
Waves waves2 = new Waves(111,254,0.6);
Waves waves3 = new Waves(80,338,1.2);
Waves waves4 = new Waves(-104,378,2.0);
Waves waves5 = new Waves(-22,248,0.5);
Waves waves6 = new Waves(208,248,0.4);


public class StarArray{
  int NUMSTARS = 55;
  float[] backgroundStarsX = new float[NUMSTARS];
  float[] backgroundStarsY = new float[NUMSTARS];
  public StarArray(){
    for (int i=0; i <NUMSTARS; i++){
        backgroundStarsX[i] = (random(0, 400));
        backgroundStarsY[i] = (random(0, 220));
    }
  }
  public void drawBackgroundStars(){ 
    for (int i=0; i < NUMSTARS; i++) {
        strokeWeight(2);
        stroke(random(35,200), random(35,200), random(55,200)); //color variance
        point(backgroundStarsX[i], backgroundStarsY[i]); //fixed location
      }  
      strokeWeight(1);
    }  
}
StarArray stars1 = new StarArray();


public void drawWaterMist(){
  int HORIZON = 248;
  noStroke(); 
  for (int i = 0; i < 15; i++){ //mist
     fill(100, 190, 225, 7);    
     rect(0,HORIZON,width,-5*i);
   }
  fill(0, 20, 51);  //water
  rect(0,HORIZON,width,155); 
}


public class Moon{
  int Xpos;
  int Ypos;
  float sF;
  public Moon(int X,int Y,float sF){
    this.Xpos = X;
    this.Ypos = Y;
    this.sF = sF;
  }
  public void drawObject(){
    pushMatrix();
    translate(this.Xpos, this.Ypos);
    scale(this.sF);
    noStroke();
    fill(30, 82, 133,20); 
    for (int i = 0; i <6; i++){
      ellipse(0,0,45+8*i,45+8*i);
      } 
      
    fill(80, 98, 150);
    ellipse(0,0,45,45);
    fill(213, 234, 255);
    ellipse(0,0,43,43);
    fill(0, 24, 51);
    ellipse(6,0,32,38);
    
    fill(214, 230, 255,130);
    triangle(-10,7,  -3,-3,  -8,8);
    triangle(-8,7,  -3,3,  -7,9);
    triangle(-8,8,  2,6,  -7,10);
    triangle(-7,13,  3,14,  -7,10);
    triangle(-4,14,  0,11,  -3,15);
    triangle(-3,16,  1,16,  -3,18);
    triangle(-10,-7,  -2,-3,  -10,-4);
    triangle(-12.5,-3,  -4,2,  -10,-4);
    triangle(-7,-10.5,  -2,-6,  -5,-12);
    triangle(-5,-12,  1,-13,  -5,-14.5);

    fill(255, 255, 255,170);
    triangle(-14,-2,  -11,6,  -11,-3);
    triangle(-17,-3.5,  -19,8,  -15,-2);
    triangle(-18,-5,  -21,0,  -17,-3);
    triangle(-18.5,-9,  -20,-6,  -18,-5);
    triangle(-16,6,  -14,9,  -14,5);
    triangle(-12.3,7,  -10,-5,  -9,6);
    triangle(-9,15,  -1,20,  -7,13);
    triangle(-19,3,  -21,2,  -19,1);
    triangle(-15.3,11,  -20,6,  -15,8.5);
    triangle(-14,14,  -16,14,  -15,11);
    triangle(-13,15,  -11,18,  -10,16);
    triangle(-6,-17,  0,-20,  -5,-15);
    triangle(-7.5,-18,  -4,-21,  -6,-17);  
    
    fill(120, 152, 181);
    stroke(255, 255, 255,150);
    strokeWeight(0.3);
    ellipse(-14,-7,9,10);
    ellipse(-8,-14,7,8);
    ellipse(-16,2,6,7);
    ellipse(-5,17,5,6);
    ellipse(-11,11,8,9);
    ellipse(-13,-14,3.5,4);
    noStroke();
    fill(30, 58, 89);
    ellipse(-14,-7,6,7);
    ellipse(-8,-14,4,5);
    ellipse(-16,2,3,4);
    ellipse(-5,17,3,4);
    ellipse(-11,11,5,6);
    ellipse(-13,-14,1.5,2);
    popMatrix();
  }
}
Moon moon1 = new Moon(300,100,4.0);



public class Arm {
  int Xcoord;
  int Ycoord;
  float sF;
  public Arm(int X,int Y,float sF){
    this.Xcoord = X;
    this.Ycoord = Y;
    this.sF = sF;
  }
  public void drawObject(){
    pushMatrix();
    translate(this.Xcoord, this.Ycoord);
    scale(this.sF);
    fill(9, 113, 115);
    stroke(255, 255, 255,150); //backsuckers
    strokeWeight(1);
    ellipse(31+8*sin(counter),73+1*sin(counter),7,7);
    ellipse(31+7*sin(counter),84,8,8);
    ellipse(31+6*sin(counter),95,8,8);
    ellipse(34+5*sin(counter),108,10,10);
    ellipse(41+3*sin(counter),121,11,11);
    popMatrix();
    
    stroke(0, 120, 138);
    fill(96, 155, 184); //underbelly
    pushMatrix();
    translate(this.Xcoord, this.Ycoord);
    scale(this.sF);
    beginShape();
    curveVertex(0+15*sin(counter),+5*sin(counter));
    curveVertex(0+15*sin(counter),+5*sin(counter));

    curveVertex(10+10*sin(counter),34+5*sin(counter));
    curveVertex(45+10*sin(counter),52);
    curveVertex(50+5*sin(counter),91);
    curveVertex(79,125);
    curveVertex(80,135);

    curveVertex(73,137);
    curveVertex(55,137);
    curveVertex(34+5*sin(counter),107);
    curveVertex(29+10*sin(counter),63);
    curveVertex(0+10*sin(counter),44+5*sin(counter));

    curveVertex(0+15*sin(counter),+5*sin(counter));
    curveVertex(0+15*sin(counter),+5*sin(counter));
    endShape();
    popMatrix();

    noStroke();
    fill(0, 12, 36,200);
    pushMatrix();
    translate(this.Xcoord, this.Ycoord);
    scale(this.sF);
    beginShape();
    curveVertex(0+15*sin(counter),+5*sin(counter));
    curveVertex(0+15*sin(counter),+5*sin(counter));

    curveVertex(10+10*sin(counter),34+5*sin(counter));
    curveVertex(45+10*sin(counter),52);
    curveVertex(50+5*sin(counter),91);
    curveVertex(80,125);
    curveVertex(80,135);

    curveVertex(71,141);
    curveVertex(69,137);
    curveVertex(42+5*sin(counter),107);
    curveVertex(36+10*sin(counter),57);
    curveVertex(5+10*sin(counter),39+5*sin(counter));

    curveVertex(0+15*sin(counter),+5*sin(counter));
    curveVertex(0+15*sin(counter),+5*sin(counter));
    endShape();

    fill(0, 12, 36,120);
    beginShape();
    curveVertex(45+7*sin(counter),90);
    curveVertex(45+7*sin(counter),90);
    curveVertex(50+5*sin(counter),97);
    curveVertex(75,125);
    curveVertex(82,135);

    curveVertex(65,141);
    curveVertex(67,137);
    curveVertex(42+5*sin(counter),107);
    curveVertex(39+7*sin(counter),76);

    curveVertex(45+7*sin(counter),90);
    curveVertex(45+7*sin(counter),90);

    endShape();
    popMatrix();

    pushMatrix();
    translate(this.Xcoord, this.Ycoord);
    scale(this.sF);
    fill(117, 255, 248);
    stroke(255, 255, 255,200);
    strokeWeight(0.5);
    ellipse(-2+12*sin(counter),21+5*sin(counter),4,4);
    ellipse(-3+11*sin(counter),29+5*sin(counter),5,5);
    ellipse(-2+11*sin(counter),38+5*sin(counter),6,6);
    ellipse(2+11*sin(counter),46+5*sin(counter),6,6);
    strokeWeight(1.2);
    ellipse(37+8*sin(counter),73+1*sin(counter),7,7);
    ellipse(37+7*sin(counter),84,8,8);
    ellipse(37+6*sin(counter),95,9,9);
    ellipse(40+5*sin(counter),108,10,10);
    ellipse(48+3*sin(counter),121,11,11);
    noStroke();
    fill(0, 0, 0,70);
    ellipse(-2+12*sin(counter),21+5*sin(counter),2,2);
    ellipse(-3+11*sin(counter),29+5*sin(counter),3,3);
    ellipse(-2+11*sin(counter),38+5*sin(counter),3,3);
    ellipse(2+11*sin(counter),46+5*sin(counter),3,3);
    ellipse(37+8*sin(counter),73+1*sin(counter),4,4);
    ellipse(37+7*sin(counter),84,5,5);
    ellipse(37+6*sin(counter),95,5,5);
    ellipse(40+5*sin(counter),108,6,6);
    ellipse(48+3*sin(counter),121,7,7);
    popMatrix();
    }
}

Arm arm1 = new Arm(20,120,1.2);
Arm arm2 = new Arm(108,165,0.75);
Arm arm3 = new Arm(250,100,2.4);
Arm arm4 = new Arm(188,190,0.50);



public class Eye {
  int Xpos;
  int Ypos;
  float sF;
  float rot;
  public Eye(int X, int Y, float sF, float rot) {
  this.Xpos = X;
  this.Ypos = Y;
  this.sF = sF;
  this.rot = rot;
  }  
  public void drawObject(){
    pushMatrix();
    translate(this.Xpos, this.Ypos);
    scale(this.sF);
    rotate(this.rot);
    
    fill(0, 32, 56);  //pad under eyes (darker ellipse)
    ellipse(16,1,35,28); 
    fill(0, 85, 125); //pad under eyes (lighter ellipse)
    ellipse(15,0,35,27); 
    
    strokeWeight(1);
    stroke(0, 30, 60);
    fill(110, 150, 180); //shaded eyewhite
    beginShape();
    curveVertex(15,0);
    curveVertex(0,0);
    curveVertex(15,-10+3.5*abs(sin(counter/2)));
    curveVertex(30,0);
    curveVertex(15,10-3.5*abs(sin(counter/2)));
    curveVertex(0,0);
    curveVertex(10,-5);
    endShape();

    noStroke();
    fill(180, 240, 240); //eyewhite
    ellipse(15,0,25,10-6*abs(sin(counter/2)));
    stroke(0,60,60,130); //iris 
    fill(0, 214, 140,170);
    ellipse(15,0,12,10);
    noStroke();
    fill(0, 0, 0); //pupil
    ellipse(15,0,1+4*abs(sin(counter/2)),9); ///
    fill(255, 255, 255);
    ellipse(11,-2,3,3);
    popMatrix();
  }
}

Eye eye1 = new Eye(150,370,3.0,0); //creature left
Eye eye2 = new Eye(255,375,3.2,-0.25); //bottom right
Eye eye3 = new Eye(75,335,2.2,0.40); //front middle
Eye eye4 = new Eye(115,305,1.2,0.29); // middle row 2
Eye eye5 = new Eye(167,315,1.4,0); // creature left row 2
Eye eye6 = new Eye(65,295,1.1,1.15); //creature right row 1
Eye eye7 = new Eye(100, 280, 0.8, 1.15); //creature right row 2
Eye eye8 = new Eye(230,320,1.7,-.15);

public void drawSomeTeefs(){ //really lazy, fix this later so it takes args
fill(120, 160, 200);
stroke(217, 245, 255,150);
triangle(41,315, 14,340, 49, 323);   
triangle(40,325, 14,350, 49, 333);   
triangle(42,335, 16,360, 51, 343);   
triangle(43,346, 16,371, 51, 354);   
triangle(45,357, 19,382, 54, 365);   
triangle(55,364, 26,392, 64, 371);   
triangle(68,369, 36,396, 74, 379);   
triangle(75,380, 54,400, 105, 378);
triangle(90,386, 65,410, 118, 385);
triangle(108,391, 75,420, 128, 395);  
noStroke();

fill(0, 54, 85);   // some body details
ellipse(255,334,440,160);
fill(0, 124, 181,60);
ellipse(255,332,380,130);
}





void draw(){
background(2, 0, 28);  
stars1.drawBackgroundStars(); 
moon1.drawObject();
drawWaterMist();


waves5.drawObject();
waves5.highLights(); 
waves6.drawObject();
waves6.highLights(); 

waves2.drawObject();  
waves2.highLights(); 

arm1.drawObject();
arm2.drawObject();
arm4.drawObject();

drawSomeTeefs();
  
eye5.drawObject();     
eye6.drawObject();   
eye7.drawObject();  
eye8.drawObject();  
eye1.drawObject();
eye2.drawObject();

eye4.drawObject();
eye3.drawObject();    
   

waves1.drawObject();  
waves1.highLights(); 

arm3.drawObject();
waves3.drawObject(); 
waves3.highLights(); 
waves4.drawObject();  
waves4.highLights(); 
counter+=0.02;
}