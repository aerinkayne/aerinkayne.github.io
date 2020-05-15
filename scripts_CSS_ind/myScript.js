let elBurger = document.getElementById('burger');
let elNavLinks = document.getElementById('navLinks');
let elDropBtns = document.getElementsByClassName('dropdown');

elBurger.addEventListener('click', ()=> {
	elBurger.classList.toggle('burgX');
	elNavLinks.classList.toggle('showNav');
})

if (elDropBtns.length){
 for (let i = 0; i < elDropBtns.length; i++){
  elDropBtns[i].addEventListener('click', (e)=> {
   if (e.currentTarget.lastElementChild.style.display === "none") {  
    e.currentTarget.lastElementChild.style.display = "block";  
   } else {
    e.currentTarget.lastElementChild.style.display = "none";
   }	
  })
 }
}


let themeOptions = document.getElementsByName('theme'); 

if (themeOptions.length){  //'theme' radio group used for sandWater, gridDisplay and gridItem
 //ev on water grid
 let waterItems = document.getElementById('sandWater').getElementsByClassName('gridItem');
 for (let i=0; i< waterItems.length; i++){
  waterItems[i].addEventListener('click', ()=> {
   waterItems[i].style.transform = (waterItems[i].style.transform === 'rotateY(180deg)') ? 'rotateY(0deg)' : 'rotateY(180deg)';
  })
 }
 //show initial grid
 let elGridDisplay = document.getElementsByClassName('gridRadioDisplay');
 elGridDisplay[0].style.display = "grid";
 //radio val === display id
 for (let i = 0; i < themeOptions.length; i++){
  themeOptions[i].addEventListener('click',(e)=> {
   for (let j = 0; j< elGridDisplay.length; j++){
    elGridDisplay[j].style.display = "none";  
   }
   let selected = document.getElementById(e.currentTarget.value);
   selected.style.display = "grid";
  })	
 }
}



let elFrameOptions = document.getElementsByName('frameOptions');//radio group name

if(elFrameOptions.length){  
 let divMaskList = document.getElementsByClassName('maskedImageDisplay'); //mask containers to change display of
 divMaskList[0].style.display = "flex";                         //show one initially
 for (let i = 0; i < elFrameOptions.length; i++)                    
 elFrameOptions[i].addEventListener('click',(e)=> {  
  for (let j = 0; j < divMaskList.length; j++){
   divMaskList[j].style.display = "none";                       //reset all to display none
  }
  let maskT = document.getElementById(e.target.value);          //input val is same as mask container ID
  maskT.style.display = "flex";                          
 })
}



/*
let imageOptions = document.getElementsByName('imageChoices');

if(imageOptions.length){
 imageOptions.addEventListener('click', (e)=> {
  for (let i=0; i< divMaskList.length; i++){
   divMaskList[i].classList.toggle(e.target.value);
  }
  
 });
}
//*/