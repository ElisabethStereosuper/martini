import Macy from 'macy';
import { forEach } from '@stereorepo/sac';
import loadImage from 'image-promise';

// Infinite load author: Cadu de Castro Alves
// GitHub: https://github.com/castroalves

const loadContent = () => {
    let portfolio = document.querySelector('#portfolio');
    let btnLoadMore = document.querySelector('#load-more');

    if (!portfolio || !btnLoadMore) return;

    const loaderPics = document.getElementById('loader-pics');
    let postsLoaded = true;
    let startPage = 1;
    let wWidth = window.innerWidth;
    let nbPosts = wWidth >= 580 ? 9 : 2;
    let tick = false;
    
    // Macy layout
    let macy = false;

    // Popin
    let popinEventsAdded = false;
    let popin, popinContent, popinClose, popinNext, popinPrev, loader;
    let currentPic = 0;
    let imgLoading = false;

    // Builds the API URL with params _embed, per_page, and page
    const getApiUrl = () => {
        let apiUrl = new URL(window.location.origin + '/wp-json/wp/v2/photo');

        apiUrl.search = new URLSearchParams({
            //_embed: true,
            page: startPage,
            per_page: nbPosts,
            sort_column: 'menu_order'
        }).toString();

        return apiUrl;
    };

    // Display image in popin
    const resolvePopin = (link, img) => {
        popinContent.appendChild(img);
        loader.classList.remove('on');

        currentPic === 0 ? popinPrev.setAttribute('disabled', true) : popinPrev.removeAttribute('disabled');
        imgLoading = false;
    };

    // Popin loader
    const loadingPopin = () => {
        document.documentElement.classList.add('no-scroll');
        popin.classList.add('on');
        loader.classList.add('on');
        popinContent.innerHTML = '';
    };

    // Load the popin
    const loadPopin = async link => {
        if (imgLoading) return;

        const img = document.createElement('img');
        imgLoading = true;
        img.src = link.href;

        currentPic = Array.prototype.slice.call(portfolio.children).indexOf(link.parentNode);

        loadImage(img)
            .then(img => resolvePopin(link, img))
            .catch(() => console.error('Image failed to load :('));
    };

    // Popin events
    const addPopinEvents = () => {
        forEach(document.getElementsByClassName('pic-link'), link => {
            link.addEventListener(
                'click',
                e => {
                    e.preventDefault();

                    if (wWidth < 580) return;
                    loadingPopin();
                    loadPopin(link);
                },
                false
            );
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
                    <a href="${post.featured_media_url}" class="pic-link off">
                        <img src="${post.featured_media_large_url}" class="pic-img pic-new" />
                    </a>
                </div>`;
        }

        return postHtml;
    };

    // Make a request to the REST API
    const loadPics = async loadFromPopin => {
        if (!postsLoaded) return;

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

            const imgs = portfolio.querySelectorAll('.pic-new');

            loadImage(imgs)
                .then(allImgs => {
                    if(macy) macy.recalculate();

                    allImgs.map(img => {
                        img.classList.remove('pic-new');
                        img.parentNode.classList.remove('off');
                    });

                    // Call again next pic in popin if loading pics was made from popin
                    if (loadFromPopin) nextPic(false);

                    // Add popin events
                    addPopinEvents();

                    // Required for the infinite scroll
                    postsLoaded = true;

                    // Increase every time content is loaded
                    ++startPage;

                    loaderPics.classList.remove('on');
                    portfolio.classList.remove('off');
                })
                .catch(err => {
                    console.error('One or more images have failed to load :( ', err.errored);
                    console.info('But these loaded fine: ', err.loaded);
                });
        } else if (request.status === 400) {
            // Start over at begining of pics in popin if loading pics was made from popin
            if (loadFromPopin) nextPic(true);

            loaderPics.classList.remove('on');
            portfolio.classList.remove('off');
        }
    };

    const handlePopin = () => {
        popin = document.getElementById('popin');
        popinContent = popin.querySelector('#popin-content');
        popinClose = popin.querySelector('#popin-close');
        popinNext = popin.querySelector('#popin-next');
        popinPrev = popin.querySelector('#popin-prev');
        loader = popin.querySelector('#loader');
        currentPic = 0;
        imgLoading = false;

        popinClose.addEventListener(
            'click',
            e => {
                e.stopImmediatePropagation();
                document.documentElement.classList.remove('no-scroll');
                popin.classList.remove('on');
                if(macy) macy.recalculate();
            },
            false
        );

        popinNext.addEventListener(
            'click',
            e => {
                e.target.blur();
                nextPic(false);
            },
            false
        );
        popinPrev.addEventListener(
            'click',
            e => {
                e.target.blur();
                prevPic(false);
            },
            false
        );

        popinEventsAdded = true;
    };

    // Desktop layout
    const launchDesktopLayout = () => {
        if(!macy){
            macy = Macy({
                container: '#portfolio',
                waitForImages: false,
                useOwnImageLoader: true,
                columns: 1,
                margin: 0,
                mobileFirst: true,
                useImageLoader: false,
                breakAt: {
                    1100: 3,
                    800: 2
                }
            });
        }

        if (!popinEventsAdded){
            handlePopin();
        }
    }
    
    if (wWidth >= 580) launchDesktopLayout();

    // First load
    loadPics();

    // Where the magic happens
    // Checks if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const loadMoreCallback = entries => {
            entries.forEach(btn => {
                if (btn.isIntersecting) loadPics();
            });
        };

        let loadMoreObserver = new IntersectionObserver(loadMoreCallback, {
            threshold: 0.1
        });
        loadMoreObserver.observe(btnLoadMore);
    }

    // Resize
    window.addEventListener('resize', () => {
        if (tick) return;
        window.requestAnimationFrame(() => {
            wWidth = window.innerWidth;
            if (wWidth >= 580) launchDesktopLayout();
            tick = false;
        });
        tick = true;
    });
};

export default loadContent;
