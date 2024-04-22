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
 