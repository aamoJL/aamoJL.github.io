var navbar, navHeight, navOffsetTop;


document.addEventListener("DOMContentLoaded", function() {
  // Navbar click scrolling
  navbar = document.getElementById("navbar");
  navOffsetTop = navbar.offsetTop;
  navHeight = navbar.offsetHeight;

  window.onscroll = function() {
    if(window.scrollY >= navOffsetTop){
      navbar.classList.add("sticky");
    }
    else{
      navbar.classList.remove("sticky");
    }
  }
})

function showModal(name){
  document.getElementById(name).classList.remove("hidden");
}

function hideModals(){
  document.querySelectorAll(".modal").forEach(element => {
    element.classList.add("hidden");
  });
}

/// Scrolls the web page to element with the given id minus navbar's height
function scrollToId(id){
  var element = document.getElementById(id);
  window.scrollTo({
    top: element.offsetTop - navHeight,
    behavior: 'smooth'});
}

function switchSlide(id, n){
  var activeIndex = document.getElementById(id).dataset.slideindex;
  var slides = document.querySelectorAll(`#${id} .slide`);
  var selectedIndex = Number(activeIndex) + Number(n);

  // switch to last one
  if(selectedIndex < 0){selectedIndex = slides.length - 1;}
  // switch to first one
  else if(selectedIndex > slides.length - 1){selectedIndex = 0;}

  slides[activeIndex].classList.remove("active");
  slides[selectedIndex].classList.add("active");

  document.getElementById(id).dataset.slideindex = selectedIndex;

  var dots = document.querySelectorAll(`#${id} .slide-dot`);
  dots[activeIndex].classList.remove("active");
  dots[selectedIndex].classList.add("active");
}