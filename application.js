/*Created 2015-02-06  by Andy*/
/**
 * Normlaizes and compares a locale for the cases
 * where en-CA == en etc. This is a workaround hack but
 * required based on our current data structures.
 * 
 * @return bool Returns true if the locale is ~ similar enough or false otherwise.
 */

setEndPoint('//twinpines.mallmaverick.com/api/v3/twinpines/all.json');
sessionStorage.setItem('primary_locale', 'en-CA');
sessionStorage.setItem('secondary_locale', 'fr-CA');

function isSameLocale(current_locale, locale_2) {
	locale = null;
	switch (current_locale)  {
		case 'en':
		case 'en-CA':
			locale = 'en';
			break;
		case 'fr':
		case 'fr-CA':
			locale = 'en';
			break;
	}
	
	return locale == locale_2;
}

function show_results(id){
	
	if ( $("#"+id+"_results").is(":visible")){
		$("#"+id+"_results").slideUp();
		$("#"+id+"_arrow").removeClass("fa-chevron-down", 1000);
		$("#"+id+"_arrow").addClass("fa-chevron-right", 1000);
	} else {
		$(".results_div").slideUp();
		$(".fa").removeClass("fa-chevron-down", 1000);
		$(".fa").addClass("fa-chevron-right", 1000);
		$("#"+id+"_results").slideDown();   
		$("#"+id+"_arrow").removeClass("fa-chevron-right", 1000);
		$("#"+id+"_arrow").addClass("fa-chevron-down", 1000);
	}
	
}

function toggle_menu (){
	if ($(".mobile_menu").is(":visible")){
		$(".mobile_menu").slideUp();
	} else {
		$(".mobile_menu").slideDown();    
	}
	
}
function toggle_submenu(id){
	if ($("#"+id).is(":visible")){
		$("#"+id).slideUp();
	}else {
		$(".submenu").slideUp();
		$("#"+id).slideDown();
	}
	
}

function setPrimaryLanguage(){
	sessionStorage.setItem('current_locale', sessionStorage.primary_locale);

	i18n.setLng(sessionStorage.primary_locale, function(t) {
		$(document).i18n();
	});

	$('.secondary-locale').hide(); // Shows
	$('.primary-locale').show();
	$("#search_input").attr("placeholder", i18n.t("general.search_placeholder"));
	$("#search_input_mobile").attr("placeholder", i18n.t("general.search_placeholder"));
}

function refreshCurrentLanguage() {
	i18n.setLng(sessionStorage.current_locale, function(t) {
		$(document).i18n();
	});
	
	$('.primary-locale').toggle(sessionStorage.primary_locale == sessionStorage.current_locale);
	$('.secondary-locale').toggle(sessionStorage.secondary_locale == sessionStorage.current_locale);
}

function setSecondaryLanguage(){
	sessionStorage.setItem('current_locale', sessionStorage.secondary_locale);

	i18n.setLng(sessionStorage.secondary_locale, function(t) {
		$(document).i18n();
	});

	$('.secondary-locale').show(); // Shows
	$('.primary-locale').hide();

	$("#search_input").attr("placeholder", i18n.t("general.search_placeholder"));
	$("#search_input_mobile").attr("placeholder", i18n.t("general.search_placeholder"));
	
}

function showSearchResults(){
	$('#search_results').show();
	if($('#search_input').val().length == 0){
		$('#search_results').hide();
	}else{
		var search_results = getSearchResults($('#search_input').val(),10,100);
		$('.search-results-count').html("Total Results : "+search_results.summary.count);
		renderSearchResultsTemplate('#search_results_template','#search_results_items',search_results);
		if (search_results["stores"]){
			if (search_results["stores"].length > 0){
				$("#store_results_header").html(search_results["stores"].length+" Stores <i id='store_arrow' class='fa fa-chevron-right pull-right'></i>") ;
				$("#store_results_header").show();
			}
			
		} else {
			$("#store_results_header").hide();
		}
		if (search_results["promotions"]){
			if (search_results["promotions"].length > 0){
				$("#promotions_results_header").html(search_results["promotions"].length+" Promotions <i id='promo_arrow' class='fa fa-chevron-right pull-right'></i>")    ;
				$("#promotions_results_header").show();
			}
			
		} else {
			$("#promotions_results_header").hide();
		}
		if (search_results["events"]){
			if (search_results["events"].length > 0) {
				$("#events_results_header").html(search_results["events"].length+" Events <i id='event_arrow' class='fa fa-chevron-right pull-right'></i>")    
				$("#events_results_header").show();
			}
			
		} else {
			$("#events_results_header").hide();
		}
	}
}


function renderPageData() {}

renderPageData.render_list = [];

renderPageData.add = function (render_callback) {
	renderPageData.render_list.push(render_callback)
}

renderPageData.render = function() {
	for (var x in renderPageData.render_list) {
		renderPageData.render_list[x]();
	}

	$(document).trigger('render:complete');
}


function renderPropertyLogo(logo_template,site_logo,propertyDetails){
	var item_list = [];
	var item_rendered = [];
	var logo_template_html = $(logo_template).html();
	Mustache.parse(logo_template_html);   // optional, speeds up future uses
	item_list.push(propertyDetails);
	$.each( item_list , function( key, val ) {
		val.alt_site_logo = getImageURL(val.site_logo);
		var logo_rendered = Mustache.render(logo_template_html,val);
		item_rendered.push(logo_rendered);
	});
	$(site_logo).show();
	$(site_logo).html(item_rendered.join(''));
}

