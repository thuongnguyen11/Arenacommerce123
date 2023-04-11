var btnClose = document.querySelector(".navMenu__header-iconClose");
var btnOpen = document.querySelector(".Header__navMenuIcon");
var navMenu = document.querySelector(".navMenu");
var body = document.querySelector("body");

btnClose.addEventListener("click", () => {
  navMenu.style.display = "none";
  body.style.overflow = "scroll";
});

btnOpen.addEventListener("click", () => {
  navMenu.style.display = "block";
  body.style.overflow = "hidden";
});
