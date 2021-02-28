import Macy from 'macy';
import { forEach } from '@stereorepo/sac';
import loadImage from 'image-promise';

// Infinite load author: Cadu de Castro Alves
// GitHub: https://github.com/castroalves

const loadContent = () => {
    let portfolio = document.querySelector('#portfolio');
    let btnLoadMore = document.querySelector('#load-more');

    if(!portfolio || !btnLoadMore) return;

    // Private Properties
    let postsLoaded = true;
    let startPage = 2;
    const loaderPics = document.getElementById('loader-pics');

    // Macy layout
    const macy = Macy({
        container: '#portfolio',
        trueOrder: false,
        waitForImages: true,
        margin: 0,
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1100: 3,
            800: 2
        }
    });

    // Popin
    const popin = document.getElementById('popin');
    const popinContent = popin.querySelector('#popin-content');
    const popinClose = popin.querySelector('#popin-close');
    const popinNext = popin.querySelector('#popin-next');
    const popinPrev = popin.querySelector('#popin-prev');
    const loader = popin.querySelector('#loader');
    let currentPic = 0;
    let imgLoading = false;

    // Builds the API URL with params _embed, per_page, and page
    const getApiUrl = () => {
        let apiUrl = new URL(window.location.origin + '/wp-json/wp/v2/photo');

        apiUrl.search = new URLSearchParams({
            _embed: true,
            page: startPage,
            per_page: 9
        }).toString();

        return apiUrl;
    };

    // Display image in popin
    const resolvePopin = (link, img) => {
        popinContent.appendChild(img);
        loader.classList.remove('on');

        currentPic === 0 ? popinPrev.setAttribute('disabled', true) : popinPrev.removeAttribute('disabled');
        
        imgLoading = false;
    }

    // Popin loader
    const loadingPopin = () => {
        document.documentElement.classList.add('no-scroll');
        popin.classList.add('on');
        loader.classList.add('on');
        popinContent.innerHTML = '';
    };

    // Load the popin
    const loadPopin = async link => {
        if(imgLoading) return;

        const img = document.createElement('img');
        imgLoading = true;
        img.src = link.href;

        currentPic = Array.prototype.slice.call(portfolio.children).indexOf(link.parentNode);

        loadImage(img)
            .then(img => {
                resolvePopin(link, img);
            })
            .catch(() => {
                console.error('Image failed to load :(');
            });
    };

    // Popin events
    const addPopinEvents = () => {
        forEach(document.getElementsByClassName('pic-link'), link => {
            link.classList.remove('off');
            link.addEventListener('click', e => {
                e.preventDefault();
                loadingPopin();
                loadPopin(link);
            }, false);
        });
    };

    const nextPic = lastPic => {
        const pics = document.getElementsByClassName('pic');
        const nextPic = lastPic ? pics[0] : pics[currentPic + 1];

        loadingPopin();
        
        if (nextPic) {
            loadPopin(nextPic.querySelector('.pic-link'));
        } else {
            loadPics(true);
        }
    };

    const prevPic = () => {
        const pics = document.getElementsByClassName('pic');
        const prevPic = pics[currentPic - 1];

        loadingPopin();

        if (prevPic) loadPopin(prevPic.querySelector('.pic-link'));
    };

    // Builds the HTML to show all posts
    const renderPostHtml = posts => {
        let postHtml = '';

        for (let post of posts) {
            postHtml += `
                <div class="pic">
                    <a href="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-link off">
                        <img src="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-img pic-new" />
                        <p class="pic-text">${post.title.rendered}</p>
                    </a>
                </div>`;
        }

        return postHtml;
    };

    // Make a request to the REST API
    const loadPics = async loadFromPopin => {
        if(postsLoaded === false) return;

        postsLoaded = false;

        loaderPics.classList.add('on');
        portfolio.classList.add('off');

        const url = getApiUrl();
        const request = await fetch(url);

        if (request.status === 200) {
            const posts = await request.json();

            if (!posts.length) return;

            // Builds the HTML to show the posts
            const postsHtml = renderPostHtml(posts);

            // Adds the HTML into the posts div
            portfolio.innerHTML += postsHtml;

            // Add popin events
            addPopinEvents();

            loadImage(portfolio.querySelectorAll('.pic-new'))
                .then(allImgs => {
                    allImgs.map(img => img.classList.remove('pic-new'));
                    macy.recalculate(true, true);
                    
                    // Call again next pic in popin if loading pics was made from popin
                    if (loadFromPopin) nextPic(false);

                    // Required for the infinite scroll
                    postsLoaded = true;

                    // Increase every time content is loaded
                    ++startPage;
                })
                .catch(err => {
                    console.error('One or more images have failed to load :( ', err.errored);
                    console.info('But these loaded fine: ', err.loaded);
                });
        } else if (request.status === 400) {
            // Start over at begining of pics in popin if loading pics was made from popin
            if (loadFromPopin) nextPic(true);
        }

        loaderPics.classList.remove('on');
        portfolio.classList.remove('off');
    };

    // Add popin events
    addPopinEvents();

    // Popin events
    popinClose.addEventListener('click', e => {
        e.stopImmediatePropagation();
        document.documentElement.classList.remove('no-scroll');
        popin.classList.remove('on');
    }, false);

    popinNext.addEventListener('click', e => {
        e.target.blur();
        nextPic(false);
    }, false);
    popinPrev.addEventListener('click', e => {
        e.target.blur();
        prevPic(false);
    }, false);

    // Where the magic happens
    // Checks if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const loadMoreCallback = (entries, observer) => {
            entries.forEach(btn => {
                if (btn.isIntersecting) loadPics();
            });
        };

        let loadMoreObserver = new IntersectionObserver(loadMoreCallback, {
            threshold: 0.1
        });
        
        loadMoreObserver.observe(btnLoadMore);
    }
};

export default loadContent;
