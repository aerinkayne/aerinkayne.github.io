class Game{ 
	constructor() {  
		this.ts = 40;  //tile size
		this.player = (new Player(0,0,0.7*this.ts,0.7*this.ts)); 
		this.gameState = "levelSelect"; 
		this.paused = false;
		this.levelW;  //defined at lv load
		this.levelH;
		this.bordL = width/2; 
		this.bordR; 
		this.bordT = height/2; 
		this.bordB;
		this.currentLevel = 0;  //default if none selected
		this.numLevels = 4;     //btn testing 041220
		this.levelData = levelData;
		}

	renderArr(arrToRender){ 
		for(let i=0; i<arrToRender.length; i++){
			if (onScreen(arrToRender[i], this.player, this.levelW, this.levelH)){
				arrToRender[i].draw(this.player); //some objects need player info 
			}
			//call update() if object has that method, but don't update the player here.  
			if (arrToRender[i] !== this.player && typeof arrToRender[i].update === "function" ){
				arrToRender[i].update(this.player);
			}       
		}
	}
	manageScenes(){ //called on mouseclick.  buttons are currently global objects. 
		if (this.gameState === "levelSelect"){
			for (let i = 0; i < btnLevels.length; i++){
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
			this.effectsHandler.screenEffects(this.currentLevel); 
			this.camera();
			
			//draw and update objects of map 
			for (let i=0; i<this.mapTiles.length; i++){
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
		this.levelKey();  		//get map tiles 
			
		//add player to decoImages array and sort by z_Index property to change draw order
		decoImages.push(this.player); 
		decoImages = decoImages.sort((img1, img2) => (img1.z_Index > img2.z_Index ? 1 : -1)); 
			
		//all map tiles. TODO concat and change double loops for iteration and splicing?
		this.mapTiles = [lava, spikes, blocks, decoImages, portkeys, hearts, portals];
		//use level W, H and player info for effects
		this.effectsHandler = new EffectsHandler(this.levelW, this.levelH, this.player);
			if (this.currentLevel < this.effectsHandler.sScape.length){ 
				this.effectsHandler.sScape[this.currentLevel].loop(); 
			}	
		this.gameState = "inGame"; 
	}

	removeMap(arr){
		for (let i = arr.length-1; i>=0; i--){
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