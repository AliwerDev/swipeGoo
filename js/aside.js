import {getUsers, getUserImages} from "./firebase.js";
import {myCreateElement, renderImgBox} from "./functions.js";

const arrowBtn = document.querySelector(".arrowBtn");
const aside = document.querySelector("#aside");
const menuUsers = document.querySelector("#menuUsers");

const header = document.querySelector("header");
console.log(header.offsetHeight);
aside.style.top = header.offsetHeight + "px";

arrowBtn.addEventListener('click', () => {
	aside.classList.toggle("hide");
	document.querySelector(".bgHide").classList.toggle("d-none")
})

const renderAside = (data) => {
	const dataUsers = Object.entries(data);
	menuUsers.innerHTML = "";

	dataUsers.map((item) => {
		const value = item[1];
		const id = item[0];

		const li = myCreateElement("li", {className: "d-flex align-items-center"}, menuUsers);
		const minImg = myCreateElement("img", {className: "minImg", src: value.userImg || "http://cdn.onlinewebfonts.com/svg/img_264570.png", alt: value.userName}, li);
		const p = myCreateElement("span", {innerText: value.userName}, li)
		li.addEventListener('click', () => {
			imgGallery.innerHTML = "";
			getUserImages(id, renderImgBox);
		})
	})
}

getUsers(renderAside);


