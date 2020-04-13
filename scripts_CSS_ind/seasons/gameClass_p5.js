class Game{ 
	constructor() {  
		this.ts = 40;  //tile size 
		this.player = new Player(0,0,0.7*this.ts,0.7*this.ts);
		this.levelW;  //defined at lv load
		this.levelH;
		this.bordL = width/2; 
		this.bordR; 
		this.bordT = height/2; 
		this.bordB;
		this.mapTiles = [];
		this.onScreenTiles = [];
		this.collisionTiles = [];
		this.movingTiles = [];

		this.currentLevel = 0;  //default if none selected
		this.numLevels = 4;     
		this.levelData = levelData;
		this.paused = false;
		this.gameState = "levelSelect"; 
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
		//check if player has fallen.  convenient here because it needs lvH.  move later .
		if(this.player.P.y > this.levelH + height){
			this.player.health=0;
		}
	}
	setupMap(){   
		let S = this.ts;  	//map tile size	
		let L = 2; 			//map code string length
		let numR = this.levelData[this.currentLevel].levelMap.length;
		let numC = this.levelData[this.currentLevel].levelMap[0].length/3;  //2char string for map, plus space for legibility
		//set level dimensions
		this.levelW = numC*S;
		this.levelH = numR*S;
		this.bordR = this.levelW - width/2;
		this.bordB = this.levelH - height/2;

		//set map object types and positions		
		let s, x, y;
		let decoImages = [];
		let lava = [];
		let portkeys =[];
		let hearts = [];
		let spikes = [];
		let portals = [];
		

		for(let row = 0; row < numR; row++){ 		//#strings in lv map. (tiles P.y)
			for(let col = 0; col < numC; col++){ 	//length row's string (tiles P.x)
												
				s = this.levelData[this.currentLevel].levelMap[row].slice(col*3, col*3 + L); 
				x = col*S;
				y = row*S; 
				
				if(s==="00"){
					this.player.P.x = x;
					this.player.P.y = y;
				}
				//blocks array contains map tiles that affect player position
				else if(s==="01"){  //ice
					blocks.push(new Block(x,y,S,S,imgIce1)); 
				}
				else if(s==="02"){  //ice w snow
					blocks.push(new Block(x,y,S,S,imgS1)); 
				}
				else if(s==="03"){  //ROCKS
					blocks.push(new Block(x,y,S,S,imgR3)); 
				}
				else if(s==="04"){  //rocks w grass
					blocks.push(new Block(x,y,S,S,imgR1)); 
				}
				else if(s==="05"){  //DIRT 
					blocks.push(new Block(x,y,S,S,imgD1)); 
				}
				else if(s==="06"){  //dirt w grass
					blocks.push(new Block(x,y,S,S,imgG1)); 
				}
				else if(s==="10"){  //rocks2 
					blocks.push(new Block(x,y,S,S,imgR4)); 
				}
				else if(s==="11"){  //rocks w grass2
					blocks.push(new Block(x,y,S,S,imgR2)); 
				}
				else if(s==="12"){  //dirt w leaves1 
					blocks.push(new Block(x,y,S,S,imgL1)); 
				}
				else if(s==="13"){  //dirt w leaves2
					blocks.push(new Block(x,y,S,S,imgL2)); 
				}
				else if(s==="14"){  //dirt2
					blocks.push(new Block(x,y,S,S,imgD2)); 
				}
				else if(s==="0m"){  //moving platform
					blocks.push(new Mover(x,y,3/2*S,S/3,"mover")); //
				}
				else if (s==="0C"){  //cloud middle
					blocks.push(new Block(x,y,S,S,imgClM));  
				}
				else if (s==="0c"){  //cloud left side
					blocks.push(new Block(x,y,S,S,imgClL));  
				}
				else if (s==="0d"){  //cloud left side w/H flip
					blocks.push(new Block(x,y,S,S,imgClR)); 
				}
				
				//collidables do not affect position but are used for other updates (health, dmg, inventory)  
				else if(s==="0^"){
					spikes.push(new SpikeU(x+(S-S/1.75)/2.0, y-1.5*S, S/1.75, 2.5*S));
				}
				else if(s==="0v"){
					spikes.push(new SpikeD(x+(S-S/1.75)/2.0, y, S/1.75, 2.5*S));
				}
				else if(s==="0L"){  
					lava.push(new Lava(x,y+S/5,S,S-S/5, "l"));
				}
				else if(s==="0h"){
					hearts.push(new Heart(x+S/4,y+S/4,S/2,S/2, imgHeart));
				}
				else if(s==="07"){
					portals.push(new Portal(x, y, S, S, imgPortal));
				}
				else if(s==="09"){
					portkeys.push(new Portkey (x, y, S, S, imgKey));
				}

				//decorative images.  
				else if(s==="0f"){
					decoImages.push(new Deco(x,y,S,S, imgFlower, 3));
				}
				else if(s==="0F"){
					decoImages.push(new Deco(x,y,S,S, imgFlower2, 3));
				}
				else if(s==="0p"){
					decoImages.push(new Deco(x,y,S,S, imgPumpk, 3));
				}
				else if(s==="dF"){  //dirt2 with fossil
					blocks.push(new Block(x,y,S,S,imgD2)); 
					decoImages.push(new Deco(x,y,S,S,imgFossil)); 
				}
				else if(s==="0g"){
					decoImages.push(new Glass(x,y,S,S, "glass", 1));
				}
				else if(s==="0w"){
					decoImages.push(new Water(x,y,S,S, "water", 3));
				}
				else if(s==="0e"){
					decoImages.push(new Deco(x,y,S,S, imgWood1, 0));
				}
				else if(s==="0E"){
					decoImages.push(new Deco(x,y,S,S, imgWood2, 0));
				}
				else if(s==="0B"){
					decoImages.push(new Deco(x,y,S,S, imgBrick, 0));
					decoImages.push(new Water(x,y,S,S, "water", 3));
				}
			}
		}
		//add player to decoImages array and sort by z_Index property to change draw order
		decoImages.push(this.player); 
		decoImages = decoImages.sort((img1, img2) => (img1.z_Index > img2.z_Index ? 1 : -1)); 
			
		//sort additional tiles and concat to maptiles
		let tiles = [lava, spikes, blocks, decoImages, portkeys, hearts, portals]; 
	
		tiles.forEach(set=>{
			this.mapTiles = this.mapTiles.concat(set);
		});

	}
	//methods for screen managment 
	screenLvSelect(){
		background(125,135,150);
		textSize(height/21);
		fill(220,240,240);
		textAlign(LEFT,CENTER);
		text("Select a level and press the start button to begin.",width/10,height/12);
		btnLevels.forEach(btn=> {
			btn.draw();
			});
		btnStart.draw();	
	}
	screenInGame(){
		if (!this.paused){
			this.effectsHandler.screenEffects(this); 
			this.camera();
			
			//draw and update objects of map.  Player is not updated here. 
			this.mapTiles.forEach(item=>{
				if (onScreen(item, this.player,this.levelW, this.levelH)){
					item.draw(this.player);
				}
				if (item !== this.player && typeof item.update === "function"){
					item.update(this.player);
				}
			});

			//player is updated here rather than above
			this.player.update(blocks);

			if(this.player.health<=0){
				this.gameState="gameOver";
			}


			if(this.player.toNextLevel){
				transparency=0;
				canvasOverlay=color(255, 255, 255, transparency);
				this.levelData[this.currentLevel].music.stop();
				this.currentLevel++; 
				this.loadMap(); 
				this.player.hasKey=false;
				this.player.toNextLevel=false;
				
			} 
	
			if(this.currentLevel===4){ //todo: not like this.
				this.gameState="win";
			}
		
			//foreground and overlay effects
			resetMatrix();
			this.player.stats(); //health, info
			this.effectsHandler.fgEffects(this.currentLevel); //forground effects
			fill(canvasOverlay);
			rect(0,0,width,height);
		}
		btnPause.draw();
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
	loadMap(){
		//remove existing tile objects if there are any
		this.removeArray(this.mapTiles);
		this.removeArray(blocks);   
		this.setupMap();  
			
		this.effectsHandler = new EffectsHandler(this); //for this.levelW, this.levelH, this.player);

			if (this.currentLevel < this.numLevels) {  
				this.levelData[this.currentLevel].music.loop();
			}	
		this.gameState = "inGame"; 
	}

	removeArray(arr){
		while(arr.length){arr.pop();}
	}
	
	clickToContinue(){  
		this.player.health = 3;
		this.loadMap(); //reload map for current level
		this.gameState = "inGame";  //restore state to inGame
		
		transparency=0;
		canvasOverlay=color(255, 255, 255,transparency);
	}
	

}