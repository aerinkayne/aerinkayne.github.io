class Game{ 
	constructor(player) {
		this.player = player;
		this.mapLoaded = "mapInitial";
		this.ts = 40;  //tile size
		this.currentLevel=0;
		this.levels=[

			[   "                                        ",
				"h                                       ",
				"Cd                                      ",
				"                                        ",
				"    cCCCCCd                             ",
				"                                        ",
				"Cd                                      ",  
				"                    2                   ",
				"      m             1                   ",    
				"    8  8            1                   ",    
				"   222222  22  2    1          8  8    7",    
				"2               2  21         2222222222",    
				"                1   1      22           ",    
				" 2              12  1                   ",    
				"   22           1  91    2              ",    
				"                1222122221              ",    
				"      22                    22          ",    
				"                                        ",    
				"   222                         22       ",    
				"                                        ",    
				"2                                  22   ",    
				" 222                            22      ",    
				"                                       2",    
				"0     2                 m     2         ",    
				"    2   2    m    22          1      2  ",    
				"    18            11        221h 8 8    ",    
				"22L2122222LLLLLLLL11LLLLLLLL111222222222"    
			],
			
			[ 
				"                 FFFfFFff  7 f               ",
				"               444444444444444               ",
				"       cCCCd                                 ",
				"fff                                          ",
				"4444                                         ",
				"33334                                       h",
				"         m                 cCCCCCCCCCCCCCCCCC",
				"             cCCCCCCCCCCCCCd                 ",
				"                                             ",
				"         m                                   ",
				"                                             ",
				"     m                                       ",
				"                                  8 8        ",
				"CCd          8     cd    cd      cCCCd       ",
				"    8  8   cCCCd             cd       cd    f",
				"   cCCCCd                                   2",
				"                                       F f   ",
				"                           8f         2222   ",
				"                          222               h",
				"                        8 111               2",
				"                F      222111              21",
				"F f0 fF    8f   22    f1111              F 11", 
				"2222222   222        221111       m      2211", 
				"1111111              1119                1111", 
				"1111111LLLLLLLLLLLLLL11122222LLLLLLLLLLLL1111"
			],
			
			[
				"                              ", 
				"                            7 ",
				"                          cCCC",
				"                   cCCCd      ",
				"                              ",
				"          cCCCCCd             ", 
				"                              ",
				"     m                        ",
				" h                            ",
				"444                           ",
				"   3                          ",
				"        m                     ",
				"           F        b b b b b ",
				"          44        bgbgbgbgbg",
				"               4    b b b b b ",
				"               2wwwwBBBBBBBBBB", 
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

			[   "                        ",
				"                        ",
				"                      7 ",
				"h   cCCCd  cCd   cCCCCCC",   //2, 3 leaves.  1, 4 rocks
				"3                       ",
				"                        ",
				"    m                   ",
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
		}

	renderArr(arrToRender){ 
		for(var i=0; i<arrToRender.length; i++){
			if (onScreen(arrToRender[i], this.player, this.levelW, this.levelH)){
				arrToRender[i].draw(this.player); //some objects need player info 
			}
			//call update() if object has that method, but don't update the player here.  
			if (arrToRender[i] !== this.player && typeof arrToRender[i].update === "function" ){
				arrToRender[i].update(this.player);
			}       
		}
	}
	
	camera(){   
		//horizontal constrain
		this.player.P.x= constrain(this.player.P.x, 0, this.levelW-this.player.w);  
		
		//camera
		let playCX = this.player.P.x + this.player.w/2;
		let playCY = this.player.P.y + this.player.h/2;
		let bordL = width/2;
		let bordR = this.levelW - width/2;
		let bordT = height/2;
		let bordB = this.levelH - height/2;
	
		if(playCX > bordL){    
			translate(-(playCX-bordL), 0);  
		}
								   
		if(playCX > bordR){   
			translate(playCX-bordR, 0);  
		}
		//no top limit
		translate(0, -(playCY-bordT));    
		
		if(playCY > bordB){   
			translate(0, playCY-bordB);  
		}
		
		
		//move player fall death somewhere better, stats?
		if(this.player.P.y > this.levelH + height){
			this.player.health=0;
		}
	}

	bgManager(){  //BG object effects. move this to effectClass maybe heehee
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
		if(this.currentLevel===0 || this.currentLevel===2 || this.currentLevel===3){ 
			for(var i=0; i< this.objectHandler.fgObj.length; i++){
				this.objectHandler.fgObj[i].update();
				this.objectHandler.fgObj[i].draw();
			}
		}
		
		else if(this.currentLevel===1 && this.player.P.y > 300){
			for(var i=0; i< this.objectHandler.fgObj.length; i++){
				this.objectHandler.fgObj[i].update();
				this.objectHandler.fgObj[i].draw();
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
			//recalc level width and height for each level since they aren't all the same.
			this.levelW = this.levels[this.currentLevel][0].length*this.ts;
			this.levelH = this.levels[this.currentLevel].length*this.ts;
			var S = this.ts;  //map tile size
			//map according to level so that characters can be reused.
			this.getLevelMap(S);
			
			//add player to the decoImages array so that it can be sorted by z_Index
			decoImages.push(this.player); 
			sortArrByProperty(decoImages, "z_Index");
			
			//all map tiles  CHANGE TO CONCAT, change double loop splicing maybe 
			this.mapTiles = [lava, blocks, portals, spikes, portkeys, hearts, decoImages];
			//rewrite objectH w level sizes and player info
			this.objectHandler = new ObjectHandler(this.levelW, this.levelH, this.player);
			if (this.currentLevel < this.objectHandler.sScape.length){ 
				this.objectHandler.sScape[this.currentLevel].loop(); 
			}	
			this.mapLoaded = "mapLoaded";		
	}
	removeMap(arr){
		for (var i = arr.length-1; i>=0; i--){
			arr[i].splice(0, arr[i].length); //splice is shallow I think
		}
		arr.splice(0, arr.length);		
		this.mapLoaded = "mapRemoved";
		
	}
	clickToRestart(){
		this.removeMap(this.mapTiles);
		
        if(buttonClicked(width/2-50,height/2-15,100,30,"Click to restart",10)){
            
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
		
		//draw and update objects of map 
		for (var i=0; i<this.mapTiles.length; i++){
			this.renderArr(this.mapTiles[i]); 
		}
		//player is updated here but drawn along with deco images for z_indexing
		this.player.update(blocks);
		this.player.stats();
		this.fgManager();  //forground effects
		
		// manage level transitions.  always 1 portal per lv.
		if(portals[0].complete){
			transparency=0;
			fadeColor=color(255, 255, 255, transparency);
			this.objectHandler.sScape[this.currentLevel].stop();
			this.removeMap(this.mapTiles);
				
			this.currentLevel++; 
			this.loadMap(); 
			this.player.gotKey=false;
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
