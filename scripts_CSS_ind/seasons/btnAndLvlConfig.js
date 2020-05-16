let scrWidth = 500;
let scrHeight = 375;

const levelData = [
    
    {   //0 winter
        levelMap: 
        [
            "                                                                                                                        ",
            "0h                                       		                                                                         ",
            "0C 0d                                                                                                                   ",
            "            En                                                                                                          ",
            "         0c 0C 0C 0C 0C 0C 0d                                                                                           ",
            "                                                                                                                        ",
            "0C 0d                                                                                                                   ",  
            "                                                            02                                                          ",
            "               0m                                           01                                                          ",    
            "            0^       0^                                     01                                                          ",     
            "         02 02 02 02 02 02       02 02       02             01                                  0^    0^    0f    07    ",    
            "02                                              02       02 01                   En       02 02 02 02 02 02 02 02 02 02 ",    
            "                                                01       0v 01                   02 02                                  ",    
            "   02                                           01 02       01                                                          ",    
            "         02 02                                  01 En    09 01             02                                           ",    
            "                                                01 02 02 02 01 02 02 02 02 01                                           ",    
            "                  02 02                                                             02 02                               ",    
            "                                                                                             En                         ",    
            "         02 02 02                                                                            02 02                      ",    
            "                                                                                                                        ",    
            "02    En                                                                                                 02 02 0>       ",    
            "   02 02 02                                                                                     02 02                   ",    
            "   0v                                                                                                                02 ",    
            "00                02                                  En                0m                02                            ",    
            "            02          02             0m             02 02                               01                   02       ",    
            "            01 0^                                     01 01                         02 02 01 0h    0^    0^ En          ",    
            "02 02 0L 02 01 02 02 02 02 02 0L 0L 0L 0L 0L 0L 0L 0L 01 01 0L 0L 0L 0L 0L 0L 0L 0L 01 01 01 02 02 02 02 02 02 02 02 02 "  
        ],
        skyStart: [82,149,204],  
        skyEnd: [250, 200, 255], 
        hillColors: [[60,85,130,210],[102,147,192],[150,200,235]],  //order is background, middle, foreground.  
        hasLake: false,
        music: undefined,   //assigned in sketch preload.  
        levelEffect: "snow",   
        numBGeffects: 140,     
        numFGeffects: 25       
    },


    //***************************************************************************************************/


    {   //spring
        levelMap: 
        [ 	//03 rocks  04 rocks w grass   05 ground   06 ground w grass
            "                                                   0F 0F 0F 0f 0F 0F 0f 0f En    07    0f                                              ",  
            "                                             04 04 04 04 04 04 04 04 04 04 04 04 04 04 04                                              ",  
            "                     0c 0C 0C 0C 0d                                                                                                    ",
            "0f 0f 0f ES                                                                                                                            ",
            "04 04 04 04                                                                                                                            ",
            "03 03 03 03 04                                                                                              ES                      0h ",
            "                           0m                               En                   0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C ",
            "                                       0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0d                                                    ",
            "                                                                                                                                       ",
            "                           0m                                                                                                          ",
            "                                                                                                                                       ",
            "               0m                                                                                                                      ",
            "   En                                                                                                 0^    0^                         ",
            "0C 0C 0d                               0^                0c 0d             0c 0d                   0c 0C 0C 0C 0d                      ",
            "            0^       0^          0c 0C 0C 0C 0d                                        0c 0d                      0c 0d             0f ",
            "         0c 0C 0C 0C 0C 0d                                                                                                          06 ",
            "                                                                                                                     0F    0f          ",
            "                                                                                 0^ 0f                            06 06 06 06          ",
            "                                                                              06 06 06                                              0h ",
            "                                                                     En 0^    05 05 05                                              06 ",
            "                                                0F En                06 06 06 05 05 05                                           06 05 ",
            "0F    0f 00 0f 0F                0^ 0f          06 06             0f 05 05 05 05                                           0F En 05 05 ", 
            "06 06 06 06 06 06 06          06 06 06                         06 06 05 05 05 05                      0m                   06 06 05 05 ", 
            "05 05 05 05 05 05 05                                           05 05 05 09                                                 05 05 05 05 ", 
            "05 05 05 05 05 05 05 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 06 06 06 06 06 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 05 "
        ],
        skyStart: [70,110,120],
        skyEnd: [242,252,255],
        hillColors: [[50,85,95,120],[78,110,90],[90,145,105]],
        hasLake: false,
        music: undefined,   //assigned in sketch preload
        levelEffect: "rain",
        numBGeffects: 140,
        numFGeffects: 25
    },


    //***************************************************************************************************/


    {   //summer
        levelMap:
        [	//03 10 rocks   04 11 rocks w grass
            "                                                                                                                                       ",  
            "                                                                                          En    07                                     ",
            "                                                               0^ En 0^                0c 0C 0C 0C 0C 0d                               ",
            "                                                         0c 0C 0C 0C 0C 0C 0d                                                          ",
            "                                    0^    En                                                                                           ",
            "                              0c 0C 0C 0C 0C 0C 0d                                                                                     ", 
            "                                                                                                                                       ",
            "            0m                                                                                     0F 0h                               ",
            "   0h                                                                                              11 04 11                            ",
            "04 04 0>                                                                                                             ES                ",
            "            11                                                                                                    0F 04 11 0>          ",
            "                        0m                                                                                        04                   ",
            "                                 0F ES                            0e 0E 0e 0E 0e 0E 0e 0E 0e                      10             0< 11 ",
            "                              04 04 11 04 11                      0e 0g 0e 0g 0e 0g 0e 0g 0e                      10 0^    04          ",
            "                                             04                   0e 0E 0e 0E 0e 0E 0e 0E 0e En 0F    0f 0f    04 03 04                ",
            "                                          0h 10 0B 0B 0B 0B 0B 0B 0B 0B 0B 11 04 11 11 04 11 04 11 04 04 11 04 10 10 10 En             ", 
            "00                                        04 03 11 11 11 04 11 04 11 04 04 03 10 03 10 10 10 03 03 03 10 03 10 03 03 10 04 11 0>       ",
            "   0f       0F                   0^ 11                                        0v                      0v                            11 ",
            "04 04 11 11 11 04          04 11 11                                                                                                    ",        
            "                        04                            0f    0^    En                0f    0^ En                ES 0F          04       ",
            "                                                      04 04 11 11 04 11       11 04 04 11 04 11 04 04 11 11 04 11 11 04                ",
            "                  11                                                                   03                                           04 ",
            "                     04                0m                                              03                0h                      11 10 ",
            "0h       0^ 0^ En       0f 0F                                                          10 09          0F 11 0>             0f          ",
            "04 11 11 04 04 11 11 11 04 11 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 03 11 0L 0L 11 04 10 04 11 04 0L 0L 11 04 04 11 "
        ],
        skyStart: [150, 205, 255],
        skyEnd: [255, 237, 244],
        hillColors: [[150, 190, 220],[105,170,135],[130, 200, 130]],
        hasLake: true,
        music: undefined,   //assigned in sketch preload
        levelEffect: "none",   //TODO update
        numBGeffects: 0,
        numFGeffects: 0
    },


    //***************************************************************************************************/


    {   //fall
        levelMap:
        [   //12, 13 leaves.  05, 14 ground
            "                                                                                                                                       ",
            "                                                                                                                                       ",
            "               En                   ES                                                                                        0h       ",
            "0h          0c 0C 0C 0C 0d       0c 0C 0d          0c 0C 0C 0C 0C 0d                En                               0c 0C 0C 0d       ",
            "0d                                                                               13 12 12                                              ",
            "                                                                              13                            0m                         ",
            "            0m                                                             12                                                          ",
            "                                                                           dF                13 12 12 13 12                            ",
            "                     12                                                    14 0p                            12                         ",
            "                              En          12 0^                         13    13 13 ES       LP                13                      ",
            "                              12 13 13 13 14 12 13 13 12 13          13             12 12 13 12 12 13             13                   ",
            "                           12                                     12                   0v                         14                   ",
            "                  12       14                                     14                                              14                   ",
            "0p       13                05 ES    09                En    0^ 12 05 07       0^ LP ES       12 12 13 13 12 12 13                      ",
            "12       05             12 05 12 12 12 13       12 12 12 13 12 05 05 13 13 13 12 12 13 13 12 14                                        ",
            "05    13 05             14 05                   05 14 14 05     0v                  05 05 14                                           ",
            "05       05          12 14       00                                                                            0p                      ",
            "dF 12    14 0h 0^ 0^ 05 05                LP          ES 12                   0^          LP    0^ ES 12 13 12 12 13 13 13 12          ",
            "         05 12 13 12 05 14 12 13 13 12 12 12 13 13 12 12 dF 13 12 12 13 12 13 12 12 13 12 13 12 12 13                0v                ",
            "      12 14 05 05                                                          0v                                                          ",
            "   13 14 05 05                                                                                                                         ",
            "                                             12    13    12                         0^                                           12    ",
            "12       LP ES    13 0^                   0^    0^    0^    0^          13 13 12 12 12 13 0>             ES LP             13          ",
            "05 13 12 12 13 13 05 12 12 0L 0L 0L 12 12 13 13 12 12 13 12 12 12 13 12 14 05 14 14 05 14 05 14 05 0L 0L 12 13 12 0L 0L 0L 0L 0L 0L 0L "
        ],
        skyStart: [45, 50, 90],
        skyEnd: [255, 180, 200],
        hillColors: [[55, 35, 25],[90,55,20],[140, 80, 30]],
        hasLake: false,
        music: undefined,   //assigned in sketch preload
        levelEffect: "leaf",
        numBGeffects: 30,
        numFGeffects: 5
    },

    //end
    {
        levelMap: ["1"],
        music: undefined   //assigned in sketch preload
    }

]


