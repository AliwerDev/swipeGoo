import { myCreateElement } from "./functions.js";
import {getUserData, pushComment} from "./firebase.js";

const renderBigImg = (comments, owner) => {
	const container = myCreateElement("div", {
		className: "container",
	}, myCreateElement("section", {id: "chat"}, document.querySelector("body")));
	const row = myCreateElement("div", {
		className: "row py-4",
	}, container);

	//First col ||  Big Img
	myCreateElement("div", {
		className: "col-md-6 col-12 left",
		innerHTML: `
			<div class="img">
                <img src="${owner.imgUrl}" alt="${owner.imgTitle || ""}">
                <div class="paragraph"><p>${owner.ImgInfo || ""}</p></div>
             </div>
             <div class="d-flex my-2 mx-4 align-items-center userProfil gap-3" >
                <img class="img-responsive" src="${owner.userImg}" alt="userimg">
                <div>
                  	<h5>${owner.fullName || owner.userName}</h5>
                  	<p>${owner.bio || ""}</p>
                </div>
            </div>
`
	}, row);
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

	let messageObj = {};
	function createObj(data) {
		messageObj = {
			message: input.value,
			userName: data.userName,
			userImg: data.userImg || userDefaultImg,
			userUid: userUid,
		}
	}

	send.addEventListener('click', (e) => {
		e.preventDefault();
		getUserData(userUid, createObj);

		pushComment(owner.ownerId, owner.imgId, messageObj);
	})
}

export { renderBigImg }