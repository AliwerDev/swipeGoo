import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import {isHaveUser} from "./profile.js"
import {get, getDatabase, onValue, ref, set, push, remove} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

import {
	createUserWithEmailAndPassword,
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
	apiKey: "AIzaSyBgBEDP_NfB0wgRFII4BJl6-JnXJFPJGZ0",
	authDomain: "wiipc-8ef19.firebaseapp.com",
	databaseURL: "https://wiipc-8ef19-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "wiipc-8ef19",
	storageBucket: "wiipc-8ef19.appspot.com",
	messagingSenderId: "834950905356",
	appId: "1:834950905356:web:8c7b62bf37e97c9f223829",
	measurementId: "G-V9B21FE615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
				console.log(downloadURL);
				img.src = downloadURL;
				if(user) {
					pushUserImg(userUid, downloadURL);

				}else{
					pushUserImages(userUid, {url: downloadURL, ownerId: userUid});
					console.log("imaages add")
				}
				progressbar.classList.add("d-none")
			});
		}
	);
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


function pushUserImages(id, img){
	countUserImages(id, img, pushUserImagesResult);
}

function pushUserImagesResult(id, img, count) {
	img.id = ++count;
	set(ref(db, `users/${id}/images/${count}`), img)
		.then((ref) => {
			alert('img  qushildi')
		})
		.catch(err => console.log(err));
	set(ref(db, `users/${id}/count`), count)
		.then((ref) => {
			console.log('count oshdi');
		})
		.catch(err => console.log(err));
}

function addUser(userData){
	set(ref(db, 'users/' + userData.uid), userData)
		.then((ref) => {
		})
		.catch(err => console.log(err));
	set(ref(db, 'users/' + userData.uid + "/count"), "0")
		.then((ref) => {
			console.log(ref)
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

function signIn(dataUser) {
	signInWithEmailAndPassword(auth, dataUser.email, dataUser.password)
		.then((cred) => {
			isHaveUser(cred.user.uid);
			userUid = cred.user.uid;
		})
		.catch((err) => {
			alert("parol yoki email xato");
		});
}

// function getUserImages(id, callback) {
// 	onValue(ref(db, `users/${id}/images/`), (data) => {
// 		callback(data.val() || {});
// 	})
// }
function getUserImages(id, callback) {
	let user = false;
	if(id === userUid){
		user = true;
	}
	onValue(ref(db, `users/${id}/images/`), (data) => {
		callback(data.val() || {}, user);
	})
}

function getUserData(id, callback){
	onValue(ref(db, `users/${id}`), (data) => {
		callback(data.val() || {});
	})
}

function getUsers (callback) {
	onValue(ref(db, 'users/'), (data) => {
		callback(data.val() || {});
	})
}


function signOutUser (email, password) {
	signOut(auth, email, password)
		.then((cred) => {
			console.log('foydalanuvchi tark etdi');
			if (cred) console.log(cred.user);
		})
}

function getLikes (uid, id, callback){
	onValue(ref(db, `users/${uid}/images/${id}/likes`), (data) => {
		callback(data.val() || {});
	})
}

function pushLike(uid, id, likeId) {
	set(ref(db, `users/${uid}/images/${id}/likes/${likeId}`), likeId)
		.then((ref) => {
			console.log(ref)
		})
		.catch(err => console.log(err));
}
function removeLike(uid, id, likeId){
	remove(ref(db, `users/${uid}/images/${id}/likes/${likeId}`))
		.then((ref) => {
			console.log(ref)
		})
		.catch(err => console.log(err));
}

export { createUser, signIn, getUsers, getUserImages, getUserData, uploadProcess, readUrl, getLikes, pushLike, removeLike}



