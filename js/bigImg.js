import { myCreateElement } from "./functions.js";

const renderBigImg = (data, owner, father) => {
	const container = myCreateElement("div", {
		className: "container",
	}, myCreateElement("section", {id: "chat"}, father));
	const row = myCreateElement("div", {
		className: "row py-4",
	}, container);

	//First col ||  Big Img
	myCreateElement("div", {
		className: "col-md-6 col-12 left",
		innerHTML: `
			<div class="img">
                <img src="${data.url}" alt="${data.title}">
                <div class="paragraph"><p>${data.paragraph}</p></div>
             </div>
             <div class="d-flex my-2 mx-4 align-items-center userProfil gap-3" >
                <img class="img-responsive" src="${owner.userImg}" alt="userimg">
                <div>
                  	<h5>${owner.fullName || owner.userName}</h5>
                  	<p>${owner.bio || ""}</p>
                </div>
            </div>
`
	}, row);

	//Chat
	const col2 = myCreateElement("div", {
		className: "col-md-6 col-12 right",
	}, row);

}

`<section id="chat">
   <div class="container">
              <div class="row p-4 ">
                <div class="col-md-6 col-12 left ">
                  <div class="img">
                    <img src="https://images.wallpaperscraft.com/image/single/trees_snow_winter_238021_3840x2160.jpg" alt="images">
                    <div class="paragraph"><p>danfsjfsnnfdin</p></div>
                  </div>
                  <div class="d-flex my-2 mx-4 align-items-center userProfil gap-3" >
                    <img class="img-responsive" src="https://www.pngkit.com/png/detail/429-4297972_search-log-in-to-your-teach-california-account.png" alt="userimg">
                    <div>
                      <h5>User Fullname</h5>
                      <p>text about user profile</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-12 right ">
                  <form action="" class="w-100 d-flex">
                    <input  type="text" class="form-control py-2" placeholder="Message...">
                    <button  type="submit" class="mx-2 btn">
                      <i class="fab fa-telegram"></i>
                    </button>
                  </form>
                </div>
              </div>
          </div>
 </section>`

export { renderBigImg }