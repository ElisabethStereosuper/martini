<?php 
/*
Template Name: Home
*/

get_header(); 

if ( have_posts() ) : the_post(); ?>
		
		<section class="portfolio" id="portfolio"></section>

		<div id="load-more"></div>
		<div id="loader-pics" class="loader loader-pics"></div>

		<div id="popin" class="popin">
			<button id="popin-close" class="popin-close" role="button">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 414 414">
					<path d="m413.348 24.354-24.354-24.354-182.32 182.32-182.32-182.32-24.354 24.354 182.32 182.32-182.32 182.32 24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z"/>
				</svg>
			</button>
			<div id="popin-content" class="popin-content"></div>
			<button id="popin-next" class="popin-nav popin-next" role="button">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 408 408">
					<polygon points="112.814,0 91.566,21.178 273.512,203.718 91.566,386.258 112.814,407.436 315.869,203.718 "/>
				</svg>
			</button>
			<button id="popin-prev" class="popin-nav popin-prev" role="button">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408 408">
					<polygon points="315.869,21.178 294.621,0 91.566,203.718 294.621,407.436 315.869,386.258 133.924,203.718 "/>
				</svg>
			</button>
			<div id="loader" class="loader"></div>
		</div>

<?php endif; 

get_footer();

?>
