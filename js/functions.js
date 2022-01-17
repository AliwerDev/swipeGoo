//creat element
import {
	getComments,
	getUserImages,
	deleteImg,
	getLikes,
	getUserData,
	getUsers,
	pushLike,
	removeLike,
	isFollowFirebase,
	editFollow,
} from "./firebase.js";
import {renderBigImg} from "./bigImg.js";
import {creatAddImg} from "./user.js";

//Shuffle arr
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

// Creat Element
const myCreateElement = (elementName, attrs = {}, father) => {
	const element = document.createElement(elementName);

	for (const attrsKey in attrs) {
		element[attrsKey] = attrs[attrsKey];
	}

	father && father.append(element);

	return element;
};

//Get Date
const getDate = () => {
	const date = new Date();
	return (`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} (${date.getHours()} : ${date.getMinutes()})`);
}

//All images render
function allImages(data)  {
	let allImagesArr = [];
	const users = Object.values(data);

	users.map(user => {
		const images = Object.values(user.images || {});
		images.map(img => {
			allImagesArr.push(img);
		})
	})
	allImagesArr.sort((rasmA, rasmB) => rasmA.date - rasmB.date)
	imgGallery.innerHTML = '';
	renderImgBox(allImagesArr.reverse(), true)
}

const renderImgBox = (imagesData, isAll = false) => {
	let imgDataArr;
	let gallery;

	if(!isAll) {
		imgDataArr = Object.values(imagesData);
		gallery = profileGallery;
		openProfileGallery();
	}
	else{
		gallery = imgGallery;
		imgDataArr = imagesData;
	}
	imgDataArr.map(imgData => {
		const imgBox = myCreateElement("div", {className: "img-box",}, gallery);
		const img = myCreateElement("img", {id: imgData.id, src: imgData.url, alt: imgData.title ||  imgData.ownerId}, imgBox)
		const span = myCreateElement("span", {}, imgBox);

		let editeBtn;
		if(userUid === imgData.ownerId){
			editeBtn = myCreateElement("div", {className: "download", innerHTML: `<i class="fas fa-edit"></i>`}, span);

			editeBtn.addEventListener("click", () => {
				creatAddImg(imgData);
			})
		}
		const likes = myCreateElement("div", {className: "comment"}, span);
		const comment = myCreateElement("div", {className: "cloud", innerHTML: `<i class="far fa-comment"></i>`}, span);
		const deleteBtn = myCreateElement("div", {className: "nuqta", innerHTML: `<i class="fas fa-ellipsis-h"></i>`}, span)

		const likeBtn = myCreateElement("i", {className: "fas fa-heart text-white", }, likes);
		const likeCounter = myCreateElement("span", {}, likes);
		let isLiked = false;
		let counter;

		function likeBos(likes) {
			const likesArr = Object.values(likes) || [];

			counter = likesArr.length;

			if(likesArr.some((item) => item === userUid)){
				isLiked = true;
				likeBtn.classList.add("text-danger")
				likeBtn.classList.remove("text-white");
			}
			likeCounter.innerHTML = counter;
		}

		getLikes(imgData.ownerId, imgData.id, likeBos);

		likes.addEventListener('click', () => {
			if(!isLiked){
				likeBtn.classList.add("text-danger")
				likeBtn.classList.remove("text-white");
				pushLike(imgData.ownerId, imgData.id, userUid);
				isLiked = true;
				counter++;
			}else{
				likeBtn.classList.remove("text-danger")
				likeBtn.classList.add("text-white");
				removeLike(imgData.ownerId, imgData.id, userUid);
				isLiked = false;
				counter--;
			}
			likeCounter.innerHTML = counter;
		});

		let ownerObj;
		function getOwnerData(data) {
			ownerObj = {
				imgUrl: imgData.url,
				imgTitle: imgData.title || "",
				imgInfo: imgData.desc || "",
				userImg: data.userImg,
				userName: data.userName,
				bio: data.bio || "",
				ownerId: imgData.ownerId,
				imgId: imgData.id,
			}
		}

		comment.addEventListener('click', () => {
			getUserData(imgData.ownerId, getOwnerData);
			getComments(imgData.ownerId, imgData.id, renderBigImg, ownerObj)
		})

		//ImgDelete
		if(imgData.ownerId === userUid){
			deleteBtn.innerHTML = `<i class="far fa-trash-alt"></i>`
			deleteBtn.addEventListener('click', () => {
				console.log("Delete Function");
				deleteImg(imgData.ownerId, imgData.id);
			})
		}
		else{
			deleteBtn.innerHTML = "";
			const img = myCreateElement("img", {className: "userMinImg", src: userDefaultImg}, deleteBtn);
			deleteBtn.addEventListener('click', () => {
				otherUserProfile(imgData.ownerId)
			})
		}
	})
};

//other USer profile
function otherUserProfile(id) {
	getUserData(id, userAccountRender);
	getUserImages(id, renderImgBox);
}

//Add Img Modal Render
const userAccountRender = (data) => {
	userAccount.innerHTML = "";
	const row = myCreateElement("div", {className: "accountRow",}, myCreateElement("div" , {className : 'container py-5'} , userAccount))
	const col1 = myCreateElement(
		"div",
		{ className: "left" },
		row
	);

	const col2 = myCreateElement(
		"div",
		{ className: "right" },
		row
	);

	const accountImg = myCreateElement("div", { className: "accountImg"} , col1);
	const img =  myCreateElement("img", { className: "img-fluid" , src: `${data.userImg || userDefaultImg}`}, accountImg)

	const infoProfile = myCreateElement("div" ,{ className: "infoProfile"}, col2);
	const userName = myCreateElement("p" ,{ className: "userName" , innerHTML:  `${data.userName}`} , infoProfile);
	const bio = myCreateElement("p" ,{ className: "bio" , innerHTML: `${data.userBio || "User Bio"}`} , infoProfile);
	if(data.uid !== userUid){
		const followBtn = myCreateElement("button" , {className: "followBtn",} , infoProfile);
		if(data["followers"] && data["followers"][userUid]){
			followBtn.innerHTML = "Unfollow";
		}
		else {
			followBtn.innerHTML = "Follow";
		}

		function isFollow1(item){
			isFollow(item[`${data.uid}`] || false);
		}

		followBtn.addEventListener("click", () => {
			isFollowFirebase(userUid, data.uid, isFollow1);
		})

		function isFollow(bool){
			editFollow(userUid, data.uid, bool);
		}
	}
}


//Gallery
function openProfileGallery() {
	profileGallery.classList.remove("d-none");
	profileGallery.innerHTML = "";
	apiGallery.classList.add("d-none");
	imgGallery.classList.add("d-none");
	readMore.classList.add("d-none");
	brand.classList.add("d-none");
	userAccount.classList.remove("d-none")
}
function openApiGallery() {
	profileGallery.classList.add("d-none");
	apiGallery.classList.remove("d-none");
	apiGallery.innerHTML = "";
	imgGallery.classList.add("d-none");
	readMore.classList.remove("d-none");
}
function openImgGallery() {
	profileGallery.classList.add("d-none");
	apiGallery.classList.add("d-none");
	imgGallery.classList.remove("d-none");
	readMore.classList.add("d-none");
}
function openAllGallery(){
	profileGallery.classList.add("d-none");
	apiGallery.classList.remove("d-none");
	imgGallery.classList.remove("d-none");
	readMore.classList.remove("d-none");
	userAccount.classList.add("d-none")
}


export { otherUserProfile, userAccountRender,shuffle, allImages, renderImgBox, myCreateElement, getDate, openImgGallery, openApiGallery, openProfileGallery, openAllGallery }