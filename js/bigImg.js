import {myCreateElement, otherUserProfile} from "./functions.js";
import {getUserData, pushComment} from "./firebase.js";
let bigImgSection;
const renderBigImg = (comments, owner) => {
	if(!bigImgSection) bigImgSection = myCreateElement("section", {id: "chat"}, document.querySelector("body"))
	else{
		bigImgSection.innerHTML = "";
		bigImgSection.classList.remove("d-none")
	}
	const times = myCreateElement("button", {className: "times", innerHTML: `<i class="fas fa-times"></i>`}, bigImgSection);
	times.addEventListener('click', (e) => {
		e.preventDefault();
		bigImgSection.innerHTML = "";
		bigImgSection.classList.add("d-none")
	})

	const container = myCreateElement("div", {
		className: "container",
	}, bigImgSection);
	const row = myCreateElement("div", {
		className: "row py-4",
	}, container);

	//First col ||  Big Img
	const col1 = myCreateElement("div", {
		className: "col-md-6 col-12 left"}, row);
	myCreateElement("div", {className: "img", innerHTML: `
				<img src="${owner.imgUrl}" alt="${owner.imgTitle || ""}">
                <div class="infoPhoto">
	                <p class="title">${owner.imgTitle || ""}</p>
	                <p class="paragraph">${owner.imgInfo || ""}</p>
				</div>
	`}, col1);
	const user = myCreateElement("div", {className: "d-flex my-2 mx-4 align-items-center userProfil gap-3"}, col1);

	const img = myCreateElement("img", {className: "img-responsive", alt: owner.userName, src: owner.userImg || userDefaultImg}, user );
	myCreateElement("div", {className: "", innerHTML: `
			<h5>${owner.fullName || owner.userName}</h5>
            <p>${owner.bio || ""}</p>
	`}, user);

	img.addEventListener('click', () => {
		otherUserProfile(owner.ownerId);
		bigImgSection.innerHTML = "";
		bigImgSection.classList.add("d-none")
	})


	//Chat
	const col2 = myCreateElement("div", {
		className: "col-md-6 col-12 right",
	}, row);

	const chatBody = myCreateElement("div", {className: "chat-body",}, col2);
	const commentsArr = Object.values(comments);
	commentsArr.map(comment => {
		const messageBox = myCreateElement("div", {
			className: "messageBox",
		}, chatBody);
		if(comment.userUid === userUid){
			messageBox.classList.add("myMessage");
		}

		const userImg = myCreateElement("img", {src: comment.userImg, alt: comment.userName}, messageBox);
		const message = myCreateElement("div", {className: "message",}, messageBox);
		const userName = myCreateElement("h4", {className: "userName", innerText: comment.userName}, message);
		const messageText = myCreateElement("p", {className: "messageText", innerText: comment.message}, message);
	})

	const form = myCreateElement("form", {className: "w-100 d-flex",}, col2);
	const input = myCreateElement("input", {className: "form-control py-2", placeholder: "Commentary..."}, form);
	const send = myCreateElement("button", {className: "mx-2 btn", type: "submit", innerHTML: `<i class="fab fa-telegram"></i>`}, form);

	input.focus();
	chatBody.scrollTop = chatBody.scrollHeight;
	let messageObj = {};
	function createObj(data) {
		messageObj = {
			message: input.value,
			userName: data.userName,
			userImg: data.userImg || userDefaultImg,
			userUid: userUid,
		}
	}

	if(userUid === "notUser"){
		input.setAttribute("disabled", "disabled");
		input.placeholder = "Please register!";
		send.addEventListener('click', (e) => {
			e.preventDefault();
		})
	}else {
		send.addEventListener('click', (e) => {
			e.preventDefault();
			getUserData(userUid, createObj);
			input.focus();
			pushComment(owner.ownerId, owner.imgId, messageObj);
		})
	}
}

export { renderBigImg }