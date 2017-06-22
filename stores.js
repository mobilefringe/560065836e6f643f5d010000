// Done to avoid namespace problems with renderPageData
rpd = renderPageData;

$(document).ready(function() {

    if(navigator.appVersion.indexOf("MSIE 9.") == -1){
        
    } else {
        $("#map_link").hide();
    }

    function show_cat(link, type){
        $(".cat_links").css("font-weight","normal");
        
        if (type == "all"){
            $("#mobile_view_all_link").css("font-weight","bold");
            $("#view_all_link").css("font-weight","bold");
            $("#no_cat_list").show();
            $(".cat_list_div").hide();    
        } else {
            $("#mobile_"+link+"_link").css("font-weight","bold");
            $("#"+link+"_link").css("font-weight","bold");
            $("#no_cat_list").hide();
            $(".cat_list_div").hide();
            $("#"+link).show();    
        }
    }

   
    function renderAll (){
        var stores = getStoresList();
        var category_stores = getStoresListByCategory();
        var categories = getStoreCategories();
        var propertyDetails = getPropertyDetails();
        
        for (var x in stores) {
            stores[x].name_locale = stores[x].name;
            if (Cookies.get('secondary_locale') == Cookies.get('current_locale')) {
                if (stores[x].name_2) {
                    stores[x].name_locale = stores[x].name_2;
                }
            }
        }
        
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        renderPageData('#store_list_container','#store_list_template', stores, "stores");
        // renderPageData('#categories_container', '#categories_list_template', categories, "categories");
        render_categories(categories);
        render_category_stores();  
        
        $("#loading_screen").hide();
        $("#main_content").show();
        $(document).trigger('render:complete');
    }
    

    function render_categories(categories){
        
        $("#categories_container > .cat_links").not('#view_all_link, #mobile_view_all_link').remove();
        
        $.each( categories , function( key, val ) {
            val.link = "cat" + val.id;
            cat_name = val.name;
            
            if (Cookies.get('secondary_locale') == Cookies.get('current_locale') && val.name_2) {
                cat_name = val.name_2;
            }
            
            var aCatLink = $('<a>').attr({
                "href" : "#categories_container",
                "class" : "cat_links directory_content",
                "id" : 'cat' + val.id + '_link'
            }).text(
                cat_name
            ).bind('click', 
                function() {
                    show_cat(val.link);
                }
            );
            
            $("#categories_container").append(aCatLink);
            
            var aMobileCatLink = aCatLink.clone();
            aMobileCatLink.attr('id', "mobile_cat" + val.id +'_link');
            $("#mobile_categories_container").append(aMobileCatLink);
        });
        
        $('#view_all_link').click();

    }
    
    function renderPageData(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "property_details"){
            item_list.push(collection);
            collection = []
            collection = item_list;
        }
        $.each( collection , function( key, val ) {
            if (type == "stores" || type == "category_stores"){
                if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                        val.alt_store_front_url = "//kodekloud.s3.amazonaws.com/sites/54cfab316e6f6433ad020000/77c900d783abeb362232339ece231335/10dundas_default.jpg"    
                    } else {
                        val.alt_store_front_url = getImageURL(val.store_front_url);    
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
            }
            
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    }


    function render_category_stores(){
        
        var category_stores = [];
        var item_rendered = [];
        var all_stores = getStoresList();
        var all_categories = getStoreCategories();
        var test = []
        var template_html = $("#category_store_list_template").html();

        for (var x in all_stores) {
            all_stores[x].name_locale = all_stores[x].name;
            if (Cookies.get('secondary_locale') == Cookies.get('current_locale')) {
                if (all_stores[x].name_2) {
                    all_stores[x].name_locale = all_stores[x].name_2;
                }
            }
        }

        
        Mustache.parse(template_html);
        for (i = 0; i < all_categories.length; i++) {
            var stores_per_cat = [];
            for (j = 0; j < all_stores.length; j++) {
                if($.inArray(parseInt(all_categories[i].id), all_stores[j].categories) > -1){
                    all_stores[j].cat_name = all_categories[i].name;
                    category_stores.push(all_stores[j]);
                    stores_per_cat.push(all_stores[j]);
                }
            
            }
            var rendered = Mustache.render(template_html,all_categories[i]);
            item_rendered.push(rendered);
        }
        $("#store_category_list_container").show();
        $("#store_category_list_container").html(item_rendered.join(''));
        for (i = 0; i < all_categories.length; i++) {
            var stores_per_cat = [];
            for (j = 0; j < all_stores.length; j++) {
                if($.inArray(parseInt(all_categories[i].id), all_stores[j].categories) > -1){
                    all_stores[j].cat_name = all_categories[i].name;
                    all_stores[j].alt_store_front_url = getImageURL(all_stores[j].store_front_url);    
                    populate_stores_for_cat(all_categories[i].id, all_stores[j]);
                }
            
            }
        }
        
    };

    function populate_stores_for_cat (categoryid, store){
        $('#cat'+categoryid+'_list').append('<span id="store_for_'+store.id+'"><a href="../stores/'+store.slug+'"><p class="directory_content directory_name_col">'+store.name_locale+'</p></a><a href="tel:'+store.phone+'"><p class="directory_content directory_phone_col">  '+store.phone+'</p></a></span>');
        
    }
    
     

    function goToStore(store_details){
        if(typeof(store_details) != 'undefined' && store_details != null){
            window.location.href = "/stores/"+store_details.slug;
        }
    }
    
    function getSVGMapURL(){
        initData();
        var mallDataJSON = JSON.parse(getStorage().mallData);
        return 'https://mallmaverick.cdn.speedyrails.net' + mallDataJSON.property.svgmap_url;
    }
    
    $('#view_all_link, #mobile_view_all_link').bind('click', function(e) {
        e.preventDefault();
        show_cat('view_all', 'all');
    });
    
    rpd.add(renderAll);
    $(document).trigger('render:ready');
});