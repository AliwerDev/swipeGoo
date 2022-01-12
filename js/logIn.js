import { signIn, createUser } from "./firebase.js";
import {myCreateElement} from "./functions.js";

function creatSignInForm(father) {
	console.log("helo")
	father.innerHTML = "";
	const form = myCreateElement("form", {}, father);

	const forHeader = myCreateElement("div", {className: "form-header"}, form);
	const signInBtn = myCreateElement("button", {type: "button", className: "logBtn active", innerHTML: "Sign In"}, forHeader);
	const signUpBtn = myCreateElement("button", {type: "button", className: "logBtn", innerHTML: "Sign Up"}, forHeader);

	const email = myCreateElement("input", {type: "email", required: true , placeholder: "Email"}, form);
	const password = myCreateElement("input", {type: "password", required: true , placeholder: "Password"}, form);

	myCreateElement("button", {className: "saveBtn", type: "submit", innerHTML: "Submit"}, form);

	signUpBtn.addEventListener("click", () => {
		creatSignUpForm(father);
	});

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const userData = {
			email: email.value,
			password: password.value,
		}
		signIn(userData)
	})
}
function creatSignUpForm (father) {
	father.innerHTML = "";
	const form = myCreateElement("form", {}, father);

	const forHeader = myCreateElement("div", {className: "form-header"}, form);
	const signInBtn = myCreateElement("button", {type: "button", className: "logBtn", innerHTML: "Sign In"}, forHeader);
	const signUpBtn = myCreateElement("button", {type: "button", className: "logBtn active", innerHTML: "Sign Up"}, forHeader);

	const userName = myCreateElement("input", {required: true, placeholder: "User name"}, form);
	const fullName = myCreateElement("input", {placeholder: "Full name"}, form);
	const email = myCreateElement("input", {type: "email", required: true, placeholder: "Email"}, form);
	const password = myCreateElement("input", {type: "password", required: true, placeholder: "Password"}, form);

	myCreateElement("button",  {className: "saveBtn", type: "submit", innerHTML: "Submit"}, form);

	signInBtn.addEventListener("click", () => {
		creatSignInForm(father);
	})
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const userData = {
			email: email.value,
			fullName: fullName.value,
			userName: userName.value,
			password: password.value,
		}
		createUser(userData);
	})
}


export {creatSignUpForm, creatSignInForm};