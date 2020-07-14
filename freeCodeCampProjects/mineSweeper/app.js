document.addEventListener('DOMContentLoaded', ()=> {
    const grid = document.getElementById('grid');
    const header = document.getElementById('headerBoard');
    const toggle = document.getElementById('toggleMode');
    const mineSquares = document.querySelectorAll('.square');
    const arrSquares = Array.from(mineSquares);  //array of squares on map
    const width = 10;  //for search bomb-number assignment
    let totalBombs = 15;
    let flags = totalBombs;
    let flaggedBombs = 0;
    let gameover = false;
    let buttonMode = false;

    header.innerHTML = `flags remaining: ${flags}`;
    assignBombs(totalBombs);  //add bombs

    //add class names and value attribute to squares
    for (let i=0; i < arrSquares.length; i++){
        cycleSquares(i, labelBombs);
    }
    //button for mobile flagging
    toggle.addEventListener('click', ()=>{
        buttonMode = !buttonMode;
        toggle.classList.toggle('active');
    });

    grid.addEventListener('click', (event)=>{
        if(!buttonMode && !gameover && arrSquares.some(square=> square === event.target)){ //limit event to squares only
            userClick(event.target);
        } 
        if (buttonMode && !gameover && arrSquares.some(square=> square === event.target)){
            setFlag(event.target);
        }
    });
    grid.oncontextmenu = (event)=>{
        event.preventDefault();
        if(!gameover && arrSquares.some(square=> square === event.target)){ 
            setFlag(event.target);
        }
    }

    /****************************** functions *************************************/
    function assignBombs(number){
        let numSquares = arrSquares.length;
        //limit number of bombs, or this recursion lesson might never end.
        if (number >= 0.5*numSquares){ 
            console.log("number of bombs must be less than half of the available squares");
            return;
        }
        let numBombs = number;
        let randIndex;

        while(numBombs>0){
            randIndex = Math.floor(numSquares*Math.random());
            //get a new square if the randomly chosen square is already a bomb
            if (arrSquares[randIndex].classList.contains('bomb')) continue; 
            else {
                arrSquares[randIndex].classList.add('bomb');  //add bomb to classlist
                numBombs--;
            }
        }    
    }

    //determines the number of surrounding bombs, then adds corresponding 
    //class name and sets div element's value attribute to that number.
    function labelBombs(yStart, yEnd, xStart, xEnd, i){
        let numBombsAround = 0;

        for (let y=yStart; y < yEnd; y++){
            for (let x=xStart; x < xEnd; x++){
                if (i + y*width + x === i) continue;
                if (arrSquares[i + y*width + x].classList.contains('bomb')) numBombsAround++;
            }
        }
        arrSquares[i].classList.add(`_${numBombsAround}`);
        arrSquares[i].setAttribute('value', numBombsAround);
    }

    function setFlag(target){
        if(!target.classList.contains('checked')){
            if (target.classList.contains('flag')){
                target.classList.remove('flag');
                flags++;
                target.classList.contains('bomb') ? flaggedBombs-- : 0;
            } 
            else if(flags > 0){
                target.classList.add('flag');
                flags--;
                target.classList.contains('bomb') ? flaggedBombs++ : 0;
            }
            header.innerHTML = `flags remaining: ${flags}`;

            if(flaggedBombs===totalBombs){
                header.innerHTML = "😎";
            }
        }
    }

    function userClick(target){
        if(target.classList.contains('bomb') && !target.classList.contains('flag')){
            header.innerHTML="😖 game over";
            gameover = true;
            target.classList.add('checked');
            return;
        }
        if(target.classList.contains('flag') || target.classList.contains('checked')){
            return;
        }
        target.classList.add('checked');
        target.innerHTML = target.getAttribute('value');

        if (target.getAttribute('value')==="0"){
            let index = arrSquares.indexOf(target);
            cycleSquares(index, checkBombs);
        }
    }

    //recursively check non-bomb neighbor cells with val===0, set html
    function checkBombs(yStart, yEnd, xStart, xEnd, i){
        for (let y=yStart; y < yEnd; y++){
            for (let x = xStart; x < xEnd; x++){
                if (arrSquares[i + y*width + x].classList.contains('checked') || 
                    arrSquares[i + y*width + x].classList.contains('bomb') ||
                    arrSquares[i + y*width + x].classList.contains('flag')){
                    continue;
                }
                arrSquares[i + y*width + x].classList.add('checked');
                arrSquares[i + y*width + x].innerHTML = arrSquares[i + y*width + x].getAttribute('value');
                if (arrSquares[i + y*width + x].innerHTML==="0"){
                    setTimeout(() => {
                        cycleSquares((i + y*width + x), checkBombs);
                    }, 15);
                }
            }
        }
    }
    
    //calls a function on neighboring cells. params are nested for-loop start/end vals 
    function cycleSquares(i, callback){
        let isOnLeftEdge = i % width === 0;
        let isOnRightEdge = (i + 1) % width === 0;

        if (i < width ){   //top row
            if(isOnLeftEdge) callback(0, 2, 0, 2, i); 
            else if(isOnRightEdge) callback(0, 2, -1, 1, i); 
            else callback(0, 2, -1, 2, i); 
        } 
        else if (i >= arrSquares.length-width){ //bottom row
            if(isOnLeftEdge) callback(-1, 1, 0, 2, i); 
            else if(isOnRightEdge) callback(-1, 1, -1, 1, i); 
            else callback(-1, 1, -1, 2, i);
        }
        else {   //all other rows
            if(isOnLeftEdge) callback(-1, 2, 0, 2, i); 
            else if(isOnRightEdge) callback(-1, 2, -1, 1, i); 
            else callback(-1, 2, -1, 2, i);
        }    
    } 

});