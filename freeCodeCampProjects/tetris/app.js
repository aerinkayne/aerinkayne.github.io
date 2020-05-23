document.addEventListener('DOMContentLoaded', ()=> {
    const width = 10;  //num cols in grid
    let squares = Array.from(document.querySelectorAll('#grid div'));
    let score = 0;
    const grid = document.getElementById('grid');


    function addScore(){
        for (let i = 0; i < 199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index=> squares[index].classList.contains('taken'))){
                score+=10;
                scoreSpan.innerHTML = score;
                row.forEach(index=> {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');

                    tetStyles.forEach(style=> {   
                        squares[index].classList.remove(style);
                    });

                });
                const squaresRemoved = squares.splice(i,width);
                
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell=> grid.appendChild(cell));
            }
        }
    }

    function gameOver(){
        if(currentTet.some(index=> squares[currentP+index].classList.contains('taken'))){
            scoreSpan.innerHTML = '<br />Game Over';
            clearInterval(timerID);
        }
    }

    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', ()=> {
        if(timerID) {
            clearInterval(timerID);
            timerID = null;
        } else {
            draw();
            timerID = setInterval(moveDown, 600);
            displayInNext();
        }
    });

    const scoreSpan = document.getElementById('score');
    let timerID;

    const L1Tetro = [
        [1, width+1, 2*width+1, 2],
        [width, width+1, width+2, 2*width+2],
        [1, width+1, 2*width+1, 2*width],
        [width, 2*width, 2*width+1, 2*width+2]  
    ]
    const L2Tetro = [
        [1, width+1, 2*width+1, 0],
        [width, width+1, width+2, 2],
        [1, width+1, 2*width+1, 2*width+2],
        [width, width+1, width+2, 2*width]  
    ]
    const BoxTetro = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const TTetro = [  // *v*
        [0,1,2,width+1],
        [1, width, width+1, 2*width+1],
        [1, width, width+1, width+2],
        [1, width+1, width+2, 2*width+1]
    ]
    const ITetro = [  // ****
        [0,1,2,3],
        [1,width+1,2*width+1,3*width+1],
        [0,1,2,3],
        [1,width+1,2*width+1,3*width+1]
    ]
    const ZigTetro = [  // v*^
        [1, width, width+1, 2*width],
        [0,1,width+1, width+2],
        [1, width, width+1, 2*width],
        [0,1,width+1, width+2]
    ]                   
    const ZagTetro = [  // ^*v
        [0, width, width+1, 2*width+1],
        [1,2, width, width+1],
        [0, width, width+1, 2*width+1],
        [1,2, width, width+1]
    ]

    //active piece
    const tetros = [L1Tetro, L2Tetro, BoxTetro, TTetro, ITetro, ZigTetro, ZagTetro];
    //style names used in CSS file for each tetromino type.
    const tetStyles = ["red", "blue", "green", "orange", "violet", "magenta", "yellow"];

    let currentP = 4;
    let currentType = Math.floor(Math.random()*tetros.length);
    
    let currentRotation = 0;
    let currentTet = tetros[currentType][currentRotation];

    //up next
    let upNextSquares = Array.from(document.querySelectorAll('#miniGrid div'));
    const displayWidth = 4;
    let displayIndex = 0;
    let nextType = Math.floor(Math.random()*tetros.length); 
    const upNextTetros = [
        [1, displayWidth+1, 2*displayWidth+1, 2],       //L1_0
        [1, displayWidth+1, 2*displayWidth+1, 0],       //L2_0
        [0, 1, displayWidth, displayWidth+1],           //box_0
        [0, 1, 2, displayWidth+1],                      //T
        [0, 1, 2, 3],
        [1, displayWidth, displayWidth+1, 2*displayWidth],
        [0, displayWidth, displayWidth+1, 2*displayWidth+1]
    ];
    

    function draw(){
        currentTet.forEach(square=> {
            squares[currentP + square].classList.add('tetromino');
            squares[currentP + square].classList.add(tetStyles[currentType]);
        })
    }
    function undraw() {
        currentTet.forEach(square=> {
            squares[currentP + square].classList.remove('tetromino');
            squares[currentP + square].classList.remove(tetStyles[currentType]);
        })
    }

    function controls(e){
        if(e.keyCode === 37 && timerID){
            moveLeft();
        }
        else if(e.keyCode === 39 && timerID){
            moveRight();
        }
        else if(e.keyCode === 38 && timerID){
            rotateTet();
        }
        else if(e.keyCode === 40 && timerID){
            moveDownKey();
        }
    }
    document.addEventListener('keyup', controls);


    //mainish
    function moveDown(){
        undraw();
        currentP += width;
        draw(); 
        freeze();
    }


    function freeze(){
        if(currentTet.some(index=> squares[currentP + index + width].classList.contains('taken'))){
            currentTet.forEach(tet=> squares[currentP + tet].classList.add('taken'));
            
            currentType = nextType;
            nextType = Math.floor(Math.random()*tetros.length);
            currentTet = tetros[currentType][currentRotation];
            currentP = 4;

            draw();
            displayInNext();
            addScore();
            gameOver();
        }
    }
    function isAtRight() {
        return currentTet.some(index=> (currentP + index + 1) % width === 0);  
    }
    function isAtLeft() {
        return currentTet.some(index=> (currentP + index) % width === 0);
    }

    function moveLeft(){
        undraw();
        if(!isAtLeft()){currentP -= 1;}

        if(currentTet.some(index=> squares[currentP + index].classList.contains('taken'))){
            currentP += 1;
        }
        draw();
    }

    function moveRight(){
        undraw();
        if(!isAtRight()){currentP += 1;}

        if(currentTet.some(index=> squares[currentP + index].classList.contains('taken'))){
            currentP -= 1;
        }
        draw();
    }

    function moveDownKey(){
        undraw();
        currentP += width;

        if(currentTet.some(index=> squares[currentP + index].classList.contains('taken'))){
            currentP -= width;
        }
        draw();
        freeze();
    }

    function checkRotatedP(P){
        P = P || currentP;         //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {   //add 1 because the position index can be 1 less than where the piece is (with how they are drawn).     
            if (isAtRight()){      //check if it's flipped over to right side
                currentP += 1;     //if so add one to wrap it back around
                checkRotatedP(P);  //check again with the position from start, since long block might need to move twice.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
                currentP -= 1;
                checkRotatedP(P);
            }
        }
    }
    
    function rotateTet(){
        undraw();
        currentRotation++;
        if(currentRotation === currentTet.length){
            currentRotation=0;
        }
        currentTet = tetros[currentType][currentRotation];
        checkRotatedP();
        draw();
    }

    function displayInNext(){
        upNextSquares.forEach(square=> {
            square.classList.remove('tetromino');
            square.classList.remove(tetStyles[currentType]);

            upNextTetros[nextType].forEach(index=> {
                upNextSquares[displayIndex + index].classList.add('tetromino');
                upNextSquares[displayIndex + index].classList.add(tetStyles[nextType]);
            });
        });
    }



})