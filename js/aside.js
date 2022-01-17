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

const renderAside = (value, father) => {
	console.log(father)
	const li = myCreateElement("li", {className: "d-flex align-items-center"}, father);
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
	const dataArr = Object.entries(data);

	const title = myCreateElement("div", {className: "ps-3 header",}, menuUsers);
	myCreateElement("span", {className: "title", innerHTML: "Following"}, title)
	myCreateElement("span", {className: "counterFollowing", innerHTML: dataArr.length}, title)
	const followingUl = myCreateElement("ul", {className: "followingUl"}, menuUsers);
	aside.classList.remove("d-none")
	// if(dataArr.length === 0){
	// 	aside.classList.add("d-none")
	// }

	dataArr.map(item => {
		const uid = item[0];
		getUserData2(uid, renderAside, followingUl)
	})
}
function followersArr(data) {
	const dataArr = Object.entries(data);

	const title = myCreateElement("div", {className: "ps-3 header",}, menuUsers);
	myCreateElement("span", {className: "title", innerHTML: "Followers"}, title)
	myCreateElement("span", {className: "counterFollowing", innerHTML: dataArr.length}, title)

	const followersUl = myCreateElement("ul", {className: "followersUl"}, menuUsers);

	dataArr.map(item => {
		const uid = item[0];
		getUserData2(uid, renderAside, followersUl)
	})

	loading.classList.add("d-none");
}

export { followingArr, followersArr }