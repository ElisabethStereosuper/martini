<?php

define( 'JMARTINI_VERSION', 1.0 );

require_once(WPMU_PLUGIN_DIR . '/class-tgm-plugin-activation.php');


/*-----------------------------------------------------------------------------------*/
/* General
/*-----------------------------------------------------------------------------------*/
// Plugins updates
add_filter( 'auto_update_plugin', '__return_true' );

// Theme support
add_theme_support( 'html5', array(
    'comment-list',
    'comment-form',
    'search-form',
    'gallery',
    'caption',
    'widgets'
) );
add_theme_support( 'post-thumbnails' );
add_theme_support( 'title-tag' );

// Admin bar
show_admin_bar(false);

// Hide posts
function jmartini_remove_admin_menus() {
    remove_menu_page( 'edit.php' );
}
add_action( 'admin_menu', 'jmartini_remove_admin_menus' );


/*-----------------------------------------------------------------------------------*/
/* Clean WordPress head and remove some stuff for security
/*-----------------------------------------------------------------------------------*/
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
add_filter( 'emoji_svg_url', '__return_false' );

// remove api rest links
remove_action( 'wp_head', 'rest_output_link_wp_head' );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

// remove comment author class
function jmartini_remove_comment_author_class( $classes ){
	foreach( $classes as $key => $class ){
		if(strstr($class, 'comment-author-')) unset( $classes[$key] );
	}
	return $classes;
}
add_filter( 'comment_class' , 'jmartini_remove_comment_author_class' );

// remove login errors
function jmartini_login_errors(){
    return 'Something is wrong!';
}
add_filter( 'login_errors', 'jmartini_login_errors' );


/*-----------------------------------------------------------------------------------*/
/* Admin
/*-----------------------------------------------------------------------------------*/
// Remove some useless admin stuff
function jmartini_remove_submenus() {
  remove_submenu_page( 'themes.php', 'themes.php' );
  remove_submenu_page( 'widgets.php', 'widgets.php' );
  remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'jmartini_remove_submenus', 999 );

function jmartini_remove_top_menus( $wp_admin_bar ){
    $wp_admin_bar->remove_node( 'wp-logo' );
}
add_action( 'admin_bar_menu', 'jmartini_remove_top_menus', 999 );

// Enlever le lien par défaut autour des images
function jmartini_imagelink_setup(){
	if(get_option( 'image_default_link_type' ) !== 'none') update_option('image_default_link_type', 'none');
}
add_action( 'admin_init', 'jmartini_imagelink_setup' );

// Add wrapper around iframe
function jmartini_iframe_add_wrapper( $return, $data, $url ){
    return "<div class='wrapper-video'>{$return}</div>";
}
add_filter( 'oembed_dataparse', 'jmartini_iframe_add_wrapper', 10, 3 );

