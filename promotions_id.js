rpd = renderPageData;

$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        promo_details = getPromotionDetailsBySlug(slug);
        renderPageData('#breadcrumb_container','#breadcrumb_template',promo_details, 'promo_details')
        renderPageData('#banner_container','#banner_template',promo_details, 'promo_details')
        render_page_details("#promo_container", "#promo_template", promo_details)
        
        $.getScript("//cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
        $('head').append('<link rel="stylesheet" href="//cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
      
        $("#loading_screen").hide();
        $("#main_content").show();
        $(document).trigger('render:complete');
    }
    

    function renderPageData(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "property_details" || type == "promo_details"){
            item_list.push(collection);
            collection = []
            collection = item_list;
        }
        $.each( collection , function( key, val ) {
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);
        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };
    
    function render_page_details(container, template, collection){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        item_list.push(collection);
        $.each( item_list , function( key, val ) {
            if ((val.promo_image_url).indexOf('missing.png') > -1 || val.promo_image_url == null){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.alt_promo_image_url = val.promo_image_url_abs;
                    val.alt_promo_image_url_2 = val.promo_image2_url_abs;
                    val.store_detail_btn = store_details.slug 
                    val.store_name = store_details.name
                }
                if((val.promo_image_url_abs).indexOf('missing.png') > -1){
                    var store_front = getImageURL(store_details.store_front_url);
                    val.alt_promo_image_url = store_front;
            
                    if(store_front == null) {
                        val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/560065836e6f643f5d010000/bbd3b2e11fada4dc74c91780c173e4cf/default.jpg"
                        val.alt_promo_image_url_2 = "//codecloud.cdn.speedyrails.net/sites/560065836e6f643f5d010000/bbd3b2e11fada4dc74c91780c173e4cf/default.jpg"
                    }
                }
            } else {
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug 
                    val.store_name = store_details.name
                }
                val.alt_promo_image_url = getImageURL(val.promo_image_url);
                val.alt_promo_image_url_2 = getImageURL(val.promo_image2_url);
            }
            var start = moment(val.start_date).tz(getPropertyTimeZone());
            var end = moment(val.end_date).tz(getPropertyTimeZone());
            if (start.format("DMY") == end.format("DMY")){
            	val.dates = start.format("MMM D");
            } else {
            	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);
        });
        $(container).show();
        $(container).html(item_rendered.join(''));
        if (collection.promotionable_type == "Store"){
            $("#store_btn").show();
        }
    }
    
    rpd.add(renderAll);
    $(document).trigger('render:ready');
});