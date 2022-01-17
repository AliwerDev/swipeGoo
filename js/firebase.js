import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {isHaveUser} from "./profile.js"
import {allImages} from "./functions.js";
import {get,update, getDatabase, onValue, ref, set, push, remove} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

import {
	getDownloadURL,
	getStorage,
	ref as sRef,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";

const firebaseConfig = {
	apiKey: "AIzaSyBODtPdwQqurj89ErjwkcaEkVc2wVkTt-I",
	authDomain: "swipe-a8e56.firebaseapp.com",
	databaseURL: "https://swipe-a8e56-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "swipe-a8e56",
	storageBucket: "swipe-a8e56.appspot.com",
	messagingSenderId: "498897302123",
	appId: "1:498897302123:web:8e1451a9290fcaf415f72e",
	measurementId: "G-QPZR5BR575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const auth = getAuth();

//Upload img to profile

let reader = new FileReader();

const state = { files: [] };

const GetFileExt = (file) => {
	console.log(file);
	let temp = file.name.split(".");
	let ext = temp.slice(temp.length - 1, temp.length);
	return "." + ext;
};

const GetFileName = (file) => {
	let temp = file.name.split(".");
	return temp.slice(0, -1).join(".");
};


function uploadProcess(img, progressbar, user) {
	let ImgToUpload = state.files[0];
	let ImgName = GetFileName(state.files[0]) + GetFileExt(state.files[0]);

	console.log(ImgName);

	const storage = getStorage();
	const UploadTask = uploadBytesResumable(
		sRef(storage, "images/" + ImgName),
		ImgToUpload
	);

	UploadTask.on(
		"state_changed",
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			progressbar.children[0].style.width =  (progress + "%");
		},
		() => {
			alert("error : image not uploaded!");
		},
		() => {
			getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
				img.src = downloadURL;
				if(user) {
					pushUserImg(userUid, downloadURL);
				}
				progressbar.classList.add("d-none")
			});
		}
	);
}
function func(){
	getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
		img.src = downloadURL;
		if(user) {
			pushUserImg(userUid, downloadURL);
		}
		progressbar.classList.add("d-none")
	});
}

function readUrl (file) {
	state.files = file;
	reader.readAsDataURL(state.files[0]);
}

function pushUserImg(id, url){
	set(ref(db, 'users/' + id + "/userImg"), url)
		.then((ref) => {
			console.log(ref)
		})
		.catch(err => console.log(err));
}

function countUserImages(id, img, callback){
	get(ref(db, 'users/' + id + "/count"))
		.then((ref) => {
			callback(id, img, ref.val())
		})
		.catch(err => console.log(err));
}


export function pushUserImages(id, img){
	countUserImages(id, img, pushUserImagesResult);
}

function pushUserImagesResult(id, img, count) {
	img.id = ++count;
	img.date = (new Date()).getTime()
	set(ref(db, `users/${id}/images/${count}`), img)
		.then(() => {
			console.log('img  qushildi')
		})
		.catch(err => console.log(err));
	set(ref(db, `users/${id}/count`), count)
		.then(() => {
			console.log('count oshdi');
		})
		.catch(err => console.log(err));
}

function setImage (id, img){
	set(ref(db, 'users/' + userUid + "/images/" + id), img)
		.then(() => {
		})
		.catch(err => console.log(err));
}

function deleteImg(ownerId, imgId) {
	remove(ref(db, `users/${ownerId}/images/${imgId}`));
}

function addUser(userData){
	set(ref(db, 'users/' + userData.uid), userData)
		.then(() => {
		})
		.catch(err => console.log(err));
	set(ref(db, 'users/' + userData.uid + "/count"), "0")
		.then((ref) => {
			console.log(ref)
		})
		.catch(err => console.log(err));
}

function updateProfile(uid, data) {
	set(ref(db, 'users/' + uid + "/userName"), data.userName)
		.then(() => {
		})
		.catch(err => console.log(err));
	set(ref(db, 'users/' + uid + "/fullName"), data.fullName)
		.then(() => {
		})
		.catch(err => console.log(err));
	set(ref(db, 'users/' + uid + "/userBio"), data.userBio)
		.then(() => {
		})
		.catch(err => console.log(err));
}

