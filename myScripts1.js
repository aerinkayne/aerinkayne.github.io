/*current ao 122918 */


//header nav functions for dropdowns
/*
function dropList(dropID) {
	var x = document.getElementById(dropID);
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}
*/


function getTarget(e) {
	if (!e) {
		e = window.event;
	}
	return e.target || e.srcElement;
}

function dropTest (e) {

	var target; 
	target = getTarget(e).parentNode;    //get event target, p, div is parentNode cuz reasons
	var tarDropChild = target.lastChild; //get the UL child 
	
	
		if (tarDropChild.style.display === "none") {
		tarDropChild.style.display = "flex";
		} else {
		tarDropChild.style.display = "none";
		}
	return tarDropChild;	
}


//border functions.  specific number of repeats and spacing for a decorative image





//slideshow functions.  Set NUM_SLIDESHOWS value, as needed, in each html file (script)

//sets up an array with an index for each slideshow, with each index initialized to 1.
function indexSlideShows(NUM_SLIDESHOWS) { 
	var slideIndex = []; 
	for (i=0; i < NUM_SLIDESHOWS; i++) {  //index 0 is for slideshow 'SS0', index 1 is for 'SS1' etc
		slideIndex[i] = 1;
	}
	return slideIndex;
}

function loadSlideShows(NUM_SLIDESHOWS) {
	var SS = "SS";  //each slideshow has a unique ID in the HTML file ("SS#")
	for (i = 0; i < NUM_SLIDESHOWS; i++) {
		SS = SS + i;	//loop through all slideshow IDs by concat "SS + i".  eg SS0, SS1 etc 
		displaySlide(SS, slideIndex[i]);
		SS = "SS"; // reset the value of SS so it can be used for the next slideshow.
	}
}

function changeSlide(n, SS, index) {
	// all images associated with slides have 'mySlides' class, but each slideshow has a unique slideshow ID. 
	var slides = document.getElementById(SS).getElementsByClassName("mySlides");

	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	//change slideIndex at the index associated with the given SS.  ID in HTML file should be 'SS#': SS0, SS1, SS2 etc.
	if (slideIndex[index] + n < 1) {slideIndex[index] = slides.length}
		else if (slideIndex[index] + n > slides.length) {slideIndex[index] = 1}
		else {slideIndex[index] += n}

	displaySlide(SS, slideIndex[index]);	
}

function displaySlide(SS, n) {
	var slides = document.getElementById(SS).getElementsByClassName("mySlides");
	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	slides[n-1].style.display = "block";	
}

function addListeners () {
	var dropBtns = document.getElementsByClassName("dropBtn");
	for (var i = 0; i < dropBtns.length; i++) {
		dropBtns[i].addEventListener('click', function(e){dropTest(e);}, false);
	}
}
