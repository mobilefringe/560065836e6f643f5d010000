rpd = renderPageData;

$(document).ready(function() {
    function renderPageData(){
        //renders the store list by referencing the template id and the html id
        //for where to place the rendered content. See mallmaverick.js for implementation
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        var store_details = getStoreDetailsBySlug(slug);
        if (store_details.store_hours != null){
            $("#hours_title").show();
        } 
        store_details.x_coordinate = store_details.x_coordinate - 17;
        store_details.y_coordinate = store_details.y_coordinate - 75;
        
        var store_promos = getPromotionsForIds(store_details.promotions);
        store_promos = store_promos.reverse();
        promo_array = []
        $.each( store_promos , function( key, val ){
            today = moment();
            webDate = moment(val.show_on_web_date);
            if (today >= webDate) {
                promo_array.push(val)
            } 
        });
        store_promos = promo_array;
        
        var jobs = getJobsForIds(store_details.jobs);
        jobs = jobs.reverse();
        jobs_array = []
        $.each( jobs , function( key, val ){
            today = moment();
            webDate = moment(val.show_on_web_date);
            if (today >= webDate) {
                jobs_array.push(val)
            } 
        });
        jobs = jobs_array;
        
        store_details.name_locale = store_details.name
        if (Cookies.get('secondary_locale') == Cookies.get('current_locale')) {
            if (store_details.name_2) {
                store_details.name_locale = store_details.name_2;
            }
        }
        
        $('#loading_screen').hide();
        $('#main_content').fadeIn();
        // store_details.map_x_coordinate = store_details.x_coordinate - 19;
        // store_details.map_y_coordinate = store_details.y_coordinate - 58;
        renderTemplate("#store_title_container","#store_title_template", store_details, "store_details");
        renderTemplate("#store_desc_container", "#store_desc_template", store_details, "store_details");
        renderTemplate("#store_detail_container","#store_detail_template", store_details, "store_details");
        renderTemplate("#store_hours_container","#store_hours_template", store_details, "hours");
        renderTemplate("#store_detail_container2","#store_detail_template2", store_details, "store_details");
        renderTemplate("#promo_list_container","#promo_list_template", store_promos, "promotions");
        renderTemplate("#job_list_container","#job_list_template", jobs, "jobs");
        renderTemplate("#mobile_promo_list_container","#mobile_promo_list_template", store_promos, "promotions");
        renderTemplate("#mobile_job_list_container","#mobile_job_list_template", jobs, "jobs");
        renderStoreDetailsTemplate('#store_deatils_map_template','#store_map',store_details);
        
        var propertyDetails = getPropertyDetails();
        $("#map_image").attr("src", getPNGMapURL())
        $(function(){
            $('.demo1').craftmap({
                image: {
                    width: propertyDetails.map_image_width,
                    height: propertyDetails.map_image_height,
                    name: 'imgMap'
                },
                map: {
                    position: 'center'
                }
            });
            $("#anchor_id").click();
            $("#scroll_to_marker").click();
        });
        $.getScript("//bkindoortemplate.codecloudapp.com/slimbox_mod.js");
        $('head').append('<link rel="stylesheet" href="//cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
        $(document).trigger('render:complete');
    }
    
    rpd.add(renderPageData);
    
    function renderTemplate(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "store_details"){
            item_list.push(collection)
            $.each( item_list , function( key, val ) {
                if (val.phone){
                    $("#phone_label").show();
                } else {
                    $("#phone_label").hide();
                }
                
                if (val.email){
                    $("#email_label").show();
                } else {
                    $("#email_label").hide();
                }
                switch(val.z_coordinate) {
                    case 0: 
                        val.z_coordinate = "B2"
                        break;
                    case 1:
                        val.z_coordinate = "B1"
                        break;
                    case 2:
                        val.z_coordinate = "Level 1"
                        break;
                    case 3:
                        val.z_coordinate = "Level 2"
                        break;
                    case 4:
                        val.z_coordinate = "Level 3"
                        break;
                    case 5:
                        val.z_coordinate = "Level 4"
                        break;
                    case 6:
                        val.z_coordinate = "Level 5"
                        break;
                }
                if ((val.store_front_url).indexOf('missing.png') > -1){
                    val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/560065836e6f643f5d010000/bbd3b2e11fada4dc74c91780c173e4cf/default.jpg"
                } else {
                    val.alt_store_front_url = getImageURL(val.store_front_url); 
                }
 
                val.hours = getHoursForStoreSlug(val.slug).sortBy(function(o){ return o.day_of_week });
                var rendered = Mustache.render(template_html,val);
                item_rendered.push(rendered);
            });
        } else if(type == "hours"){
            hours = getHoursForStoreSlug(collection.slug).sortBy(function(o){ return o.day_of_week });
            $.each( hours , function( key, val ) {
                switch(val.day_of_week) {
                    case 0:
                        val.day = $.t('app.days.sunday');
                        break;
                    case 1:
                        val.day = $.t('app.days.monday');
                        break;
                    case 2:
                        val.day = $.t('app.days.tuesday');
                        break;
                    case 3:
                        val.day = $.t('app.days.wednesday');
                        break;
                    case 4:
                        val.day = $.t('app.days.thursday');
                        break;
                    case 5:
                        val.day = $.t('app.days.friday');
                        break;
                    case 6:
                        val.day = $.t('app.days.saturday');
                        break;
                }
                if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
                    val.open_time = moment(val.open_time).tz(getPropertyTimeZone()).format("h:mm A");
                    val.close_time = moment(val.close_time).tz(getPropertyTimeZone()).format("h:mm A");
                } else {
                    val.h = val.day + ": Closed"
                }
                
                var rendered = Mustache.render(template_html,val);
                item_rendered.push(rendered);
            });
        } else {
            $.each( collection , function( key, val ) {
                if(type == "promotions"){
                    var start = moment(val.start_date).tz(getPropertyTimeZone());
                    var end = moment(val.end_date).tz(getPropertyTimeZone());
                    val.dates = start.format("MMM D") + " - " + end.format("MMM D");
                    
                    if (val.description.length > 110) {
                       val.description =  val.description.substring(0,100)+'...';
                    }
                    if ((val.promo_image_url).indexOf('missing.png') > -1){
                        var pathArray = window.location.pathname.split( '/' );
                        var slug = pathArray[pathArray.length-1];
                        var store_details = getStoreDetailsBySlug(slug);
                        val.alt_promo_image_url = val.promo_image_url_abs;
                    } 
                    if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
                        val.alt_promo_image_url = store_details.store_front_url_abs;
                    }   

                    $("#promo_header").show();   
                    $("#mobile_promo_header").show();  
                }
                if (type == "jobs") {
                    var pathArray = window.location.pathname.split( '/' );
                    var slug = pathArray[pathArray.length-1];
                    var store_details = getStoreDetailsBySlug(slug);
                    val.image_url = getImageURL(store_details.store_front_url);
                    $("#job_header").show();  
                    $("#mobile_job_header").show(); 
                }
                var rendered = Mustache.render(template_html,val);
                item_rendered.push(rendered);
            });
        }
        $(container).show();
        $(container).html(item_rendered.join(''));
        if (type == "store_details"){
            if (collection.website != "" && collection.website != undefined){
                $("#store_website_link").show();
            }
        }
    }

    $(document).trigger('render:ready');
});
    
    var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
    $("#pop-over").hide();
    var didPanZoom = false;
    var pathArray = window.location.pathname.split( '/' );
    var slug = pathArray[pathArray.length-1];
    var store_details = getStoreDetailsBySlug(slug);
    // renderSVGMap(store_details);
    
    
    function renderSVGMap(store_details){
            if(navigator.appVersion.indexOf("MSIE 9.") == -1){
                $('#map').bind('mousemove', function(e){
                    //console.log(e.pageX+","+e.pageY);
                   $('#pop-over').css({'top':e.pageY+20,'left':e.pageX-70});
                });
                // var s = Snap("#map");
                // var store_svg_id = null;
                // if(store_details.svgmap_region != null && typeof(store_details.svgmap_region)  != 'undefined'){
                //     store_svg_id = "#"+ store_details.svgmap_region;
                // }
                // var stores = getStoresList();
                // Snap.load(getSVGMapURL(), function (f) {
                //     if(store_svg_id!=null){
                //         f.select(store_svg_id).addClass("map-mouse-over");
                //         console.log(store_svg_id)
                        
                //     }
                //     $.each( stores, function( key, value ) {
                //         if(value.svgmap_region != null && typeof(value.svgmap_region)  != 'undefined'){
                //             var svg_id = "#" + value.svgmap_region;
                //             f.select(svg_id).mouseover(function() {
                //                 if(typeof(value) != 'undefined' && value != null){
                //                     this.addClass("map-mouse-over");
                //                     $("#pop-over").show();
                //                     $("#pop-over-map-name").html(value.name);
                //                     $("#pop-over-map-phone").html(value.phone);
                //                     // console.log(this.getBBox());
                //                 }
                                          
                //             });
                                
                //             //add the mouse up handler for hiding the pop over when done hovering
                            
                //                 f.select(svg_id).mouseout(function() {
                //                     if (svg_id != store_svg_id) {
                //                         this.removeClass("map-mouse-over");    
                //                     }
                                    
                //                     $("#pop-over").hide(0);
                                    
                //                 });
                                    
                            
                            
                //             //add the mouse up function for when the user clicks a store
                //             f.select(svg_id).mouseup(function() {
                                
                //                 if(!isMobile && !didPanZoom){
                                    
                //                     goToStore(value);
                //                 }
                //                 didPanZoom = false;
                                      
                //             });
                //         }
                //     });
                //     s.append(f.select("svg"));
                    
                    
                    
                // });
                
                var startingMapTransform = 'scale(0.65)';
                var startingPanX = -200;
                var startingPanY = -100;
                if(isMobile) {
                        startingMapTransform = 'scale(0.20)';
                        startingPanX = -170;
                        startingPanY = -200;
                }
                $('#loading').hide();
                $( "#page_content" ).fadeIn( "fast", function() {
                    var panzoom = $(".panzoom-elements").panzoom({
                        cursor: "move",
                        increment: 0.15,
                        minScale: 0.15,
                        maxScale: 20,
                        transition: true,
                        duration: 150,
                        easing: "ease-in-out",
                        $zoomIn: $('.zoom-in'),
                        $zoomOut: $('.zoom-out'),
                        $zoomRange: $('.zoom-range'),
                        startTransform: startingMapTransform
            
                    });
                    $(".panzoom-elements").panzoom("pan", startingPanX, startingPanY, { relative: true });
                    
                    panzoom.on('panzoomchange', function(e, panzoom, matrix, changed) {
                      didPanZoom = true;
                    });
                    
                    panzoom.on('panzoomend', function(e, panzoom, matrix, changed) {
                      didPanZoom = false;
                    });
                });
            }else{
                $('#loading').hide();
                $('#zControls').hide();
                $('#map').hide();
                $( "#page_content" ).fadeIn( "fast");
            }
        }

    function goToStore(store_details){
        if(typeof(store_details) != 'undefined' && store_details != null){
            window.location.href = "/stores/"+store_details.slug;
        }
    }