// Allow svg in media library
function jmartini_mime_types($mimes){
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter( 'upload_mimes', 'jmartini_mime_types' );

// Custom posts in the dashboard
function jmartini_right_now_custom_post() {
    $post_types = get_post_types(array( '_builtin' => false ) , 'objects' , 'and');
    foreach($post_types as $post_type){
        $cpt_name = $post_type->name;
        if($cpt_name !== 'acf-field-group' && $cpt_name !== 'acf-field'){
            $num_posts = wp_count_posts($post_type->name);
            $num = number_format_i18n($num_posts->publish);
            $text = _n($post_type->labels->name, $post_type->labels->name , intval($num_posts->publish));
            echo '<li class="'. $cpt_name .'-count"><tr><a class="'.$cpt_name.'" href="edit.php?post_type='.$cpt_name.'"><td></td>' . $num . ' <td>' . $text . '</td></a></tr></li>';
        }
    }
}
add_action( 'dashboard_glance_items', 'jmartini_right_now_custom_post' );

// Option page
function jmartini_menu_order( $menu_ord ){  
    if( !$menu_ord ) return true;  
    
    $menu = 'acf-options';
    $menu_ord = array_diff($menu_ord, array( $menu ));
    array_splice( $menu_ord, 1, 0, array( $menu ) );
    return $menu_ord;
}  
add_filter( 'custom_menu_order', 'jmartini_menu_order' );
add_filter( 'menu_order', 'jmartini_menu_order' );


/*-----------------------------------------------------------------------------------*/
/* Menus
/*-----------------------------------------------------------------------------------*/
register_nav_menus( array('primary' => 'Primary Menu') );

// Cleanup WP Menu html
function jmartini_css_attributes_filter($var){
    return is_array($var) ? array_intersect($var, array('current-menu-item', 'current_page_parent')) : '';
}
add_filter( 'nav_menu_css_class', 'jmartini_css_attributes_filter' );


/*-----------------------------------------------------------------------------------*/
/* Sidebar & Widgets
/*-----------------------------------------------------------------------------------*/
// function jmartini_register_sidebars(){
// 	register_sidebar( array(
// 		'id' => 'sidebar',
// 		'name' => 'Sidebar',
// 		'description' => 'Take it on the side...',
// 		'before_widget' => '',
// 		'after_widget' => '',
// 		'before_title' => '',
// 		'after_title' => '',
// 		'empty_title'=> ''
// 	) );
// }
// add_action( 'widgets_init', 'jmartini_register_sidebars' );

// Deregister default widgets
// function jmartini_unregister_default_widgets(){
//     unregister_widget('WP_Widget_Pages');
//     unregister_widget('WP_Widget_Calendar');
//     unregister_widget('WP_Widget_Archives');
//     unregister_widget('WP_Widget_Links');
//     unregister_widget('WP_Widget_Meta');
//     unregister_widget('WP_Widget_Search');
//     unregister_widget('WP_Widget_Text');
//     unregister_widget('WP_Widget_Categories');
//     unregister_widget('WP_Widget_Recent_Posts');
//     unregister_widget('WP_Widget_Recent_Comments');
//     unregister_widget('WP_Widget_RSS');
//     unregister_widget('WP_Widget_Tag_Cloud');
//     unregister_widget('WP_Nav_Menu_Widget');
// }
// add_action( 'widgets_init', 'jmartini_unregister_default_widgets' );


/*-----------------------------------------------------------------------------------*/
/* Post types
/*-----------------------------------------------------------------------------------*/
function jmartini_post_type(){
    register_post_type( 'photo', array(
        'label' => 'Photos',
        'singular_label' => 'Photo',
        'public' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array('title', 'thumbnail'),
        'public' => true,
        'publicly_queryable' => false,
    ));
}
add_action( 'init', 'jmartini_post_type' );

function jmartini_taxonomies(){
    register_taxonomy( 'serie', array('photo'), array(
        'label' => 'Series',
        'singular_label' => 'Serie',
        'hierarchical' => true,
        'show_admin_column' => true
    ) );
}
add_action( 'init', 'jmartini_taxonomies' );


/*-----------------------------------------------------------------------------------*/
/* Enqueue Styles and Scripts
/*-----------------------------------------------------------------------------------*/
function jmartini_scripts(){
    // header
	wp_enqueue_style( 'jmartini-style', get_template_directory_uri() . '/css/main.css', array(), JMARTINI_VERSION );

	// footer
	wp_deregister_script('jquery');
	wp_enqueue_script( 'jmartini-scripts', get_template_directory_uri() . '/js/main.js', array(), JMARTINI_VERSION, true );

    wp_deregister_script( 'wp-embed' );
}
add_action( 'wp_enqueue_scripts', 'jmartini_scripts' );


/*-----------------------------------------------------------------------------------*/
/* TGMPA
/*-----------------------------------------------------------------------------------*/
function jmartini_register_required_plugins(){
	$plugins = array(
        array(
            'name'        => 'Advanced Custom Fields PRO',
            'slug'        => 'advanced-custom-fields-pro',
            'source'      => get_template_directory_uri() . '/plugins/advanced-custom-fields-pro.zip',
            'required'    => true,
            'force_activation' => false
        ),
        array(
            'name'        => 'Clean Image Filenames',
            'slug'        => 'clean-image-filenames',
            'required'    => false,
            'force_activation' => false
        ),
        array(
            'name'        => 'EWWW Image Optimizer',
            'slug'        => 'ewww-image-optimizer',
            'required'    => false,
            'force_activation' => false
        ),

        array(
            'name'        => 'SecuPress Free — Sécurité WordPress 1.3.3',
            'slug'        => 'secupress',
            'required'    => false,
            'force_activation' => false
        ),
        array(
            'name'        => 'Yoast SEO',
            'slug'        => 'wordpress-seo',
            'required'    => false,
            'force_activation' => false
        ),
    );
    
	$config = array(
		'id'           => 'jmartini',
		'default_path' => '', 
		'menu'         => 'tgmpa-install-plugins',
		'parent_slug'  => 'themes.php',
		'capability'   => 'edit_theme_options', 
		'has_notices'  => true,
		'dismissable'  => true,
		'dismiss_msg'  => '',
		'is_automatic' => false,
		'message'      => ''
    );

	tgmpa( $plugins, $config );
}
add_action( 'tgmpa_register', 'jmartini_register_required_plugins' );

?>
