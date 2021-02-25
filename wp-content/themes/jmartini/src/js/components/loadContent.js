import Macy from 'macy';
import { forEach } from '@stereorepo/sac';

// Infinite load author: Cadu de Castro Alves
// GitHub: https://github.com/castroalves

const loadContent = () => {
    // Basic Configuration
    const config = {
        api: window.location.origin + '/wp-json/wp/v2/photo',
        startPage: 2,
        postsPerPage: 9
    };

    // Private Properties
    let postsLoaded = true;
    let portfolio = document.querySelector('#portfolio');
    let btnLoadMore = document.querySelector('#load-more');

    // Macy layout
    const macy = Macy({
        container: '#portfolio',
        trueOrder: false,
        waitForImages: true,
        margin: 0,
        columns: 1,
        mobileFirst: true,
        breakAt: {
            980: 3,
            700: 2
        }
    });

    // Popin
    const popin = document.getElementById('popin');
    const popinContent = popin.querySelector('#popin-content');
    const popinClose = popin.querySelector('#popin-close');
    const popinNext = popin.querySelector('#popin-next');
    const popinPrev = popin.querySelector('#popin-prev');
    let currentPic;

    // Pop the popin
    const loadPopin = link => {
        const img = document.createElement('img');
        
        img.src = link.href;

        popinContent.innerHTML = '';
        popinContent.appendChild(img);

        popin.classList.add('on');

        currentPic = Array.prototype.slice.call(portfolio.children).indexOf(link.parentNode);

        currentPic === 0 ? popinPrev.setAttribute('disabled', true) : popinPrev.removeAttribute('disabled');
    };

    // Popin events
    const addPopinEvents = () => {
        forEach(document.getElementsByClassName('pic-link'), link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                loadPopin(link);
            }, false);
        });
    }

    const nextPic = lastPic => {
        const pics = document.getElementsByClassName('pic');
        const nextPic = lastPic ? pics[0] : pics[currentPic + 1];

        if (nextPic) {
            loadPopin(nextPic.querySelector('.pic-link'));
        } else {
            loadPics(true);
        }
    };

    const prevPic = () => {
        const pics = document.getElementsByClassName('pic');
        const prevPic = pics[currentPic - 1];

        if (prevPic) {
            loadPopin(prevPic.querySelector('.pic-link'));
        }
    };

    // Private Methods
    const loadPics = loadFromPopin => {
        // Basic query parameters to filter the API
        // Visit https://developer.wordpress.org/rest-api/reference/posts/#arguments
        // For information about other parameters
        const params = {
            _embed: true, // Required to fetch images, author, etc
            page: config.startPage, // Current page of the collection
            per_page: config.postsPerPage // Maximum number of posts to be returned by the API
        };

        // Builds the API URL with params _embed, per_page, and page
        const getApiUrl = url => {
            let apiUrl = new URL(url);
            apiUrl.search = new URLSearchParams(params).toString();
            return apiUrl;
        };

        // Make a request to the REST API
        const loadPosts = async () => {
            const url = getApiUrl(config.api);
            const request = await fetch(url);

            if (request.status === 200) {
                const posts = await request.json();

                if (!posts.length) return;

                // Builds the HTML to show the posts
                const postsHtml = renderPostHtml(posts);

                // Adds the HTML into the posts div
                portfolio.innerHTML += postsHtml;

                // Required for the infinite scroll
                postsLoaded = true;

                // Recalculate Macy layout
                macy.runOnImageLoad(() => {
                    macy.recalculate(true, true);
                }, true);

                // Add popin events
                addPopinEvents();

                // Increase every time content is loaded
                ++config.startPage;
                
                // Call again next pic in popin if loading pics was made from popin
                if (loadFromPopin) nextPic();
            }else if (request.status === 400){
                // Start over at begining of pics in popin if loading pics was made from popin
                if (loadFromPopin) nextPic(true);
            }
        };

        // Builds the HTML to show all posts
        const renderPostHtml = posts => {
            let postHtml = '';

            for (let post of posts) {
                postHtml += postTemplate(post);
            }

            return postHtml;
        };

        // HTML template for a post
        const postTemplate = post => {
            return `
                <div class="pic">
                    <a href="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-link">
                        <img src="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-img" />
                        <p class="pic-text">${post.title.rendered}</p>
                    </a>
                </div>`;
        };

        loadPosts();
    };

    // First load of pics
    //loadPics();

    // Add popin events
    addPopinEvents();

    // Popin events
    popinClose.addEventListener('click', () => {
        popin.classList.remove('on');
    }, false);

    popinNext.addEventListener('click', () => { nextPic(); }, false);
    popinPrev.addEventListener('click', () => { prevPic(); }, false);

    // Where the magic happens
    // Checks if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const loadMoreCallback = (entries, observer) => {
            entries.forEach(btn => {
                if (btn.isIntersecting && postsLoaded === true) {
                    postsLoaded = false;
                    loadPics();
                }
            });
        };

        let loadMoreObserver = new IntersectionObserver(loadMoreCallback, {
            threshold: 0.1
        });
        
        loadMoreObserver.observe(btnLoadMore);
    }
};

export default loadContent;