//************************ buttons **************************/

const btnStart1 = {
	x: 8.62*scrWidth/10, 
	y: 8.5*scrHeight/10,
	w: scrWidth/15,
    h: scrHeight/15,
    r: 3,
	txt: "➤",
	txtSize: 16,
	txtColor: [65,200,185],
    btnColor: [0,70,55],
	onClick: ()=> {
		game.gameState = "inGame";
    },
    onHover() {
        this.txtColor = [150,255,255];
    },
    offHover() {
        this.txtColor = [65,200,185];
    }
}

const pause1 = { 
    x: 1.75*scrWidth/10,               
	y: scrHeight/100,              
	w: scrWidth/18, 
    h: scrHeight/25,
    r: 2,               
    txt: "❚❚",
    txtSize: 9,    
    btnColor: [50,175,150],
    txtColor: [200,255,255], 
    onClick(){
        if (!this.paused) {
            game.paused = true;
            this.txt =  "➤";
            this.draw();  //call here since btn won't draw in class once paused.
            this.paused = true;
            
        }
        else {
            game.paused = false;
            this.txt = "❚❚";
            this.paused = false;
        }
    }
}
const continue1 = {
	x: scrWidth/2-3*scrWidth/20,               
	y: scrHeight/2,              
	w: scrWidth/8, 
    h: scrHeight/15,
    r: 8,
    txtSize: 14,               
	txt: "continue",    
    btnColor: [75,200,255], 
    onClick(){
         game.clickToContinue();
    }
}
const restart1 = {
	x: scrWidth/2 + scrWidth/20,               
	y: scrHeight/2,               
	w: scrWidth/8,
    h: scrHeight/15,
    r: 1,    
    txtSize: 14,             
	txt: "Restart",    
    btnColor: [255,75,110], 
    onClick(){
        game.levelData[game.currentLevel].music.stop();
        game = new Game();
   }
}

const btnLevelSelect = {
	x: 0,
	y: 0,
	w: scrWidth/3.5,
    h: scrHeight/3.1,
    r: 2,
    txtSize: 16,
    txtColor: [255,255,255],
	onClick() {
        game.setLevel(this.accessLevel);
        btnLevels.forEach(btn=> {
            btn.btnColor = [0,0,0];
            btn.selected = false;
        });
        this.selected = true;
        this.btnColor = [255,255,255];
    },
    onHover() {
        this.overlayAlpha = 0;
        textAlign(CENTER,CENTER);
        textSize(this.txtSize);
        fill(this.txtColor);
        text(
`Selecting this will
 take you to ${this.season}`,this.P.x+this.w/2, this.P.y+this.h/2);
    },
    offHover() {
        if (!this.selected){
            this.overlayAlpha = 100;
        } 
    }
}

