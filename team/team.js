const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', (e) => {
    e.preventDefault();

    if (document.body.classList.toggle('dark')) {

        discussionTeamGif.src = "../images/disgusDark.gif"


    } else {
        discussionTeamGif.src = "../images/dissgusdark.gif"


    }
})