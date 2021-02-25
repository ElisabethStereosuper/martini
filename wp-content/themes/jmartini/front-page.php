<?php 
/*
Template Name: Home
*/

get_header(); 

if ( have_posts() ) : the_post(); 
		
	$photosQuery = new WP_Query( array('post_type' => 'photo', 'orderby' => 'menu_order') );

	if( $photosQuery->have_posts() ) : ?>
		<section class="portfolio" id="portfolio">
			
			<?php while( $photosQuery->have_posts() ) : $photosQuery->the_post(); ?>
				<div class="pic">
					<a href="<?php echo get_the_post_thumbnail_url($post, 'full') ?>" class="pic-link off">
						<?php the_post_thumbnail('large'); ?>
						<p class="pic-text"><?php the_title(); ?></p>
					</a>
				</div>
			<?php endwhile; ?>

		</section>

		<div id="load-more"></div>

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
		</div>
	<?php endif;

endif; 

get_footer();

?>
