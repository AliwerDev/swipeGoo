import { creatSignInForm } from "./logIn.js";

logInBtn.addEventListener('click', () => {
	signUpForm.classList.remove("d-none")
	creatSignInForm(signUpForm);
})