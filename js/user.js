import {myCreateElement} from "./functions.js";
import {readUrl, uploadProcess, pushUserImages, setImage} from "./firebase.js";

function creatAddImg(data) {
	addImgModal.classList.remove("d-none")
	addImgModal.innerHTML = "";

	const fileInput = myCreateElement("input", {
		type: "file",
		className: "d-none",
		accept: ".png, .jpg, .jpeg .svg .gif",
	}, addImgModal);

	const row = myCreateElement("div", {className: "row"}, addImgModal);
	const col1 = myCreateElement("div", {className: "col-md-6"}, row);
	const imgBox = myCreateElement("div", {className: "imgBox",}, col1);
	const img = myCreateElement("img", {className: "img-fluid w-100", src: data && data.url || addImgUrl}, imgBox);

	const col2 = myCreateElement("div", {className: "col-md-6", }, row);
	const form = myCreateElement("form", {className: "infoBox"}, col2);

	const name = myCreateElement("input", {className: "imgName", placeholder: "Img Name ...", value: data && data.title || ""}, form);
	const desc = myCreateElement("textarea", {className: "imgDesc", placeholder: "Img Desc ...", value: data && data.desc || ""}, form);

	const buttons = myCreateElement("div", {}, form)
	const submitBtn = myCreateElement("button", {className: "submitImg", innerHTML: data && "Save" || "Submit"}, buttons);
	const cancelBtn = myCreateElement("button", {className: "beck", innerHTML: `Cancel`}, buttons);

	cancelBtn.addEventListener('click', () => {
		addImgModal.classList.add("d-none");
		addImgModal.innerHTML = "";
	})

	const progress = myCreateElement("div", {className: "d-none w-100 progress mx-2 mb-4 w-100"}, imgBox);
	const progressbar = myCreateElement("div", {
		className: "progress-bar bg-dark progress-bar-striped progress-bar-animated",
		"aria-valuemin": "0",
		"aria-valuemax": "100"
	}, progress);

	fileInput.addEventListener("change", (e) => {
		readUrl(e.target.files);
		uploadProcess(img, progress);
		progress.classList.remove("d-none");
	});

	if(!data){
		img.addEventListener("click", () => {
			fileInput.click();
		});
	}else {
		fileInput.disabled = "disabled";
	}

	submitBtn.addEventListener('click', (e) => {
		e.preventDefault();
		console.log(addImgUrl);
		console.log(img.src)
		if(img.src === addImgUrl){
			submitBtn.innerHTML = "Please select Img";
		}
		else {
			const imgData = {url: img.src, ownerId: userUid, title: name.value, desc: desc.value}

			if(!data) pushUserImages(userUid, imgData);
			else {
				imgData.id = data.id;
				setImage(data.id, imgData);
			}
			alert("Post Yuklandi");
			addImgModal.classList.add("d-none")
		}
	})
}
export {creatAddImg};
