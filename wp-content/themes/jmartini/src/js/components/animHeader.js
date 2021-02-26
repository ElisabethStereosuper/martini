const animHeader = () => {
    const wWidth = window.innerWidth;
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    if (wWidth > 580 || !header || !footer) return;

    let lastScrollPos = 0;
    let tick = false;

    const animInfos = () => {
        if (window.scrollY > lastScrollPos){
            header.classList.add('up');
            footer.classList.add('down');
        }else{
            header.classList.remove('up');
            footer.classList.remove('down');
        }

        lastScrollPos = window.scrollY;
        tick = false;
    };

    window.addEventListener('scroll', () => {
        if (tick) return;
        
        window.requestAnimationFrame(animInfos);
        tick = true;
    });
};

export default animHeader;
