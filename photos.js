rpd = renderPageData;
$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        var repoList = getRepoList();  
        renderPhotos("#photo_container", "#photo_template", repoList);
        $("#loading_screen").hide();
        $("#main_content").show();
        $.getScript("http://cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
        $('head').append('<link rel="stylesheet" href="http://cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
    }
    
    function renderPhotos(container, template, collection){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        $.each( collection , function( key, val ) {
            if( val.name == "photos"){
                $.each( val.images , function( key, val ) {
                    val.alt_url = getImageURL(val.photo_url);
                    item_list.push(val);
                    
                });
            }
        });
        $.each( item_list , function( key, val ) {
            var repo_rendered = Mustache.render(template_html,val);
            item_rendered.push(repo_rendered);
        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));    
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
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };

    rpd.add(renderAll); 
    $(document).trigger('render:ready');
    
    $.getScript("http://cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
    $('head').append('<link rel="stylesheet" href="http://cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
        

});