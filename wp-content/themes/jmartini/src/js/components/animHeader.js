const animHeader = () => {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    if (!header || !footer) return;

    let wWidth = window.innerWidth;
    let lastScrollPos = 0;
    let tick = false;
    let tickResize = false;

    const animInfos = () => {
        if (wWidth < 580){
            if (window.scrollY > lastScrollPos) {
                header.classList.add('up');
                footer.classList.add('down');
            } else {
                header.classList.remove('up');
                footer.classList.remove('down');
            }
        }else{
            header.classList.remove('up');
            footer.classList.remove('down');
        }

        lastScrollPos = window.scrollY;
        tick = false;
        tickResize = false;
    };

    window.addEventListener('scroll', () => {
        if (tick) return;
        window.requestAnimationFrame(animInfos);
        tick = true;
    });

    window.addEventListener('resize', () => {
        if (tickResize) return;
        window.requestAnimationFrame(() => {
            wWidth = window.innerWidth;
            animInfos();
        });
        tickResize = true;
    });
};

export default animHeader;
