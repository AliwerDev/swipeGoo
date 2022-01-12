import { getUserData, uploadProcess, readUrl } from "./firebase.js";
import { myCreateElement } from "./functions.js";

let reader = new FileReader();

const userProfileModal = document.querySelector("#userProfileModal");
const profileMinImg = document.querySelector(".userMinImg");
const openProfile = document.querySelector("#openProfile");
const bgHideOut = document.querySelector(".bgHideOut");


function renderProfile(data) {
    console.log(data);
    profileMinImg.src = data.userImg || "http://cdn.onlinewebfonts.com/svg/img_264570.png";
    openProfile.classList.remove("d-none");
    logInBox.classList.add("d-none");
    userProfileModal.innerHTML = "";

    const profileHeader = myCreateElement("div", {classList: "d-flex align-items-center justify-content-between"}, userProfileModal);
    const backBtn = myCreateElement("button", {className: "btn closeProfile", innerHTML: `<i class="fas fa-chevron-left"></i>`}, profileHeader);
    myCreateElement("h2", {className: "p-0 m-0", innerText: "Profile"}, profileHeader);
    const menuProfile = myCreateElement("button", {className: "btn", innerHTML: `<i class="fas fa-align-right"></i>`}, profileHeader);

    const avatar = myCreateElement(`div`, {className: "avatar",}, userProfileModal);
    const userImg = myCreateElement("img", {id: "profile", className: "userImg", src: data.userImg || "http://cdn.onlinewebfonts.com/svg/img_264570.png", alt: data.userName}, avatar);
    const changeUserImg = myCreateElement("button", {className: "btn", innerHTML: `<i class="fas fa-camera"></i>`}, avatar);
    const saveUserImg = myCreateElement("button", {className: "btn d-none", innerHTML: `<i class="fas fa-check"></i>`}, avatar);
    const input = myCreateElement("input", {type: "file", className: "d-none"}, avatar);

    const progress = myCreateElement("div", {style: "height: .5rem !important", className: "progress mx-2 mb-4 w-100 d-none"}, userProfileModal);
    const progressbar = myCreateElement("div", {
        className: "progress-bar bg-dark progress-bar-striped progress-bar-animated",
        "aria-valuemin": "0",
        "aria-valuemax": "100"
    }, progress);

    const infoForm = myCreateElement("form", {className: "info",}, userProfileModal);
    const fullName = myCreateElement("input", {id: "fullName", readOnly: true, value: data.fullName || ""}, infoForm);
    const userName = myCreateElement("input", {id: "userName", readOnly: true, value: data.userName}, infoForm);

    changeUserImg.addEventListener('click', () => {
        input.click();
        saveUserImg.classList.remove("d-none");
        changeUserImg.classList.add("d-none");
    })
    input.addEventListener("change", (e) => {
        readUrl(e.target.files);
    });
    saveUserImg.addEventListener('click', () => {
        progress.classList.remove("d-none")
        uploadProcess(userImg, progress, "user");
        saveUserImg.classList.add("d-none");
        changeUserImg.classList.remove("d-none")
    })


    backBtn.addEventListener('click', () => {
        userProfileModal.classList.add("hideProfile");
        bgHideOut.classList.add("d-none");
    })
}

// `<div id="profile" class=" d-flex align-items-center justify-content-between">
//         <button class="btn closeProfile"> <i class="fas fa-chevron-left"></i> </button>
//         <p class="mt-2">Profile</p>
//         <button class="btn"> <i class="fas fa-align-right"></i> </button>
//     </div>
//     <div class="avatar">
//         <img src="" alt="user" id="imgUrl">
//         <button class="btn"> <i class="fas fa-camera"></i> </button>
//     </div>
//
//     <form class="info">
//         <p id="fullName"></p>
//         <p id="userName"></p>
//
//
//         <div>
//             <button class="btn1"><i class="fas fa-user-plus"></i></button>
//             My Group
//         </div>
//         <div>
//             <button class="btn2"><i class="far fa-images"></i></button>
//             My Gallery
//         </div>
//         <div>
//             <button class="btn3"><i class="fas fa-users"></i></button>
//             New Group
//         </div>
//     </form>`

openProfile.addEventListener('click', e => {
    e.preventDefault();
    userProfileModal.classList.remove("hideProfile");
    bgHideOut.classList.remove("d-none");
})

function isHaveUser(id) {
    getUserData(id, renderProfile);
    signUpForm.classList.add("d-none");
}

export { isHaveUser }