function createUser (userData) {
	createUserWithEmailAndPassword(auth, userData.email, userData.password)
		.then((cred) => {
			const userData2 = userData;
			userData2.uid = cred.user.uid;
			isHaveUser(cred.user.uid);
			userUid = cred.user.uid;
			addUser(userData2)

			// window.location = "index.html";
		})
		.catch(e => {
			console.log(e)
		})
}

//isFollowed
function isFollowFirebase(id, owner, callback){
	get(ref(db, `users/${id}/following/`))
		.then((ref) => callback(ref.val() || {}))
		.catch((err) => console.log(err))
}

//edit Follow
function editFollow(id, owner, bool = false){
	if(bool){
		remove(ref(db, `users/${id}/following/${owner}`))
		remove(ref(db, `users/${owner}/followers/${id}`))
	}
	else{
		set(ref(db, `users/${id}/following/${owner}`), "true")
			.then(() => {
			})
			.catch(err => console.log(err));
		set(ref(db, `users/${owner}/followers/${id}`), "true")
			.then(() => {
			})
			.catch(err => console.log(err));
	}
}

function signIn(dataUser) {
	signInWithEmailAndPassword(auth, dataUser.email, dataUser.password)
		.then((cred) => {
			isHaveUser(cred.user.uid);
			userUid = cred.user.uid;
		})
		.catch(() => {
			alert("parol yoki email xato");
		});
}
const isSignIn = (callback = () => {}) => {
	console.log("sign in boshlandi")
	onAuthStateChanged(auth, (user) => {
		if (user) {
			const uid = user.uid;
			console.log("sign in bulgan")
			callback(uid);
		} else {
			console.warn("no sign in");
		}
	});
};
isSignIn((uid) => {
	isHaveUser(uid);
	userUid = uid;
});

function getUserImages(id, callback) {
	onValue(ref(db, `users/${id}/images/`), (data) => {
		callback(data.val() || {});
	})
}

function getUserData(id, callback){
	onValue(ref(db, `users/${id}`), (data) => {
		callback(data.val() || {});
	})
}
function getUserData2(id, callback){
	get(ref(db, `users/${id}`))
		.then((ref) => callback(ref.val()))
		.catch(err => console.log(err))
}

function getUsers (callback) {
	onValue(ref(db, 'users/'), (data) => {
		callback(data.val() || {});
	})
}
getUsers(allImages);


function signOutUser (callback = () => {}) {
	signOut(auth)
		.then(() => {
			callback(true);
			console.log("user Chiqib ketti")
		})
		.catch(() => {
			callback(false);
			console.log("user chiqib keta olmadi")
		});
}

function getLikes (uid, id, callback){
	onValue(ref(db, `users/${uid}/images/${id}/likes`), (data) => {
		callback(data.val() || {});
	})
}

function pushLike(uid, id, likeId) {
	set(ref(db, `users/${uid}/images/${id}/likes/${likeId}`), likeId)
		.then(() => {
		})
		.catch(err => console.log(err));
}
function removeLike(uid, id, likeId){
	remove(ref(db, `users/${uid}/images/${id}/likes/${likeId}`))
		.then(() => {
		})
		.catch(err => console.log(err));
}

//Comments
function getComments(ownerId, id, callback, owner){
	onValue(ref(db, `users/${ownerId}/images/${id}/comments`), (data) => {
		callback(data.val() || {}, owner);
	})
}

function pushComment(ownerId, id, message) {
	push(ref(db, `users/${ownerId}/images/${id}/comments/`), message)
		.then((ref) => {
			console.log(ref)
		})
		.catch(err => console.log(err));
}

export { getUserData2, editFollow, isFollowFirebase, setImage, updateProfile, getComments, deleteImg,  pushComment, signOutUser, createUser, signIn, getUsers, getUserImages, getUserData, uploadProcess, readUrl, getLikes, pushLike, removeLike}



