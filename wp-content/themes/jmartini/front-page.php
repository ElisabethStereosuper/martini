<?php 
/*
Template Name: Home
*/

get_header(); 

if ( have_posts() ) : the_post(); 
		
	$photosQuery = new WP_Query( array('post_type' => 'photo') );

	if( $photosQuery->have_posts() ) : ?>
		<section class="portfolio" id="portfolio">
			
			<?php while( $photosQuery->have_posts() ) : $photosQuery->the_post(); ?>
				<div class="pic">
					<a href="<?php the_permalink(); ?>">
						<?php the_post_thumbnail('large'); ?>
					</a>
				</div>
			<?php endwhile; ?>

		</section>

		<div class="load-more">
			<a href="#" id="load-more">Load More</a>
		</div>
	<?php endif;

endif; 

get_footer();

?>
