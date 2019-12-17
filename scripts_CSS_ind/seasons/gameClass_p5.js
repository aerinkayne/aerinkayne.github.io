class Game{ 
	constructor() {  
		this.ts = 40;  //tile size
		this.player = (new Player(0,0,0.7*this.ts,0.7*this.ts)); 
		this.gameState = "levelSelect"; 
		this.paused = false;
		this.currentLevel=0;  //default if none selected
		this.levelW;  //defined at lv load
		this.levelH;
		this.bordL = width/2; 
		this.bordR; 
		this.bordT = height/2; 
		this.bordB;
		this.levels=[
			[   "                                                                                                                        ",
				"0h                                       		                                                                         ",
				"0C 0d                                                                                                                   ",
				"                                                                                                                        ",
				"         0c 0C 0C 0C 0C 0C 0d                                                                                           ",
				"                                                                                                                        ",
				"0C 0d                                                                                                                   ",  
				"                                                            02                                                          ",
				"               0m                                           01                                                          ",    
				"            0^       0^                                     01                                                          ",     
				"         02 02 02 02 02 02       02 02       02             01                                     0^    0^       07    ",    
				"02                                              02       02 01                            02 02 02 02 02 02 02 02 02 02 ",    
				"                                                01       0v 01                   02 02                                  ",    
				"   02                                           01 02       01                                                          ",    
				"         02 02                                  01       09 01             02                                           ",    
				"                                                01 02 02 02 01 02 02 02 02 01                                           ",    
				"                  02 02                                                             02 02                               ",    
				"                                                                                                                        ",    
				"         02 02 02                                                                            02 02                      ",    
				"                                                                                                                        ",    
				"02                                                                                                       02 02          ",    
				"   02 02 02                                                                                     02 02                   ",    
				"   0v                                                                                                                02 ",    
				"00                02                                                    0m                02                            ",    
				"            02          02             0m             02 02                               01                   02       ",    
				"            01 0^                                     01 01                         02 02 01 0h    0^    0^             ",    
				"02 02 0L 02 01 02 02 02 02 02 0L 0L 0L 0L 0L 0L 0L 0L 01 01 0L 0L 0L 0L 0L 0L 0L 0L 01 01 01 02 02 02 02 02 02 02 02 02 "    
			],
		
			[ 	//03 rocks  04 rocks w grass   05 dirt   06 dirt w grass
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
				"                                                                                                      0^    0^                         ",
				"0C 0C 0d                               0^                0c 0d             0c 0d                   0c 0C 0C 0C 0d                      ",
				"            0^       0^          0c 0C 0C 0C 0d                                        0c 0d                      0c 0d             0f ",
				"         0c 0C 0C 0C 0C 0d                                                                                                          06 ",
				"                                                                                                                     0F    0f          ",
				"                                                                                 0^ 0f                            06 06 06 06          ",
				"                                                                              06 06 06                                              0h ",
				"                                                                        0^    05 05 05                                              06 ",
				"                                                0F                   06 06 06 05 05 05                                           06 05 ",
				"0F    0f 00 0f 0F                0^ 0f          06 06             0f 05 05 05 05                                           0F    05 05 ", 
				"06 06 06 06 06 06 06          06 06 06                         06 06 05 05 05 05                      0m                   06 06 05 05 ", 
				"05 05 05 05 05 05 05                                           05 05 05 09                                                 05 05 05 05 ", 
				"05 05 05 05 05 05 05 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 06 06 06 06 06 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 05 "
			],
			
			[	//03 10 rocks   04 11 rocks w grass
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
				"   0f       0F                   0^ 11                                        0v          ",
				"04 04 11 11 11 04          04 11 11                                                    09 ",
				"                        04                            0f 0^       0^                0f 11 ",
				"                                                      04 04 11 11 04 11       11 04 04 10 ",
				"                  11                                                                   03 ",
				"                     04                0m                                              03 ",
				"0h       0^ 0^          0f 0F                                                          10 ",
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
				"0p                                                                      ",
				"12          13          12                12       13 12                ",
				"14                               0p    12    0^ 0^       13             ",
				"05                            12 13 13 05 12 12 13 13 12 dF 12 13       ",
				"14             12          12                                        12 ",
				"dF       12                05    09                               12    ",
				"05       05             12 05 12 12 12 13       12 0^ 12 13 0^          ",
				"05    13 05             14    00                   12       12 13 13 12 ",
				"14       14 0^    0^ 12 05          0p                                  ",
				"05 12    05 12 13 12 05 14 12 13 13 12 12 12 13 13 12 12 12             ",
				"         05                                                             ",
				"      12                                        12    13    12          ",
				"                  0^                         0^    0^    0^    0^    0p ",
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
	manageScenes(){ //call on mouseclick.  buttons are currently global objects. 
		if (this.gameState === "levelSelect"){
			for (var i = 0; i < btnLevels.length; i++){
				if (btnLevels[i].isOver(mouseX,mouseY)){
					btnLevels[i].selected = true;
					btnLevels[i].boarderC = 255;
					this.setLevel(btnLevels[i].LV); 
				}
				else {
					btnLevels[i].boarderC = 0;
					btnLevels[i].selected = false;
				}
			}
		}
		//load chosen lv map
		if (this.gameState === "levelSelect" && btnStart.isOver(mouseX,mouseY)){
			this.gameState = "gameStart";
		}
		//toggle pause
		if (this.gameState === "inGame" && btnPause.isOver(mouseX,mouseY) && !this.paused){
			this.paused = true;
		}
		else if (this.gameState === "inGame" && btnPause.isOver(mouseX,mouseY) && this.paused){
			this.paused = false;
		}

		//continue and restart options 
		if (this.gameState === "gameOver" && btnContinue.isOver(mouseX,mouseY)){
			this.clickToContinue();
		}
		if (this.gameState === "gameOver" && btnRestart.isOver(mouseX,mouseY)){
			this.removeMap(this.mapTiles); 
			transparency=0;
			canvasOverlay=color(255, 255, 255,transparency);
			game = new Game();
		}
	}
	camera(){   
		//horizontal constrain
		this.player.P.x = constrain(this.player.P.x, 0, this.levelW-this.player.w);  
		//camera
		let playCX = this.player.P.x + this.player.w/2;
		let playCY = this.player.P.y + this.player.h/2;
		//Xtranslate
		if(playCX > this.bordL && playCX < this.bordR){    
			translate(-(playCX-this.bordL), 0);  
		}						   
		else if(playCX >= this.bordR){   
			translate(-(this.levelW-width), 0);  
		}
		//Ytranslate. no top limit
		if (playCY < this.bordB){
		    translate(0, -(playCY-this.bordT)); 
		}
		else if(playCY >= this.bordB){   
			translate(0, -(this.levelH-height));  
		}
		//check if player has fallen.  convenient here because it needs lvH.  move later maybe.
		if(this.player.P.y > this.levelH + height){
			this.player.health=0;
		}
	}
	levelKey(){   
		var S = this.ts;  //map tile size											
		for(var col=0; col<this.levels[this.currentLevel].length; col++){ //#strings in lv map. ie tilesY
			for(var row=0; row<this.levels[this.currentLevel][col].length/3; row++){ //length string/3. ie tilesX
				var s = this.levels[this.currentLevel][col][3*row] + this.levels[this.currentLevel][col][3*row+1];  //2char string in game.levels 
				
				if(s==="00"){
					this.player.P.x = row*S;
					this.player.P.y = col*S;
				}
				//blocks array contains map tiles passed to player.update because they affect player position
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
					blocks.push(new Mover(row*S,col*S,3/2*S,S/3,"mover")); //
				}
				else if (s==="0C"){  //cloud middle
					blocks.push(new Block(row*S,col*S,S,S,imgClM));  
				}
				else if (s==="0c"){  //cloud left side
					blocks.push(new Block(row*S,col*S,S,S,imgClL));  
				}
				else if (s==="0d"){  //cloud left side w/H flip
					blocks.push(new Block(row*S,col*S,S,S,imgClR)); 
				}
				
				//collidables do not affect position but are used for other updates (health, dmg, inventory)  
				else if(s==="0^"){
					spikes.push(new SpikeU(row*S+(S-S/1.75)/2.0, col*S-1.5*S, S/1.75, 2.5*S));
				}
				else if(s==="0v"){
					spikes.push(new SpikeD(row*S+(S-S/1.75)/2.0, col*S, S/1.75, 2.5*S));
				}
				else if(s==="0L"){  
					lava.push(new Lava(row*S,col*S+S/5,S,S-S/5, "l"));
				}
				else if(s==="0h"){
					hearts.push(new Heart(row*S+S/4,col*S+S/4,S/2,S/2, imgHeart));
				}
				else if(s==="07"){
					portals.push(new Portal(row*S, col*S, S, S, imgPortal));
				}
				else if(s==="09"){
					portkeys.push(new Portkey (row*S, col*S, S, S, imgKey));
				}

				//decorative images.  player is ind2
				else if(s==="0f"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgFlower, 3));
				}
				else if(s==="0F"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgFlower2, 3));
				}
				else if(s==="0p"){
					decoImages.push(new Deco(row*S,col*S,S,S, imgPumpk, 3));
				}
				else if(s==="dF"){  //dirt2 with fossil
					blocks.push(new Block(row*S,col*S,S,S,imgD2)); 
					decoImages.push(new Deco(row*S,col*S,S,S,imgFossil)); 
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
	//screens 
	screenLvSelect(){
		background(200,210,225);
		textSize(height/21);
		fill(0);
		text("Select a level and press the start button to begin.",width/10,height/12);
		btnWint.draw();
		btnSpr.draw();
		btnSum.draw();
		btnFall.draw();
		btnStart.draw();
	}
	screenInGame(){
		if (!this.paused){
			this.effectsHandler.bgEffects(this.currentLevel); //background effects.  don't translate with camera
			this.camera();
			
			//draw and update objects of map 
			for (var i=0; i<this.mapTiles.length; i++){
				this.renderArr(this.mapTiles[i]); 
			}
			//player is updated here rather than above
			this.player.update(blocks);

			if(this.player.health<=0){
				this.gameState="gameOver";
			}

			//incr level if portal.collected. always 1 portal per lv.
			if(portals[0].collected){
				transparency=0;
				canvasOverlay=color(255, 255, 255, transparency);
				this.effectsHandler.sScape[this.currentLevel].stop();
				this.removeMap(this.mapTiles);
					
				this.currentLevel++; 
				this.loadMap(); 
				this.player.gotKey=false;
			} 
	
			if(this.currentLevel===4){ //todo: not like this.
				this.gameState="win";
			}
		
			//HUD, foreground and overlay effects
			resetMatrix();
			this.player.stats(); //health, info
			btnPause.draw();
			this.effectsHandler.fgEffects(this.currentLevel); //forground effects
			fill(canvasOverlay);
			rect(0,0,width,height);
		}
	}
	screenGameOver(){
		noStroke();
		fill(200, 0, 0,1);
		rect(0,0,width,height);
		fill(255, 255, 255,175);
		textSize(width/12);
		textAlign(CENTER,CENTER);
		text("You have died!",width/2,1/3*height);
		btnRestart.draw();
		btnContinue.draw();
	}
	
	setLevel(n){
		this.currentLevel = n;
	}
	loadMap(){  //load map, then set state to inGame
		this.getLevelVals();	//width, height of levels vary
		this.levelKey();  		//get map tiles 
			
		//add player to decoImages array and sort by z_Index property to change draw order
		decoImages.push(this.player); 
		sortArrByProperty(decoImages, "z_Index");
			
		//all map tiles. TODO concat and change double loops for iteration and splicing?
		this.mapTiles = [lava, spikes, blocks, decoImages, portkeys, hearts, portals];
		//use level W, H and player info for effects
		this.effectsHandler = new EffectsHandler(this.levelW, this.levelH, this.player);
			if (this.currentLevel < this.effectsHandler.sScape.length){ 
				this.effectsHandler.sScape[this.currentLevel].loop(); 
			}	
		this.gameState = "inGame"; 
	}
	getLevelVals(){
		//recalc level width and height for each level since they aren't all the same.
		this.levelW = this.levels[this.currentLevel][0].length/3*this.ts;
		this.levelH = this.levels[this.currentLevel].length*this.ts;
		this.bordR = this.levelW - width/2;
		this.bordB = this.levelH - height/2;
	}
	removeMap(arr){
		for (var i = arr.length-1; i>=0; i--){
			arr[i].splice(0, arr[i].length); //splice is shallow
		}
		arr.splice(0, arr.length);		
	}
	
	clickToContinue(){
		this.removeMap(this.mapTiles);  
		this.player.health = 3;
		this.loadMap(); //reload map for current level
		this.gameState = "inGame";  //restore state to inGame
		
		transparency=0;
		canvasOverlay=color(255, 255, 255,transparency);
	}
	

}