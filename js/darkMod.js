const checkbox = document.getElementById('checkbox');
const logoImg = document.querySelector('#logo');
const girlImg = document.querySelector('#girl-photo');
const discussionTeamGif = document.querySelector('#discussionTeamGif')

checkbox.addEventListener('change', (e) => {
    e.preventDefault();
    if (document.body.classList.toggle('dark')) {
        logoImg.src = './images/blac-logo.svg';
        girlImg.src = './images/animation_b.gif';
        discussionTeamGif.src = ''
        discussionTeamGif.src = "./images/disgusDark.gif"

    } else {
        logoImg.src = './images/swipegoLogo.svg';
        girlImg.src = './images/animation_white.gif';
        discussionTeamGif.src = "./images/dissgusdark.gif"


    }
})