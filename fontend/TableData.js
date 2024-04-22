const BASE_URL = 'http://localhost:8000'


window.onload = async () => {
   await loadData()
}

const loadData = async () => {
    console.log('loaded');
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data);

    let menu = document.querySelector('#menu-icon');
    let navlist = document.querySelector('.navlist');

    menu.onclick = ()=>{
        menu.classList.toggle('bx-x');
        navlist.classList.toggle('open');
    };

    const sr = ScrollReveal({
        distance:'65px',
        duration:2600,
        delay:450,
        reset:true
    });
    sr.reveal('.hero-text',{deplay:200,origin:'top'});
    sr.reveal('.hero-img',{deplay:450,origin:'top'});
    sr.reveal('.icons',{deplay:500,origin:'left'});
    sr.reveal('.scroll-down',{deplay:500,origin:'right'});

 
    const userDOM = document.getElementById('user')

    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname}
        <a href='index.html?id=${user.id}'><button>Edit</button></a>
        <button class ='delete' data-id='${user.id}'>Delete</button>
        <div>`
    }
    htmlData += '<div>'
    userDOM.innerHTML = htmlData

    const deleteDOMs = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() //recursive function = เรียกฟังก์ชันตัวเองซ้ำ
            } catch (error) {
                console.log(error);
            }
        })
    }
}