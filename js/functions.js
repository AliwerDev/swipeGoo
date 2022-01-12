//creat element
import {creatAddUser} from "./user.js";
import {getLikes, pushLike, removeLike} from "./firebase.js";

const myCreateElement = (elementName, attrs = {}, father) => {
	const element = document.createElement(elementName);

	for (const attrsKey in attrs) {
		element[attrsKey] = attrs[attrsKey];
	}

	father && father.append(element);

	return element;
};

//Rand number
const getRandnum = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
//Get Date
const getDate = () => {
	const date = new Date();
	return (`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} (${date.getHours()} : ${date.getMinutes()})`);
}

const renderImgBox = (imagesData, user) => {
	console.log(imagesData)
	imgGallery.innerHTML = "";
	imgGallery.classList.remove("d-none")
	apiGallery.classList.add("d-none");
	readMore.classList.add("d-none")

	if(user) {
		creatAddUser(imgGallery);
	}

	const imgDatas = Object.entries(imagesData);

	imgDatas.map(item => {
		const id = item[0];
		const imgData = item[1];

		const imgBox = myCreateElement("div", {className: "img-box",}, imgGallery);
		const img = myCreateElement("img", {id: imgData.id, src: imgData.url, alt: imgData.title ||  imgData.ownerId}, imgBox)
		const span = myCreateElement("span", {}, imgBox);
		const download = myCreateElement("div", {className: "download", innerHTML: `<i class="fas fa-download"></i>`}, span);
		const likes = myCreateElement("div", {className: "comment"}, span);
		const comment = myCreateElement("div", {className: "cloud", innerHTML: `<i class="fas fa-download"></i>`}, span);
		const nuqta = myCreateElement("div", {className: "nuqta", innerHTML: `<i class="fas fa-ellipsis-h"></i>`}, span)

		const likeBtn = myCreateElement("i", {className: "fas fa-heart text-white", }, likes);
		const likeCounter = myCreateElement("span", {}, likes);
		let isLiked = false;
		function likeBos(likes) {
			const likesArr = Object.values(likes) || [];

			const counter = likesArr.length;

			if(likesArr.some((item) => item === userUid)){
				isLiked = true;
				likeBtn.classList.add("text-danger")
				likeBtn.classList.remove("text-white");
			}
			console.log(counter)
			likeCounter.innerHTML = counter;
		}

		getLikes(imgData.ownerId, id, likeBos);

		likes.addEventListener('click', () => {
			if(!isLiked){
				pushLike(imgData.ownerId, id, userUid);
			}else{
				removeLike(imgData.ownerId, id, userUid);
			}
		})
	})
}

export { renderImgBox, myCreateElement, getRandnum, getDate }