(self["webpackChunkjmartini"] = self["webpackChunkjmartini"] || []).push([["loadContent-copie"],{

/***/ "./wp-content/themes/jmartini/src/js/components/loadContent copie.js":
/*!***************************************************************************!*\
  !*** ./wp-content/themes/jmartini/src/js/components/loadContent copie.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var macy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! macy */ "./node_modules/macy/dist/macy.js");
/* harmony import */ var macy__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(macy__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _stereorepo_sac__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stereorepo/sac */ "./node_modules/@stereorepo/sac/src/index.js");



// Infinite load author: Cadu de Castro Alves
// GitHub: https://github.com/castroalves

const loadContent = () => {
    let portfolio = document.querySelector('#portfolio');
    let btnLoadMore = document.querySelector('#load-more');

    if(!portfolio || !btnLoadMore) return;

    // Private Properties
    let postsLoaded = true;
    let startPage = 2;

    // Macy layout
    const macy = macy__WEBPACK_IMPORTED_MODULE_0___default()({
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
    let currentPic;

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
        (0,_stereorepo_sac__WEBPACK_IMPORTED_MODULE_1__.forEach)(document.getElementsByClassName('pic-link'), link => {
            link.classList.remove('off');
            link.addEventListener('click', e => {
                e.preventDefault();
                loadPopin(link);
            }, false);
        });
    };

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
                    <a href="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-link off">
                        <img src="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-img" />
                        <p class="pic-text">${post.title.rendered}</p>
                    </a>
                </div>`;
    };

    // Make a request to the REST API
    const loadPics = async (loadFromPopin) => {
        const url = getApiUrl();
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
                //macy.recalculate(true, true);

                // Add popin events
                addPopinEvents();

                // Call again next pic in popin if loading pics was made from popin
                if (loadFromPopin) nextPic();
            }, true);

            // Increase every time content is loaded
            ++startPage;
        } else if (request.status === 400) {
            // Start over at begining of pics in popin if loading pics was made from popin
            if (loadFromPopin) nextPic(true);
        }
    };

    // Add popin events
    addPopinEvents();

    // Popin events
    popinClose.addEventListener('click', () => {
        popin.classList.remove('on');
    }, false);

    popinNext.addEventListener('click', () => {
        nextPic();
    }, false);
    popinPrev.addEventListener('click', () => {
        prevPic();
    }, false);

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadContent);


/***/ })

}]);
//# sourceMappingURL=loadContent-copie.js.map?cf2e5a22d3ac96ba2a7429089c066e84