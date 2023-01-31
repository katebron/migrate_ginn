/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document) {

  'use strict';

  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.my_custom_behavior = {
    attach: function (context, settings) {

    //icons for menu up/down
    var menu_icons = '<span class="custom_search_webfont_svg front_col" aria-hidden="true">' +
      '<svg class="icon icon-caret-down"><use xlink:href="#icon-caret-down"></use>' +
      '</svg><svg class="icon icon-caret-up"><use xlink:href="#icon-caret-up"></use>' +
      '</svg></span><span class="visually-hidden">Toggle menu</span>';

    $(".menu-name-main-menu .menu__item > .menu > .menu__item > .menu__link", context).hover(
      function() {
        $(this).parent().parent().prev('.menu__link').addClass('is-active-parent-trail');
      }, function() {
        $(this).parent().parent().prev('.menu__link').removeClass('is-active-parent-trail');
      }
    );
   
    //for tabbing also see menu.js
    $(".menu-name-main-menu > .menu > .menu__item > .menu__link", context).focus(
      function(){
        var to_focus = $(this).next('.menu');
        //make the parent link appear as when hovered
        $(this).addClass('is-active-parent-trail');
        //focused class will make the menu visible
        $(this).next('.menu').addClass('focused');
        //when you go the next, take away focused, active classes
         menu_unfocus_unhover(to_focus,this);     
      }
    ); 
    //for shift-tab
    var next_focus = $("#skip-nav-link-content-3");
    $(next_focus).focus(
      function(){
        $(".menu-name-main-menu").find('.focused').removeClass('focused');
        $(".menu-name-main-menu").find('.is-active-parent-trail').removeClass('is-active-parent-trail');

      }
    );  
    $(".menu-name-main-menu > .menu > .menu__item > .menu > .menu__item > .menu__link", context).focus(
      function(){
        var fmenu = $(this).parent().parent();
        $(fmenu).addClass('focused');
        var plink = $(fmenu).prev('.menu__link');
        //make sure appropriate parent link shows as active/focused visually
        $(plink).addClass('is-active-parent-trail');
        //take out other focus, visual active states from other pull-downs
        menu_unfocus_unhover(fmenu,plink);
      
      }
 
    );
    function menu_unfocus_unhover(focus,menu){
      $(".menu-name-main-menu").find('.focused').not(focus).removeClass('focused');
      $(".menu-name-main-menu").find('.is-active-parent-trail').not(menu).removeClass('is-active-parent-trail'); 
    }

    var mob_menu = ".menu-name-main-menu > .menu > .menu__item.is-expanded > .menu__link";
    
    var front_headers = ".view-front-page-columns > .view-content > .views-responsive-grid > .views-row > .views-column > .views-field-title";
    
    var db_sub = ".view-display-id-subject > .view-content > .db_group";
    

    expand_collapse(front_headers);
    expand_collapse(mob_menu);
    expand_collapse(db_sub);


    function expand_collapse(area){
      $(area).prepend(menu_icons);
      $(area).addClass('caret_down');

      if (area == front_headers){
      $(area).closest("div").addClass('collapsed');
        }
      if (area == db_sub){
        $(area).children(".db_subject_group").addClass('collapsed');
      }
      else {
        $(area).addClass('collapsed');
      }
     
    }
    
    $(front_headers, context).click(function() {
      $(this).closest("div").toggleClass('collapsed');

    });
    //add keypress function so keyboard enter & space also open up the database subject groups
    $(db_sub).children('h2').keypress(function(e){
        if((e.which == 13)||(e.which==32)){//Enter or space key pressed
            $(this).click();//Trigger search button click event
        }
    });

 
    $(db_sub, context).children('h2').unbind("click").click(function() {
     $(this).next(".db_subject_group").toggleClass('collapsed');
      $(this).parent(db_sub).toggleClass("caret_down");
      $(this).parent(db_sub).toggleClass("caret_up");

    });
    
    $(mob_menu, context).click(function(event) {
      $(this).toggleClass('collapsed').toggleClass('no_border');
      //only allow link to propogate if nav menu is showed by default on tab/desktop sizes
       if (window.matchMedia('(max-width: 750px)').matches){
         event.preventDefault();
        }
    });
   
    $("span[data-class='mobile-nav-button']", context).after($('<button>')
      .append('<span class="mobile_text">MENU</span><span class="custom_search_webfont_svg" aria-hidden="true"><svg class="icon icon-search"><use xlink:href="#icon-bars"></use></svg></span><span class="visually-hidden">Toggle menu</span>')
      .addClass('mobile-nav-button')
      .attr('role', 'button')
      .click(function () {
        $(".mobile-nav-button,.menu-name-main-menu")
          .toggleClass("is-open")
          .find('.is-open').removeClass('is-open'); 
        //$("#search-form").toggleClass("is-open");  
      })

    ).detach();
    
    // Hide fallback footer mobile menu block
    $('#block-menu-block-footer-menu').hide();
    
    //site search on mid-screens
    $('#account_search_wrap').live('click touchstart', function(e){
      $(this).addClass('tab_open');
      $(this).find('input[type="text"]').focus();
      e.stopPropagation();
      
    });

    /*close the menu when you click on any other part of the page*/
    $('.html').live('click touchstart', function(){
      $(".mobile-nav-button,.menu-name-main-menu").removeClass('is-open');
      $('#account_search_wrap').removeClass('tab_open');
    })  
    $(".mobile-nav-button,.menu-name-main-menu").live('click touchstart', function(e){
        e.stopPropagation();
    });
    

    $('.layout-center').live('click', function(e){
       if(!$(e.target).is('#account_search_wrap')) {
        //console.log("inside");
        return;
       } 
      $('#account_search_wrap').toggleClass('tab_open');
      
    });
    $('.paragraphs-item-2-images-together-').eq(1).addClass("second_full_image");

    //reserve collection items - add classes for xml parsing for Circ Ipads
    
    //var program_name = $('.paragraphs-item-reserve-collection > .content > h3').html();
    //console.log("this is program name: " + program_name);   
    $('.paragraphs-item-reserve-collection > .content > h3').each(function() {
      var prgrm_name = $(this).text();
      prgrm_name = prgrm_name.trim(prgrm_name).split(' ').join('_').replace(/,/g , '');
      $(this).addClass(prgrm_name);
    });

    //icons for read more
    var $arrow_ico = '<span class="custom_search_webfont_svg" aria-hidden="true"><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></span>';  
     
    $('.read-more').append($arrow_ico); 
    //social icons in footer
    //Insta
    $('.view-id-footer').find('.item-list > ul > li > a:contains("Instagram")')
      .html("<span class='custom_search_webfont_svg'><svg class='icon icon-instagram'><title>Ginn Library Instagram Account</title><use xlink:href='#icon-instagram'></use></svg></span>");
    //Twitter
    $('.view-id-footer').find('.item-list > ul > li > a:contains("Twitter")')
      .html("<span class='custom_search_webfont_svg' aria-hidden='true'><title>Ginn Library Twitter Account</title><svg class='icon icon-twitter'><use xlink:href='#icon-twitter'></use></svg></span>");
    //YouTube
    $('.view-id-footer').find('.item-list > ul > li > a:contains("YouTube")')
      .html("<span class='custom_search_webfont_svg' aria-hidden='true'><svg class='icon icon-youtube'><title>Ginn Library YouTube Account</title><use xlink:href='#icon-youtube'></use></svg></span>");
    $('.menu-block-3').find('.menu-mlid-749 > a')
      .prepend("<span class='custom_search_webfont_svg' aria-hidden='true'><svg class='icon icon-user'><title>Tufts Library Account</title><use xlink:href='#icon-user'></use></svg></span>");
    
    //add alt to default image
    //for any default image on a node. default-image class added through template.php
    $('.default-image img[alt=""]').attr('alt','Ginn Library');
    //these are view areas that don't render the default-image class
    $('.region-news').find('img[alt=""]').attr('alt','Ginn Library'); 
    $('.field-name-field-front-image img[alt=""]').attr('alt','Ginn Library');
    
    //check if font-size larger in browser
    //var el = document.getElementById('page');
    var style = window.getComputedStyle(document.body).getPropertyValue('font-size');
    var fontSize = parseFloat(style);
    if (fontSize > 18){
      $('body').addClass('magnified');
      $('#navigation').addClass('magnified');
    }
     

    // Check if touch device
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

    if(isAndroid) {
      $('.menu-name-main-menu > .menu > .menu__item > .menu__link').slice(1).click(
        function(event) {
          $(this).parent().prevAll('.menu__item').children('.menu__link').removeClass('is-open');
          $(this).parent().nextAll('.menu__item').children('.menu__link').removeClass('is-open');
          if($(this).hasClass('is-open')) {
            $(this).removeClass('is-open');
          }
          else {
            event.preventDefault();
            $(this).addClass('is-open');
          }
        }
      );
    }
  }
};


})(jQuery, Drupal, this, this.document);;
(function ($, Drupal, window, document) {

  'use strict';

  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.menu_accessible = {
    attach: function (context, settings) {

  //adapted from http://staff.washington.edu/tft/tests/menus/simplyaccessible/index.html
  //note: needs to be consolidated with menu code in script.js & css, thus
  //current settings may not work

   var keyCodeMap = {
        48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
        65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
        77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
        96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9"
    }
    
	settings = jQuery.extend({
		menuHoverClass: 'show-menu',
	}, settings);


	access('.menu-block-3 > ul');
	
	function access(area){
	// Add ARIA role to menubar and menu items
		$(area).attr('role', 'menubar').find('li').attr('role', 'menuitem');
		
		var top_level_links = $(area).find('> li > a');

		// Added by Terrill: (removed temporarily: doesn't fix the JAWS problem after all)
		// Add tabindex="0" to all top-level links 
		// Without at least one of these, JAWS doesn't read widget as a menu, despite all the other ARIA
		//$(top_level_links).attr('tabindex','0');
		
		// Set tabIndex to -1 so that top_level_links can't receive focus until menu is open
		$(top_level_links).next('ul')
			.attr('data-test','true')
			.attr({ 'aria-hidden': 'true', 'role': 'menu' })
			.find('a')
				.attr('tabIndex',-1);
		
		// Adding aria-haspopup for appropriate items
		$(top_level_links).each(function(){
			if($(this).next('ul').length > 0)
				$(this).parent('li').attr('aria-haspopup', 'true');

		});
		

		$(top_level_links).hover(function(){
			$(this).closest('ul') 
				.attr('aria-hidden', 'false')
				.find('.'+settings.menuHoverClass)
					.attr('aria-hidden', 'true')
					.removeClass(settings.menuHoverClass)
					.find('a')
						.attr('tabIndex',-1);
			$(this).next('ul')
				.attr('aria-hidden', 'false')
				.addClass(settings.menuHoverClass)
				.find('a').attr('tabIndex',0);
		});
		$(top_level_links).focus(function(){
			$(this).closest('ul')
				// Removed by Terrill 
				// The following was adding aria-hidden="false" to root ul since menu is never hidden
				// and seemed to be causing flakiness in JAWS (needs more testing) 
				// .attr('aria-hidden', 'false') 
				.find('.'+settings.menuHoverClass)
					.attr('aria-hidden', 'true')
					.removeClass(settings.menuHoverClass)
					.find('a')
						.attr('tabIndex',-1);
			$(this).next('ul')
				.attr('aria-hidden', 'false')
				.addClass(settings.menuHoverClass)
				.find('a').attr('tabIndex',0);
		});
		
		// Bind arrow keys for navigation
		$(top_level_links).keydown(function(e){
			if(e.keyCode == 37) {
				e.preventDefault();
				// This is the first item. Specifying 222 b/c first link is home
				if($(this).parent('li').prev('li').hasClass('menu-mlid-222')) {
					//here having to loop back to 3rd last li b/c last 3 are for mobile only
					$(this).parents('ul').find('> li').last().prev().prev().prev().find('a').focus();

				} else {
					$(this).parent('li').prev('li').find('a').first().focus();
				}
			} else if(e.keyCode == 38) {
				e.preventDefault();
				if($(this).parent('li').find('ul').length > 0) {
					$(this).parent('li').find('ul')
						.attr('aria-hidden', 'false')
						.addClass(settings.menuHoverClass)
						.find('a').attr('tabIndex',0)
							.last().focus();
				}
				//right arrow key
			} else if(e.keyCode == 39) {
				e.preventDefault();
				// This is the last item. Specifying 749 because last 3 li's are mobile only
				if($(this).parent('li').next('li').hasClass('menu-mlid-749')) {
					$(this).parents('ul').find('> li').first().next().find('a').first().focus();
				} else {
					$(this).parent('li').next('li').find('a').first().focus();
				}
			} else if(e.keyCode == 40) {
				e.preventDefault();
				if($(this).parent('li').find('ul').length > 0) {
					$(this).parent('li').find('ul')
						.attr('aria-hidden', 'false')
						.addClass(settings.menuHoverClass)
						.find('a').attr('tabIndex',0)
							.first().focus();
				}
			} else if(e.keyCode == 13 || e.keyCode == 32) {
				// If submenu is hidden, open it
				e.preventDefault();
				$(this).parent('li').find('ul[aria-hidden=true]')
						.attr('aria-hidden', 'false')
						.addClass(settings.menuHoverClass)
						.find('a').attr('tabIndex',0)
							.first().focus();
			} else if(e.keyCode == 27) {
				e.preventDefault();
				$('.'+settings.menuHoverClass)
					.attr('aria-hidden', 'true')
					.removeClass(settings.menuHoverClass)
					.find('a')
						.attr('tabIndex',-1);
			} else {
				$(this).parent('li').find('ul[aria-hidden=false] a').each(function(){
					if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
						$(this).focus();
						return false;
					}
				});
			}
		});
		
		
		var links = $(top_level_links).parent('li').find('ul').find('a');
		$(links).keydown(function(e){
			if(e.keyCode == 38) {
				e.preventDefault();
				// This is the first item
				if($(this).parent('li').prev('li').length == 0) {
					$(this).parents('ul').parents('li').find('a').first().focus();
				} else {
					$(this).parent('li').prev('li').find('a').first().focus();
				}
			} else if(e.keyCode == 40) {
				e.preventDefault();
				if($(this).parent('li').next('li').length == 0) {
					$(this).parents('ul').parents('li').find('a').first().focus();
				} else {
					$(this).parent('li').next('li').find('a').first().focus();
				}
			} else if(e.keyCode == 27 || e.keyCode == 37) {
				e.preventDefault();
				$(this)
					.parents('ul').first()
						.prev('a').focus()
						.parents('ul').first().find('.'+settings.menuHoverClass)
							.attr('aria-hidden', 'true')
							.removeClass(settings.menuHoverClass)
							.find('a')
								.attr('tabIndex',-1);
			} else if(e.keyCode == 32) {
				e.preventDefault();
				window.location = $(this).attr('href');
			} else {
				var found = false;
				$(this).parent('li').nextAll('li').find('a').each(function(){
					if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
						$(this).focus();
						found = true;
						return false;
					}
				});
				
				if(!found) {
					$(this).parent('li').prevAll('li').find('a').each(function(){
						if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
							$(this).focus();
							return false;
						}
					});
				}
			}
		});

			
		// Hide menu if click or focus occurs outside of navigation
		// this is tab key
		$(this).find('a').last().keydown(function(e){ 
			if(e.keyCode == 9) {
				// If the user tabs out of the navigation hide all menus
				$('.'+settings.menuHoverClass)
					.attr('aria-hidden', 'true')
					.removeClass(settings.menuHoverClass)
					.find('a')
						.attr('tabIndex',-1);
			}
		});
		$(document).click(function(){ $('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1); });
		
		$(this).click(function(e){
			e.stopPropagation();
		});

   }


    
    }
  }

})(jQuery, Drupal, this, this.document);;
