import {getUsers, getUserImages} from "./firebase.js";
import {myCreateElement, renderImgBox} from "./functions.js";

const arrowBtn = document.querySelector(".arrowBtn");
const aside = document.querySelector("#aside");
const menuUsers = document.querySelector("#menuUsers");
const bgHide = document.querySelector(".bgHide")
let lastActiveLi = myCreateElement("span", {className: "d-none"}, aside);

const header = document.querySelector("header");
aside.style.top = header.offsetHeight + "px";

arrowBtn.addEventListener('click', () => {
	if(aside.classList.contains("hide")){
		aside.classList.remove("hide");
		bgHide.classList.remove("d-none")
	}else{
		aside.classList.add("hide");
		bgHide.classList.add("d-none")
	}
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
			lastActiveLi.classList.remove("active");
			li.classList.add("active");
			lastActiveLi = li;
			getUserImages(id, renderImgBox);

			if(!bgHide.classList.contains("d-none")){
				bgHide.classList.add("d-none")
			}
			if(!aside.classList.contains("hide")){
				aside.classList.add("hide")
			}
		})
	})
}

getUsers(renderAside);


