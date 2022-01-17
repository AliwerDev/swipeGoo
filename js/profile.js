import {getUserData, uploadProcess, readUrl, signOutUser, getUserImages, updateProfile} from "./firebase.js";
import {myCreateElement, openProfileGallery, otherUserProfile, renderImgBox} from "./functions.js";
import {creatAddImg} from "./user.js";
import { followingArr, followersArr } from "./aside.js"

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

    menuUsers.innerHTML = "";
    followingArr(data.following || {})
    followersArr(data.followers || {})

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
        openProfileGallery();
        otherUserProfile(userUid)
    });

    const editProfileBtn = myCreateElement("button", {
        className: "dropdown-item",
        innerHTML: `<i class="fas fa-user-edit"></i> Edit Profile`,
    }, myCreateElement("li", {}, ulMenu))

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
    const fullName = myCreateElement("input", {id: "fullName",placeholder: "Full name", className: "w-100", readOnly: true, value: data.fullName || "Full Name"}, infoForm);
    const userName = myCreateElement("input", {id: "userName",placeholder: "User name", required: true, className: "w-100", readOnly: true, value: data.userName}, infoForm);
    const userBio = myCreateElement("input", {id: "userBio",placeholder: "Bio", required: true, className: "w-100", readOnly: true, value: data.userBio || "Bio"}, infoForm);

    //Edit Profile
    editProfileBtn.addEventListener('click', () => {
        fullName.readOnly = false;
        fullName.focus();
        userName.readOnly = false;
        userBio.readOnly = false;

        const saveBtn = myCreateElement("button", {className: "updateProfile btn btn-primary", innerHTML: `<i class="fas fa-check"></i>`}, infoForm);

        saveBtn.addEventListener('click', () => {
            fullName.readOnly = true;
            userName.readOnly = true;
            userBio.readOnly = true;

            const data = {
                fullName: fullName.value,
                userName: userName.value,
                userBio: userBio.value,
            }

            updateProfile(userUid, data);
            saveBtn.remove();
        })
    })

    const addNewImg = myCreateElement("div", )

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
    });

    backBtn.addEventListener('click', () => {
        userProfileModal.classList.add("hideProfile");
        bgHideOut.classList.add("d-none");
    });


    //Add Img
    const addImgBox = myCreateElement("div", {className: "addPhotoBox"}, userProfileModal )
    const addImgBtn = myCreateElement("button", {className: "addImgButton", innerHTML: `<i class="fas fa-plus"></i> Add Img To Gallery`}, addImgBox);

    addImgBtn.addEventListener('click', () => {
        userProfileModal.classList.add("hideProfile");
        bgHideOut.classList.add("d-none");
        creatAddImg();
    });
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