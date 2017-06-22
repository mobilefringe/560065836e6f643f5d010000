
$(document).ready(function() {
    function renderPropertyDescription(description_template, description_section, propertyDetails){
        var item_list = [];
        var item_rendered = [];
        var description_template_html = $(description_template).html();
        Mustache.parse(description_template_html);   // optional, speeds up future uses
        item_list.push(propertyDetails);
        $.each( item_list , function( key, val ) {
            var description_rendered = Mustache.render(description_template_html,val);
            item_rendered.push(description_rendered);
        });

        $(description_section).show();
        $(description_section).html(item_rendered.join(''));
    }
    
    function renderBanner(banner_template,home_banner,banners){
        var item_list = [];
        var item_secondary = [];
        
        console.log("rendering banners --", banners);
        var item_rendered = [];
        var banner_template_html = $(banner_template).html();
        Mustache.parse(banner_template_html);   // optional, speeds up future uses
        $.each( banners , function( key, val ) {
            today = new Date;
            start = new Date (val.start_date);
           
            start.setDate(start.getDate());
    
            // Skip rendering the banner images for the non associated locale.
            var list = item_list;
            if (!isSameLocale(Cookies.get('primary_locale'), val.locale)) {
                list = item_secondary;
            }
            
            if(val.url == "" || val.url === null){
                val.css = "style=cursor:default;";
                val.noLink = "return false";
            }
            
            if (start <= today){
                if (val.end_date){
                    end = new Date (val.end_date);
                    end.setDate(end.getDate() + 1);
            
                    if (end >= today){
                        list.push(val);  
                    }
                } else {
                    list.push(val);
                }
            }
        });
        
        var list = item_list;
        // If we are on the secondary locale but secondary locale is empty use primary locale.
        if (Cookies.get('secondary_locale') == Cookies.get('current_locale') && item_secondary.length > 0) {
            list = item_secondary;
        }
        
        $.each(list , function( key, val ) {
            var repo_rendered = Mustache.render(banner_template_html,val);
            item_rendered.push(repo_rendered);
        });
        
        $('#main_flexslider').remove();
        
        divFlexSlider = $('<div>').attr({'id' : 'main_flexslider', 'class' : 'flexslider'});
        ulFlex = $('<ul>').attr({ id: 'home_banner', 'class' : 'slides'});
        
        divFlexSlider.append(ulFlex);
        $('#slider_wrapper').append(divFlexSlider);
        
        $(home_banner).show();
        $(home_banner).html(item_rendered.join(''));
        
        $('.item').first().addClass('active');
        
        $('.flexslider').flexslider({
            animation: "slide",
            controlNav: true,
            directionNav: true,        
            prevText: "",
            nextText: ""
        });
    }
    
    function renderFeatureItems(feature_template,feature_items,featureList){
        var item_list = [];
        var item_rendered = [];
        var feature_template_html = $(feature_template).html();
        Mustache.parse(feature_template_html);   // optional, speeds up future uses
        count = 0
        $.each( featureList , function( key, val ) {
            if (count < 3){

                val.image_url_locale = val.image_url;
                val.name_locale = val.name;

                if (sessionStorage.current_locale == sessionStorage.secondary_locale) {
                    if (val.image_url_2) {
                        val.image_url_locale = val.image_url_2;
                    }
                    
                    if (val.name_2) {
                        val.name_locale = val.name_2;
                    }
                }        
                
                var featureitem_rendered = Mustache.render(feature_template_html,val);
                item_rendered.push(featureitem_rendered);
                count = count + 1    
            }
            
           
        });
       
        $(feature_items).show();
        $(feature_items).html(item_rendered.join(''));
    }
    
    renderPageData.add(function(){
        var repoList = getRepoList();
        var featureList = getFeatureList();
        var propertyDetails = getPropertyDetails();
        var banners = getBanners();
    
        renderBanner('#banner_template','#home_banner',banners);
        renderFeatureItems('#feature_template', '#feature_items', featureList)
        renderPropertyDescription('#description_template','#description_section', propertyDetails )
        $("#feature_items > :nth-child(3n)").css("margin-right","0");
        
    });

    $(document).trigger('render:ready');
});