import { getUserData, uploadProcess, readUrl, signOutUser, getUserImages } from "./firebase.js";
import { myCreateElement, renderImgBox } from "./functions.js";
import {creatAddUser} from "./user.js";

let reader = new FileReader();

const userProfileModal = document.querySelector("#userProfileModal");
const profileMinImg = document.querySelector(".userMinImg");
const openProfile = document.querySelector("#openProfile");
const bgHideOut = document.querySelector(".bgHideOut");


function renderProfile(data) {
    profileMinImg.src = data.userImg || userDefaultImg;
    openProfile.classList.remove("d-none");
    logInBox.classList.add("d-none");
    userProfileModal.innerHTML = "";

    const profileHeader = myCreateElement("div", {classList: "d-flex align-items-center justify-content-between"}, userProfileModal);
    const backBtn = myCreateElement("button", {
        className: "btn closeProfile",
        innerHTML: `<i class="fas fa-chevron-left"></i>`
    }, profileHeader);
    myCreateElement("h2", {className: "p-0 m-0", innerText: "Profile"}, profileHeader);
    const menuProfile = myCreateElement("div", {className: "dropdown btn-group"}, profileHeader);
    const menuProfileBtn = myCreateElement("button", {
        className: "btn",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "true",
        id: "dropdownMenuButton1",
    }, menuProfile);
    const imenu = myCreateElement("i", {className: "fas fa-align-right"}, menuProfileBtn)
    const ulMenu = myCreateElement("ul", {
        className: "dropdown-menu show d-none" ,
        "aria-labelledby": "dropdownMenuButton1",
        style: "position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 38px, 0px);",
        "data-popper-placement": "bottom-end",
    }, menuProfileBtn)
    window.addEventListener("click", (e) => {
        if(e.target === menuProfileBtn || e.target === imenu){
            ulMenu.classList.toggle("d-none");
        }else{
            ulMenu.classList.add("d-none");
        }
    })
    const myGallery = myCreateElement("button", {
        className: "dropdown-item",
        innerHTML: `<i class="far fa-images"></i> My Gallery`,
    }, myCreateElement("li", {}, ulMenu));

    myGallery.addEventListener('click', () => {
        imgGallery.innerHTML = "";
        getUserImages(userUid, renderImgBox);
    })

    const signOutBtn = myCreateElement("button", {
        className: "dropdown-item",
        innerHTML: `<i class="fas fa-sign-out-alt me-2"></i> Sign out`,
    }, myCreateElement("li", {}, ulMenu));

    signOutBtn.addEventListener("click", () => {
        signOutUser((res) => {
            if (res) {
                window.location.reload();
            }
        });
    })

    const avatar = myCreateElement(`div`, {className: "avatar",}, userProfileModal);
    const userImg = myCreateElement("img", {
        id: "profile",
        className: "userImg",
        src: data.userImg || userDefaultImg,
        alt: data.userName
    }, avatar);
    const changeUserImg = myCreateElement("button", {
        className: "btn",
        innerHTML: `<i class="fas fa-camera"></i>`
    }, avatar);
    const saveUserImg = myCreateElement("button", {
        className: "btn d-none",
        innerHTML: `<i class="fas fa-check"></i>`
    }, avatar);
    const input = myCreateElement("input", {type: "file", className: "d-none"}, avatar);

    const progress = myCreateElement("div", {
        style: "height: .5rem !important",
        className: "progress mx-2 mb-4 w-100 d-none"
    }, userProfileModal);
    const progressbar = myCreateElement("div", {
        className: "progress-bar bg-dark progress-bar-striped progress-bar-animated",
        "aria-valuemin": "0",
        "aria-valuemax": "100"
    }, progress);

    const infoForm = myCreateElement("form", {className: "info",}, userProfileModal);
    const fullName = myCreateElement("input", {id: "fullName", readOnly: true, value: data.fullName || ""}, infoForm);
    const userName = myCreateElement("input", {id: "userName", readOnly: true, value: data.userName}, infoForm);

    creatAddUser(userProfileModal)

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