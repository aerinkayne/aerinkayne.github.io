
//header nav functions for dropdowns
function dropList(dropID) {
	var x = document.getElementById(dropID);
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}
		


//slideshow functions

// 080418 sets up an array with one index for each slideshow, with each index initialized to 1.
function indexSlideShows(NUM_SLIDESHOWS) { 
	var slideIndex = []; 
	for (i=0; i < NUM_SLIDESHOWS; i++) {  //index 0 is for slideshow 0, index 1 is for ss1 etc
		slideIndex[i] = 1;
	}
	return slideIndex;
}

function loadSlideShows(NUM_SLIDESHOWS) {
	var SS = "SS";  //each slideshow has a unique ID in the HTML, "SS#"
	for (i = 0; i < NUM_SLIDESHOWS; i++) {
		SS = SS + i;	//loop through all slideshow IDs by concat "SS + i".  eg SS0, SS1 etc 
		displaySlide(SS, slideIndex[i]);
		SS = "SS"; // reset SS so it can be used again in this way
	}
}

function changeSlide(n, SS, index) {
	// all images associated with slides have 'mySlides' class, but each slideshow has a unique slideshow ID. 
	var slides = document.getElementById(SS).getElementsByClassName("mySlides");

	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	//change slideIndex at the index associated with SS.  SS id in HTML should have a number affix to make this less confusing.
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
