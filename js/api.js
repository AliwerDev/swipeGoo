class PhotoGallery{
    constructor(){
        this.API_KEY = '563492ad6f917000010000011136dff132a04096b5332f206cbd5d10';
        this.galleryDIv = document.querySelector('#apiGallery');
        this.searchForm = document.querySelector('.search-form');
        this.loadMore = document.querySelector('.load-more');
        this.logo = document.querySelector("#logo")
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle(){
        document.addEventListener('DOMContentLoaded',()=>{
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e)=>{
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        // if(imgGallery.scrollTop === imgGallery.clientHeight){
        //     this.loadMoreImages(e);
        // }
        this.loadMore.addEventListener('click', (e)=>{
            this.loadMoreImages(e);
        })
        this.logo.addEventListener('click',
            () => {
                this.pageIndex = 1;

                this.galleryDIv.innerHTML = '';
                imgGallery.classList.add("d-none")
                apiGallery.classList.remove("d-none")
                this.getImg(this.pageIndex);
            })
    }
    async getImg(index){
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=30`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
    }
    async fetchImages(baseURL){
        const response = await fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
    }
    GenerateHTML(photos){
        photos.forEach(photo=>{
            const item= document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
          <a href='${photo.src.original}' target="_blank">
            <img src="${photo.src.medium}">
            <h3 href=''>${photo.photographer}</h3>
          </a>
      `;
            this.galleryDIv.appendChild(item)
        })
    }
    async getSearchedImages(e){
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        imgGallery.classList.add("d-none")
        apiGallery.classList.remove("d-none")
        imgGallery.classList.add("d-none")
        apiGallery.classList.remove("d-none")
        imgGallery.classList.add("d-none")
        apiGallery.classList.remove("d-none")
        this.galleryDIv.innerHTML='';
        const searchValue = e.target.querySelector('.search-form input').value.trim();
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
        const data = await this.fetchImages(baseURL);

        if(searchValue === "" || data.photos.length === 0){
            imgGallery.classList.add("d-none")
            apiGallery.classList.remove("d-none")
            this.galleryDIv.innerHTML = `<h3 class="text-danger text-center">Nothing found</h3>`;
            e.target.reset();
            return;
        }

        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index){
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
    }
    loadMoreImages(e){
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data-img');
        if(loadMoreData === 'curated'){
            // load next page for curated]
            this.getImg(index)
        }else{
            // load next page for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new PhotoGallery;