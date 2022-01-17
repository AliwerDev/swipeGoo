const checkbox = document.getElementById('checkbox');
const aboutUs1 = document.getElementById('aboutUs1')
const aboutUs2 = document.getElementById('aboutUs2')
checkbox.addEventListener('change', (e) => {
    e.preventDefault();


    if (document.body.classList.toggle('dark')) {

        aboutUs1.src = "../images/about1.gif"
        aboutUs2.src = "../images/about2.gif"


    } else {
        aboutUs1.src = "../images/emotions.gif"
        aboutUs2.src = "../images/fast-chat.gif"


    }
})