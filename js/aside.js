import {getUsers, getUserImages, getUserData, getUserData2} from "./firebase.js";
import {myCreateElement, openProfileGallery, otherUserProfile, renderImgBox, userAccountRender} from "./functions.js";

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

const renderAside = (value) => {
	const li = myCreateElement("li", {className: "d-flex align-items-center"}, menuUsers);
	const minImg = myCreateElement("img", {className: "minImg", src: value.userImg || userDefaultImg, alt: value.userName}, li);
	const p = myCreateElement("span", {innerText: value.userName}, li)
	li.addEventListener('click', () => {
		lastActiveLi.classList.remove("active");
		li.classList.add("active");
		lastActiveLi = li;
		otherUserProfile(value.uid);

		if(!bgHide.classList.contains("d-none")){
			bgHide.classList.add("d-none")
		}
		if(!aside.classList.contains("hide")){
			aside.classList.add("hide")
		}
	})
}

//Render follows
function followingArr(data) {
	menuUsers.innerHTML = "";
	const title = myCreateElement("h3", {className: "ps-3", innerHTML: "Following"}, menuUsers);
	const dataArr = Object.entries(data);
	aside.classList.remove("d-none")
	if(dataArr.length === 0){
		aside.classList.add("d-none")
	}

	dataArr.map(item => {
		const uid = item[0];
		getUserData2(uid, renderAside)
	})
}
function followersArr(data) {
	const title2 = myCreateElement("h3", {className: "ps-3", innerHTML: "Followers"}, menuUsers);
	const dataArr = Object.entries(data);

	dataArr.map(item => {
		const uid = item[0];
		getUserData2(uid, renderAside)
	})

	loading.classList.add("d-none");
}

export { followingArr, followersArr }