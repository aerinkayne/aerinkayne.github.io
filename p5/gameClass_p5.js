class Game{ 
	constructor(player) {
		this.player = player;
		this.mapLoaded = "mapInitial";
		this.ts = 40;  //tile size
		this.currentLevel=0;   
		this.levels=[
			//   0        1         2         3         4
			//   1234567890123456789012345678901234567890
			[  
				"                    2                   ",    //1
				"                    1                   ",    //2
				"    8  8            1                  7",    //3
				"   222222  22  2    1          8  8  222",    //4
				"2               2  21         2222222   ",    //5 
				"                1   1      22           ",    //6
				" 2              12  1                   ",    //7
				"   22           1  91    2              ",    //8
				"                1222111111              ",    //9
				"      22                    22          ",    //0
				"                                        ",    //1
				"   222                         22       ",    //2
				"                                        ",    //3
				"2                                  22   ",    //4
				" 222                            22      ",    //5 
				"                                       2",    //6
				"0     2                 m     2         ",    //7
				"    2   2    m    22          1      2  ",    //8
				"    18            11        221h 8 8    ",    //9
				"22L2122222LLLLLLLL11LLLLLLLL111222222222",    //0

			],
			[
			  "                 FFFfFFff  7 f               ",
			  "               444444444444444               ",
			  "     cCCCCd                                  ",
			  "fff                                          ",
			  "4444                                         ",
			  "33334                                        ",
			  "         m                                  h",
			  "                           cCCCCCCCCCCCCCCCCC",
			  "                cCCCCCCCCCd                  ",
			  "                                             ",
			  "           m                                 ",
			  "                                             ",
			  "     m                                       ",
			  "                                  8 8        ",
			  "CCd          8     cd    cd      cCCCd       ",
			  "    8  8   cCCCd             cd       cd    f",
			  "   cCCCCd                                  F2",
			  "                                   2 F f   21",
			  "                           8f      12222     ",
			  "                          222           2    ",
			  "                        8 111               h",
			  " 0              F      222111              22",
			  "F f  fF    8f   22    f1111              F 11", 
			  "2222222   222        221111       m      2211", 
			  "1111111              1119                1111", 
			  "1111111LLLLLLLLLLLLLL11122222LLLLLLLLLLLL1111"
			
			],
			
			[
			//   0        1         2         3         4
			//   1234567890123456789012345678901234567890
				"                              ", //25
				"                            7 ",
				"                          cCCC",
				"                   cCCCd      ",
				"                              ",
				"          cCCCCCd             ", //20
				"                              ",
				"     m                        ",
				" h                            ",
				"444                           ",
				"   3                          ",
				"        m                     ",
				"           F        b b b b b ",
				"          44        bgbgbgbgbg",
				"               4    b b b b b ",
				"               2wwwwBBBBBBBBBB", //10
				"0             4133343434443443",
				" f  F      83               92",
				"443334   433                f1",
				"        4         f8  8   3441",
				"                  443343     2",
				"      3                      1",
				"       4     m               1",
				"h  88   fF                   2",
				"4334433343LLLLLLLLLLLLLLLLLLL1"
			],

			[   "                      7 ",
				"h   cCCCd  cCd   cCCCCCC",   //2, 3 leaves.  1, 4 rocks
				"3                       ",
				"                        ",
				"   m                    ",
				"                        ",
				"     m                  ",
				"                        ",
				"2   3   2     2  32     ",
				"4            2 88  3    ",
				"1         233122332423  ",
				"4    2   2             2",
				"1  2     1 9          2 ",
				"1  1    212223  28238   ",
				"1 31    4 0      2  2332",
				"4  48 821               ",
				"12 12321423322233222    ",
				"   1                    ",
				"  2             2 3  2  ",
				"      8        8 8 8 8  ",
				"232233222LLL223322322232"
			],
			[
				"1"
			]
		];
		this.levelW = 0;
		this.levelH = 0;
		this.objectHandler = new ObjectHandler(150, this.levelW, this.levelH, this.player);
	}

	renderArr(arrToRender){  //probably: move this to a global function and pass player object from game
		for(var i=0; i<arrToRender.length; i++){
			if (onScreen(arrToRender[i], this.player)){
				arrToRender[i].draw(this.player); //some objects need player info 
			}
			//call the update method if the object has one
			if (onScreen(arrToRender[i], this.player) && arrToRender[i] !== this.player && typeof arrToRender[i].update === "function" ){
				arrToRender[i].update(this.player);
				//console.log(typeof arrToRender[i].update);
			}       
		}
	}
	camera(){   
		//horizontal constrain
		this.player.P.x= constrain(this.player.P.x, 0, this.levelW-this.player.w);  
		
		//camera
		if(this.player.P.x + this.player.w/2 > width/2){
			translate((width/2-(this.player.P.x + this.player.w/2)), 0);
		}
		if(this.levelW - (this.player.P.x + this.player.w/2) < width/2){
			translate(width/2-(this.levelW - this.player.P.x - this.player.w/2), 0);
		}
		
		translate(0, height/2-(this.player.P.y + this.player.h/2));
		
		if(this.levelH - (this.player.P.y+this.player.h/2) < height/2){
		   translate(0, height/2-(this.levelH - this.player.P.y - this.player.h/2));
		}

		//move player fall death somewhere better, stats?
		if(this.player.P.y > this.levelH + height){
			this.player.health=0;
		}
	}

	bgManager(){  //BG_Object
		if(this.currentLevel===0){ 
			this.objectHandler.season("winter");
			
		}
		else if(this.currentLevel===1){ 
			this.objectHandler.season("spring");
		}
		else if(this.currentLevel===2){ 
			this.objectHandler.season("summer");
		}
		else if(this.currentLevel===3){ 
			this.objectHandler.season("fall");
		} 
	}
	
	fgManager(){  
		if(this.currentLevel===0){ 
			this.objectHandler.add("snow"); 
				for(var i=0; i< this.objectHandler.fgSnow.length; i++){
					this.objectHandler.fgSnow[i].update();
					this.objectHandler.fgSnow[i].draw();
				}
		}
		if(this.currentLevel===1 && this.player.P.y > 300){
		for(var i=0; i< this.objectHandler.fgRain.length; i++){
				this.objectHandler.fgRain[i].update();
				this.objectHandler.fgRain[i].draw();
			}
		}
		if(this.currentLevel===2){ 
		}
		if(this.currentLevel===3){ 
			this.objectHandler.add("leaves");  
				for(var i=0; i< this.objectHandler.fgLeaves.length; i++){
					this.objectHandler.fgLeaves[i].update();
					this.objectHandler.fgLeaves[i].draw();
				}
		}
	}
	
	levelKey0(S){
		for(var col=0; col<this.levels[this.currentLevel].length; col++){
			for(var row=0; row<this.levels[this.currentLevel][col].length; row++){
				var s=this.levels[this.currentLevel][col][row];  //character in game.levels array
				if(s==="0"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				//unique to specific level
				else if(s==="1"){
					blocks.push(new Block(row*S,col*S,S,S,imgIce1)); //ice
				}
				else if(s==="2"){
					blocks.push(new Block(row*S,col*S,S,S,imgS1)); //ice w snow
				}
				
				else {this.levelKeyAll(s, S, col, row);} 						
			}
		}
	}
	levelKey1(S){
		for(var col=0; col<this.levels[this.currentLevel].length; col++){
			for(var row=0; row<this.levels[this.currentLevel][col].length; row++){
				var s=this.levels[this.currentLevel][col][row];  
				if(s==="0"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				else if(s==="1"){
					blocks.push(new Block(row*S,col*S,S,S,imgD1)); //dirt 
				}
				else if(s==="2"){
					blocks.push(new Block(row*S,col*S,S,S,imgG1)); //dirt w grass
				}
				else if(s==="3"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR3)); //rocks
				}	
				else if(s==="4"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR2)); //rocks w grass
				}	
				else {this.levelKeyAll(s, S, col, row);}  		
			}
		}	
	}
	levelKey2(S){
		for(var col=0; col<this.levels[this.currentLevel].length; col++){
			for(var row=0; row<this.levels[this.currentLevel][col].length; row++){
				var s=this.levels[this.currentLevel][col][row];  
				if(s==="0"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				else if(s==="3"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR1)); //rocks w grass
				}
				else if(s==="4"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR2)); //rocks w grass2
				}	
				else if(s==="1"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR3)); //rocks1
				}
				else if(s==="2"){  
					blocks.push(new Block(row*S,col*S,S,S,imgR4)); //rocks2
				}
				
				else {this.levelKeyAll(s, S, col, row);}   
			}
		}			
	}
	levelKey3(S){
		for(var col=0; col<this.levels[this.currentLevel].length; col++){
			for(var row=0; row<this.levels[this.currentLevel][col].length; row++){
				var s=this.levels[this.currentLevel][col][row];  //array character
				if(s==="0"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				else if(s==="1"){
					blocks.push(new Block(row*S,col*S,S,S,imgR3)); //rock3 
				}
				else if(s==="2"){
					blocks.push(new Block(row*S,col*S,S,S,imgL1)); // rock w leaves
				}
				else if(s==="3"){
				blocks.push(new Block(row*S,col*S,S,S,imgL2)); //rock w leaves 2 
				}
				else if(s==="4"){
					blocks.push(new Block(row*S,col*S,S,S,imgR4)); // rock4
				}
				
				else {this.levelKeyAll(s, S, col, row);}  
			}
		}					
	}
	levelKeyAll(s, S, col, row){
		if(s==="m"){
			blocks.push(new Block(row*S,col*S,3/2*S,S/3,"mover"));
		}
		else if (s==="C"){
			blocks.push(new Block(row*S,col*S,S,S,imgClMid));
		}
		else if (s==="c"){
			blocks.push(new Block(row*S,col*S,S,S,imgClSide));
		}
		else if (s==="d"){
			blocks.push(new Block(row*S,col*S,S,S,imgClSide, "H"));
		}
		else if(s==="8"){
			spikes.push(new Spike(row*S+(S-S/1.75)/2.0, col*S-1.25*S, S/1.75, 2.25*S));
		}
		else if(s==="L"){  
			lava.push(new Lava(row*S,col*S+S/5,S,S-S/5, "l"));
		}
		else if(s==="h"){
			hearts.push(new Heart(row*S+S/4,col*S+S/4,S/2,S/2));
		}
		else if(s==="7"){
			portals.push(new Portal(row*S,col*S,S,S));
		}
		else if(s==="9"){
			portkeys.push(new Portkey (row*S,col*S,S,S));
		}
		
		//decorative images.  level app when needed
		else if(s==="f"){
			decoImages.push(new Deco(row*S,col*S,S,S, "flower"));
		}
		else if(s==="F"){
			decoImages.push(new Deco(row*S,col*S,S,S, "flower2"));
		}
						 
		else if(s==="g"){
			decoImages.push(new Deco(row*S,col*S,S,S, "glass"));
		}
		else if(s==="w"){
			decoImages.push(new Deco(row*S,col*S,S,S, "water"));
		}
		else if(s==="b"){
			decoImages.push(new Deco(row*S,col*S,S,S, "wood"));
		}
		else if(s==="B"){
			decoImages.push(new Deco(row*S,col*S,S,S, "brick"));
			decoImages.push(new Deco(row*S,col*S,S,S, "water"));
		}
		else{ 
			if (s!==" "){
				console.log("unexpected char:" + " " + s);
			}
		}
	}
	getLevelMap(S){
		if (this.currentLevel===0){
			this.levelKey0(S);
		}
		else if (this.currentLevel===1){
			this.levelKey1(S);
		}
		else if (this.currentLevel===2){
			this.levelKey2(S);
		}
		else if (this.currentLevel===3){
			this.levelKey3(S);
		}
}
	
	loadMap(){
			//recalc level width and height for each level 
			this.levelW = this.levels[this.currentLevel][0].length*this.ts;
			this.levelH = this.levels[this.currentLevel].length*this.ts;
			var S = this.ts;  //map tile size
			//map according to level so that characters can be reused.
			this.getLevelMap(S);
			
			//add player to the decoImages array so that it can be sorted by z_Index
			decoImages.push(this.player); 
			sortArrByProperty(decoImages, "z_Index");
			//all map tiles  CHANGE TO CONCAT, change double loops 
			this.mapTiles = [lava, blocks, portals, spikes, portkeys, hearts, decoImages];
			//reload objectH w level sizes and player info
			this.objectHandler = new ObjectHandler(150, this.levelW, this.levelH, this.player);
			this.mapLoaded = "mapLoaded";	
	}
	removeMap(arr){
		for(var i=0; i<arr.length; i++){
			for(var j=0; j<arr[i].length; j++){
				arr[i].splice(j,arr[i].length);
			}
		}
		this.mapLoaded = "mapRemoved";
	}
	clickRestart(){
		
        if(buttonClicked(width/2-50,height/2-15,100,30,"Click to restart",10)){
            this.removeMap(this.mapTiles);
            this.player.health = 3;
            this.loadMap();
            state="inGame";
            transparency=0;
            fadeColor=color(255, 255, 255,transparency);
        }else{
            noStroke();
            fill(255, 0, 0,1);
            rect(0,0,width,height);
            fill(255, 255, 255);
            textSize(50);
            textAlign(CENTER,CENTER);
            text("You Died!",width/2,1/3*height);
        }
	}
	runGame(){
		this.bgManager(); //background effects
		this.camera();

		//draw and update objects of map (2D array)
		for (var i=0; i<this.mapTiles.length; i++){
			this.renderArr(this.mapTiles[i]); 
		}
		//player is drawn along with deco images for z_indexing
		this.player.update(blocks);
		this.player.stats();
		this.fgManager();  //forground effects
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
		rect(0,0,width,height);
		
		if(this.currentLevel===4){
			state="win";
		}	
	}
}