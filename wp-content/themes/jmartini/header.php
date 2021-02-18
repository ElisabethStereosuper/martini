<!DOCTYPE html>

<html <?php language_attributes(); ?> class='no-js'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width,initial-scale=1'>
		<meta name='format-detection' content='telephone=no'>

		<link rel='alternate' type='application/rss+xml' title='<?php echo get_bloginfo('sitename') ?> Feed' href='<?php echo get_bloginfo('rss2_url') ?>'>

		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed&family=Raleway:ital,wght@0,400;1,300&display=swap" rel="stylesheet">

		<?php wp_head(); ?>

		<script>document.getElementsByTagName('html')[0].className = 'js';</script>
	</head>

	<body <?php body_class(); ?>>

		<div class="wrapper">

			<div class="sidebar">
				<header role='banner' class="header">

					<h1>
						<a href='./' title='J. Martini' rel='home'>J. Martini</a>
					</h1>

					<?php dynamic_sidebar('sidebar'); ?>
					
				</header>

				<footer role='contentinfo' class="footer">
					<?php dynamic_sidebar('footer'); ?>
				</footer>
			</div>

			<main role='main' class="main">
