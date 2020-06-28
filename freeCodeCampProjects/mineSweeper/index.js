document.addEventListener('DOMContentLoaded', ()=> {

    let burgerRef = document.getElementById('burger');
    let navLinksRef = document.getElementById('navLinks');
    let dropBtnsRef = document.getElementsByClassName('dropdown');

    burgerRef.addEventListener('click', ()=> {
        burgerRef.classList.toggle('burgX');
        navLinksRef.classList.toggle('showNav');
    })

    if (dropBtnsRef.length){
        for (let i = 0; i < dropBtnsRef.length; i++){
            dropBtnsRef[i].addEventListener('click', (e)=> {
                if (e.currentTarget.lastElementChild.style.display === "none") {  
                    e.currentTarget.lastElementChild.style.display = "block";  
                } else {
                    e.currentTarget.lastElementChild.style.display = "none";
                }	
            })
        }
    }
});    