function renderPropertyFooter(footer_template,footer_container,propertyDetails){
	var item_list = [];
	var item_rendered = [];
	var footer_template_html = $(footer_template).html();
	Mustache.parse(footer_template_html);   // optional, speeds up future uses
	item_list.push(propertyDetails);
	$.each( item_list , function( key, val ) {
		var footer_rendered = Mustache.render(footer_template_html,val);
		item_rendered.push(footer_rendered);
	});
	$(footer_container).show();
	$(footer_container).html(item_rendered.join(''));
}

$(document).ready(function() {

	if(navigator.appVersion.indexOf("MSIE 9.") == -1){
		
	} else {
		$("#menu_map").hide();
	}

	$('#subForm').submit(function (e) {
		e.preventDefault();
		if ($("#agree_terms").prop("checked") == true){
			$('#subForm').unbind('submit').submit();
		} else {
			alert("Please check the agree box if you want to proceed.")
		}
		
	});

	renderPageData.add(function(){
		var propertyDetails = getPropertyDetails();
		renderPropertyLogo('#logo_template','#site_logo',propertyDetails);
		renderPropertyFooter('#footer_template','#footer_container',propertyDetails);
		renderTodaysHours('#todays_hours_search_template','#todays-hours-search');
	});
	
	$('.primary-locale, .secondary-locale').hide();

	$.reject({  
		reject: { all: false, msie: 9 },  
		header: 'Thanks for visiting Les Colonnades Pointe-Claire', // Header Text  
		paragraph1: 'Unfortunately your browser is not officially supported with our site', // Paragraph 1  
		paragraph2: 'For the best experience please install one of the many optional browsers below to proceed',  
		closeMessage: 'You may continue using the site however certain features and content may not be accessible. Thank you.',
		closeCookie: true,
		browserInfo: { // Settings for which browsers to display  
			chrome: {  
				// Text below the icon  
				text: 'Google Chrome',  
				// URL For icon/text link  
				url: '//www.google.com/chrome/',  
				// (Optional) Use "allow" to customized when to show this option  
				// Example: to show chrome only for IE users  
				// allow: { all: false, msie: true }  
			},  
			firefox: {  
				text: 'Mozilla Firefox',  
				url: '//www.mozilla.com/firefox/'  
			},  
			safari: {  
				text: 'Safari',  
				url: '//www.apple.com/safari/download/'  
			},  
			opera: {  
				text: 'Opera',  
				url: '//www.opera.com/download/'  
			},  
			msie: {  
				text: 'Internet Explorer',  
				url: '//www.microsoft.com/windows/Internet-explorer/'  
			}  
		},// Message below close window link  
		imagePath: '//cdn.jsdelivr.net/jquery.jreject/1.0.2/images/'
	});      


	$('.en-CA').click(function(){
		$('.langSelect').removeClass('langSelect');
		$(this).addClass('langSelect');

		setPrimaryLanguage();
        
        renderPageData.render();
	});
	
	$('.fr-CA').click(function(){
		$('.langSelect').removeClass('langSelect');
		$(this).addClass('langSelect');

		setSecondaryLanguage();

        renderPageData.render();
		
	});


	$(document).bind('render:complete', function(){
		refreshCurrentLanguage();
	});
	
	//real time search
	$('#search_input').keyup(function(e){
		showSearchResults();
	});

	$('#search_input').on('input', function() {
		showSearchResults();
	});
    
	//Using i18n for localization, for more info please visit //i18next.com/
	i18n.init({preload: [sessionStorage.primary_locale,sessionStorage.secondary_locale],resGetPath: '../__lng__.json',fallbackLng: false }, 
		function(t) {
			var current_local = sessionStorage.primary_locale;
			if(typeof(sessionStorage.current_locale) != 'undefined' ){
				current_local = sessionStorage.current_locale;
			}
			// We're switching french to be the primary locale                
			if(current_local == sessionStorage.primary_locale){
				setPrimaryLanguage();
				$('.en-CA').addClass('langSelect');
				$('.fr-CA').removeClass('langSelect');
			}else{
				setSecondaryLanguage();
				$('.fr-CA').addClass('langSelect');
				$('.en-CA').removeClass('langSelect');
				
			}
		}
	);
					
	$('.close-search').click(function(){
		$('#search_results').hide();
	});
		
	$('#search_results_mobile').hide();
	$('#search_input_mobile').on('input', function() {
		$('#search_results_mobile').show();
		if($('#search_input_mobile').val().length == 0){
			var search_results = getSearchResults('xxxxxxxxxxxxxxxx',0,0);
			renderSearchResultsTemplate('#search_results_template','#search_results_items_mobile',search_results);
			$(document).i18n();
			$('#search_results_mobile').hide();
		}else{
			var search_results = getSearchResults($('#search_input_mobile').val(),10,100);
			$('.search-results-count').html(search_results.summary.count);
			//console.log('--------');
			renderSearchResultsTemplate('#search_results_template','#search_results_items_mobile',search_results);
			$(document).i18n();
			//console.log(getSearchResults($('#search_input').val(),100));
		}
	});
		
	$('.close-search-mobile').click(function(){
		var search_results = getSearchResults('xxxxxxxxxxxxxxxx',0,0);
		renderSearchResultsTemplate('#search_results_template','#search_results_items_mobile',search_results);
		$(document).i18n();
		$('#search_input_mobile').val('')
	});

	// hide #back-top first
	$("#back-top").hide();

	// fade in #back-top
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});

	// scroll body to 0px on click
	$('#back-top img').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});

	$('.dropdown').on('click', function() {
		$(this).toggleClass("open");
	});
	
	$(document).bind('render:ready', function() {
        loadMallDataCached(renderPageData.render);
	});

});