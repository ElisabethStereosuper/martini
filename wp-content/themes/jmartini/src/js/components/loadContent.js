// This pen is a real example of how to build an Infinite Scroll
// in Vanilla JavaScript. I've used Fetch API, Intersection Observer API,
// and WordPress REST API to fetch posts.
// Feel free to fork, use and modify this code.
//
// Author: Cadu de Castro Alves
// Twitter: https://twitter.com/castroalves
// GitHub: https://github.com/castroalves
const loadContent = () => {
  
    // Basic Configuration
    const config = {
        api: 'http://jmartini.local/wp-json/wp/v2/photo',
        startPage: 1, // 0 for the first page, 1 for the second and so on...
        postsPerPage: 3 // Number of posts to load per page
    };
  
    // Private Properties
    let postsLoaded = false;
    let postsContent = document.querySelector('#portfolio');
    let btnLoadMore = document.querySelector('#load-more');
  
    // Private Methods
    const loadPics = function() {
    
        // Starts with page = 1
        // Increase every time content is loaded
        ++config.startPage;
    
        // Basic query parameters to filter the API
        // Visit https://developer.wordpress.org/rest-api/reference/posts/#arguments
        // For information about other parameters
        const params = {
            _embed: true, // Required to fetch images, author, etc
            page: config.startPage, // Current page of the collection
            per_page: config.postsPerPage, // Maximum number of posts to be returned by the API
        }
    
        // console.log('_embed', params._embed);
        // console.log('per_page', params.per_page);
        // console.log('page', params.page);
    
        // Builds the API URL with params _embed, per_page, and page
        const getApiUrl = (url) => {
            let apiUrl = new URL(url);
            apiUrl.search = new URLSearchParams(params).toString();
            return apiUrl;
        };
    
        // Make a request to the REST API
        const loadPosts = async () => {
            const url = getApiUrl(config.api);
            const request = await fetch(url);

            if( request.status === 200 ){
                const posts = await request.json();

                if( !posts.length ) return;
            
                // Builds the HTML to show the posts
                const postsHtml = renderPostHtml(posts);
            
                // Adds the HTML into the posts div
                postsContent.innerHTML += postsHtml;
            
                // Required for the infinite scroll
                postsLoaded = true;
            }
        };
    
        // Builds the HTML to show all posts
        const renderPostHtml = (posts) => {
            let postHtml = '';

            for(let post of posts) {
                postHtml += postTemplate(post);
            };
            
            return postHtml;
        };
    
        // HTML template for a post
        const postTemplate = (post) => {
            return `
                <div id="pic-${post.id}" class="pic">
                <img src="${post._embedded['wp:featuredmedia'][0].source_url}" class="pic-img" />
                <!--<h3 class="post-title"><a href="${post.link}?utm_source=codepen&utm_medium=link" target="_blank">${post.title.rendered}</a></h3>-->
                </div>`;
        };
    
        loadPosts();
    };
  
    // Where the magic happens
    // Checks if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
    
        const loadMoreCallback = (entries, observer) => {
            entries.forEach((btn) => {
                if (btn.isIntersecting && postsLoaded === true) {
                    postsLoaded = false;
                    loadPics();
                }
            });
        };
    
        // Intersection Observer options
        const options = {
            threshold: 1.0 // Execute when button is 100% visible
        };
        
        let loadMoreObserver = new IntersectionObserver(loadMoreCallback, options);
        loadMoreObserver.observe(btnLoadMore);
    }
  
    loadPics();
};

export default loadContent;