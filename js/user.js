import {myCreateElement, renderImgBox} from "./functions.js";
import {readUrl, uploadProcess} from "./firebase.js";

function creatAddUser(father) {
	const imgBox = myCreateElement("div", {className: "add-img img-box"}, father);
	const input = myCreateElement("input", {type: "file", className: "d-none"}, imgBox);
	const progress = myCreateElement("div", {className: "d-none w-100 progress mx-2 mb-4 w-100"}, imgBox);
	const img = myCreateElement("img", {className: "d-none"});
	const progressbar = myCreateElement("div", {
		className: "progress-bar bg-dark progress-bar-striped progress-bar-animated",
		"aria-valuemin": "0",
		"aria-valuemax": "100"
	}, progress);
	const icon = myCreateElement("i", {className: "fa fa-plus"}, imgBox);
	input.addEventListener("change", (e) => {
		readUrl(e.target.files);
		uploadProcess(img, progress);
		progress.classList.remove("d-none");
		icon.classList.add("d-none");
	});
	icon.addEventListener("click", () => {
		input.click();
	})
}
export {creatAddUser};
