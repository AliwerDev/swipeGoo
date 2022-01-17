const imgGallery = document.querySelector("#usersGallery");
const profileGallery = document.querySelector("#profileGallery");
const apiGallery = document.querySelector("#apiGallery");

const signUpForm = document.querySelector("#signInModal")
const logInBtn = document.querySelector('.logInBtn');
const logInBox = document.querySelector("#logInBox");
let userUid = "notUser";
const userDefaultImg = "https://thumbs.dreamstime.com/b/default-avatar-pro…ge-default-avatar-profile-flat-icon-184330869.jpg";
const addImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Icons8_flat_add_image.svg/1024px-Icons8_flat_add_image.svg.png";
let count;
let readMore = document.querySelector(".load-more")
const loading = document.querySelector(".hello");
const brand = document.querySelector(".brand-part");
const addImgModal = document.querySelector(".addImgModal");
const userAccount = document.querySelector('#userAccount');


const menuUsers = document.querySelector("#menuUsers");