class Game{ 
	constructor() {  
		this.ts = 40;  //tile size
		this.player = (new Player(0,0,0.7*this.ts,0.7*this.ts)); 
		this.gameState = "gameStart";  
		this.currentLevel=0;
		this.levels=[
			//test 072119
			[   "                                                                                                                        ",
				"0h                                       		                                                                         ",
				"0C 0d                                                                                                                   ",
				"                                                                                                                        ",
				"         0c 0C 0C 0C 0C 0C 0d                                                                                           ",
				"                                                                                                                        ",
				"0C 0d                                                                                                                   ",  
				"                                                            02                                                          ",
				"                  0m                                        01                                                          ",    
				"            08       08                                     01                                                          ",     
				"         02 02 02 02 02 02       02 02       02             01                                             08  08    07 ",    
				"02                                              02       02 01                            02 02 02 02 02 02 02 02 02 02 ",    
				"                                                01          01                   02 02                                  ",    
				"   02                                           01 02       01                                                          ",    
				"         02 02                                  01       09 01             02                                           ",    
				"                                                01 02 02 02 01 02 02 02 02 01                                           ",    
				"                  02 02                                                             02 02                               ",    
				"                                                                                                                        ",    
				"         02 02 02                                                                            02 02                      ",    
				"                                                                                                                        ",    
				"02                                                                                                       02 02          ",    
				"   02 02 02                                                                                     02 02                   ",    
				"                                                                                                                     02 ",    
				"00                02                                                    0m                02                            ",    
				"            02          02             0m             02 02                               01                   02       ",    
				"            01 08                                     01 01                         02 02 01 0h    08    08             ",    
				"02 02 0L 02 01 02 02 02 02 02 0L 0L 0L 0L 0L 0L 0L 0L 01 01 0L 0L 0L 0L 0L 0L 0L 0L 01 01 01 02 02 02 02 02 02 02 02 02 "    
			],
		

				//03 rocks  04 rocks w grass
			[ 	//05 dirt   06 dirt w grass
				"                                                   0F 0F 0F 0f 0F 0F 0f 0f       07    0f                                              ",  
				"                                             04 04 04 04 04 04 04 04 04 04 04 04 04 04 04                                              ",  
				"                     0c 0C 0C 0C 0d                                                                                                    ",
				"0f 0f 0f                                                                                                                               ",
				"04 04 04 04                                                                                                                            ",
				"03 03 03 03 04                                                                                                                      0h ",
				"                           0m                                                    0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C ",
				"                                       0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0d                                                    ",
				"                                                                                                                                       ",
				"                           0m                                                                                                          ",
				"                                                                                                                                       ",
				"               0m                                                                                                                      ",
				"                                                                                                      08    08                         ",
				"0C 0C 0d                               08                0c 0d             0c 0d                   0c 0C 0C 0C 0d                      ",
				"            08       08          0c 0C 0C 0C 0d                                        0c 0d                      0c 0d             0f ",
				"         0c 0C 0C 0C 0C 0d                                                                                                          06 ",
				"                                                                                                                     0F    0f          ",
				"                                                                                 08 0f                            06 06 06 06          ",
				"                                                                              06 06 06                                              0h ",
				"                                                                        08    05 05 05                                              06 ",
				"                                                0F                   06 06 06 05 05 05                                           06 05 ",
				"0F    0f 00 0f 0F                08 0f          06 06             0f 05 05 05 05                                           0F    05 05 ", 
				"06 06 06 06 06 06 06          06 06 06                         06 06 05 05 05 05                      0m                   06 06 05 05 ", 
				"05 05 05 05 05 05 05                                           05 05 05 09                                                 05 05 05 05 ", 
				"05 05 05 05 05 05 05 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 06 06 06 06 06 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 05 "
			],
			
			[	//03 10 rocks 04 11 rocks w grass
				"                                                                                          ",  
				"                                                                                       07 ",
				"                                                                              0c 0C 0C 0C ",
				"                                                         0c 0C 0C 0C 0d                   ",
				"                                                                                          ",
				"                              0c 0C 0C 0C 0C 0C 0d                                        ", 
				"                                                                                          ",
				"            0m                                                                            ",
				"   0h                                                                                     ",
				"04 04 04                                                                                  ",
				"         11                                                                               ",
				"                        0m                                                                ",
				"                                 0F                         0e 0E 0e 0E 0e 0E 0e 0E 0e 0E ",
				"                              04 04                         0e 0g 0e 0g 0e 0g 0e 0g 0e 0g ",
				"                                             04             0e 0E 0e 0E 0e 0E 0e 0E 0e 0E ",
				"                                             10 0w 0w 0w 0w 0B 0B 0B 0B 0B 0B 0B 0B 0B 0B ", 
				"00                                        04 03 11 11 11 04 11 04 11 04 04 04 11 04 04 11 ",
				"   0f       0F                   08 11                                              09 10 ",
				"04 04 11 11 11 04          04 11 11                                                 0f 03 ",
				"                        04                            0f 08       08          11 04 04 03 ",
				"                                                      04 04 11 11 04 11                10 ",
				"                  11                                                                   03 ",
				"                     04                0m                                              03 ",
				"0h       08 08          0f 0F                                                          10 ",
				"04 11 11 04 04 11 11 11 04 11 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 03 "
			],

			[   //12, 13 leaves.  05, 14 dirt
				"                                                                        ",
				"                                                                        ",
				"                                                                     07 ",
				"0h          0c 0C 0C 0C 0d       0c 0C 0d          0c 0C 0C 0C 0C 0C 0C ",
				"13                                                                      ",
				"                                                                        ",
				"            0m                                                          ",
				"                                                                        ",
				"12          13          12                12       13 12                ",
				"14                                     12    08 08       13             ",
				"05                            12 13 13 05 12 12 13 13 12 14 12 13       ",
				"14             12          12                                        12 ",
				"05       12                05    09                               12    ",
				"05       05             12 05 12 12 12 13       12 08 12 13 08          ",
				"05    13 05             14    00                   12       12 13 13 12 ",
				"14       14 08    08 12 05                                              ",
				"05 12    05 12 13 12 05 14 12 13 13 12 12 12 13 13 12 12 12             ",
				"         05                                                             ",
				"      12                                        12    13    12          ",
				"                  08                         08    08    08    08       ",
				"12 13 12 12 13 13 12 12 12 0L 0L 0L 12 12 13 13 12 12 13 12 12 12 13 12 "
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
		//Xtranslate
		if(playCX > bordL && playCX < bordR){    
			translate(-(playCX-bordL), 0);  
		}						   
		else if(playCX >= bordR){   
			translate(-(this.levelW-width), 0);  
		}
		//Ytranslate. no top limit
		if (playCY < bordB){
		    translate(0, -(playCY-bordT)); 
		}
		else if(playCY >= bordB){   
			translate(0, -(this.levelH-height));  
		}
		//check if player has fallen.  convenient here because it needs lvH.  move later maybe.
		if(this.player.P.y > this.levelH + height){
			this.player.health=0;
		}
	}
	//072119.  change to a switch eventually
	levelKey(){   
		var S = this.ts;  //map tile size											
		for(var col=0; col<this.levels[this.currentLevel].length; col++){ //#strings in lv map. ie tilesY
			for(var row=0; row<this.levels[this.currentLevel][col].length/3; row++){ //length string/3. ie tilesX
				var s = this.levels[this.currentLevel][col][3*row] + this.levels[this.currentLevel][col][3*row+1];  //2char string in game.levels 
				
				if(s==="00"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				else if(s==="01"){  //ice
					blocks.push(new Block(row*S,col*S,S,S,imgIce1)); 
				}
				else if(s==="02"){  //ice w snow
					blocks.push(new Block(row*S,col*S,S,S,imgS1)); 
				}
				else if(s==="03"){  //ROCKS
					blocks.push(new Block(row*S,col*S,S,S,imgR3)); 
				}
				else if(s==="04"){  //rocks w grass
					blocks.push(new Block(row*S,col*S,S,S,imgR1)); 
				}
				else if(s==="05"){  //DIRT 
					blocks.push(new Block(row*S,col*S,S,S,imgD1)); 
				}
				else if(s==="06"){  //dirt w grass
					blocks.push(new Block(row*S,col*S,S,S,imgG1)); 
				}
				else if(s==="10"){  //rocks2 
					blocks.push(new Block(row*S,col*S,S,S,imgR4)); 
				}
				else if(s==="11"){  //rocks w grass2
					blocks.push(new Block(row*S,col*S,S,S,imgR2)); 
				}
				else if(s==="12"){  //dirt w leaves1 
					blocks.push(new Block(row*S,col*S,S,S,imgL1)); 
				}
				else if(s==="13"){  //dirt w leaves2
					blocks.push(new Block(row*S,col*S,S,S,imgL2)); 
				}
				else if(s==="14"){  //dirt2
					blocks.push(new Block(row*S,col*S,S,S,imgD2)); 
				}
				else if(s==="0m"){  //moving platform
					blocks.push(new Block(row*S,col*S,3/2*S,S/3,"mover"));
				}
				else if (s==="0C"){  //cloud middle
					blocks.push(new Block(row*S,col*S,S,S,imgClMid));  
				}
				else if (s==="0c"){  //cloud left side
					blocks.push(new Block(row*S,col*S,S,S,imgClSide));  
				}
				else if (s==="0d"){  //cloud left side w/H flip to right
					blocks.push(new Block(row*S,col*S,S,S,imgClSide, "H")); 
				}
				
				else if(s==="08"){
					spikes.push(new Spike(row*S+(S-S/1.75)/2.0, col*S-1.25*S, S/1.75, 2.25*S));
				}
				else if(s==="0L"){  
					lava.push(new Lava(row*S,col*S+S/5,S,S-S/5, "l"));
				}
				else if(s==="0h"){
					hearts.push(new Heart(row*S+S/4,col*S+S/4,S/2,S/2));
				}
				else if(s==="07"){
					portals.push(new Portal(row*S,col*S,S,S));
				}
				else if(s==="09"){
					portkeys.push(new Portkey (row*S,col*S,S,S));
				}

				//decorative.  player is ind2
				else if(s==="0f"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgFlower, 3));
				}
				else if(s==="0F"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgFlower2, 3));
				}
				else if(s==="0g"){
					decoImages.push(new Glass(row*S,col*S,S,S, "glass", 1));
				}
				else if(s==="0w"){
					decoImages.push(new Water(row*S,col*S,S,S, "water", 3));
				}
				else if(s==="0e"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgWood1, 0));
				}
				else if(s==="0E"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgWood2, 0));
				}
				else if(s==="0B"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgBrick, 0));
					decoImages.push(new Water(row*S,col*S,S,S, "water", 3));
				}
			}
		}
	}
	
	loadMap(){
		//recalc level width and height for each level since they aren't all the same.
		this.levelW = this.levels[this.currentLevel][0].length/3*this.ts;
		this.levelH = this.levels[this.currentLevel].length*this.ts;
		this.levelKey();
			
		//add player to decoImages array and sort by z_Index property to change draw order
		decoImages.push(this.player); 
		sortArrByProperty(decoImages, "z_Index");
			
		//all map tiles. change to concat.  change double loops for iteration and splicing.
		this.mapTiles = [lava, blocks, decoImages, spikes, portkeys, hearts, portals];
		//rewrite objectH w level sizes and player info
		this.objectHandler = new ObjectHandler(this.levelW, this.levelH, this.player);
			if (this.currentLevel < this.objectHandler.sScape.length){ 
				this.objectHandler.sScape[this.currentLevel].loop(); 
			}	
		this.gameState = "inGame"; //this.mapLoaded = "mapLoaded";		
	}
	
	removeMap(arr){
		for (var i = arr.length-1; i>=0; i--){
			arr[i].splice(0, arr[i].length); //splice is shallow I think
		}
		arr.splice(0, arr.length);		
		//this.mapLoaded = "mapRemoved";
		
	}
	clickToRestart(){
		this.removeMap(this.mapTiles);
		
        if(buttonClicked(width/2-50,height/2-15,100,30,"Click to restart",10)){
            
            this.player.health = 3;
            this.loadMap();
            this.gameState = "inGame";  //state="inGame";
			
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
		this.objectHandler.bgEffects(this.currentLevel); //background effects.  don't trans with camera
		this.camera();
		
		//draw and update objects of map 
		for (var i=0; i<this.mapTiles.length; i++){
			this.renderArr(this.mapTiles[i]); 
		}
		//player is updated here rather than above
		this.player.update(blocks);
		
		
		
		resetMatrix();
		this.player.stats(); //health, info
		if(this.player.health<=0){
			this.gameState="dead";
		}
		
		this.objectHandler.fgEffects(this.currentLevel); //forground effects
		
		
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
		fill(fadeColor);
		rect(0,0,width,height);
		
		if(this.currentLevel===4){
			this.gameState="win";
		}	
	}
}