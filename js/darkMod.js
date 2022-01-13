const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', (e)=>{
    e.preventDefault();
    document.body.classList.toggle('dark');
    // document.querySelector("header").style.backgroundColor = "#353b48";
})